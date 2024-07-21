import _ from "lodash";
import * as redis from "@/utils/redis";

export type PlotState = number | "mine" | "unknown" | "flagged";

export class Field {
  private constructor(
    public readonly size: number,
    public readonly mineCount: number,
    private readonly data: number[],
    public readonly plots: PlotState[] = data.map(getState),
  ) {
    const setBit = redis.getDebouncedSetBit();
    this.data = new Proxy(data, {
      set: (target, prop, value) => {
        const index = typeof prop !== "number" ? _.toNumber(prop) : prop;
        this.plots[index] = getState(value);
        setBit(index, value);
        return Reflect.set(target, index, value);
      },
    });
  }

  public static async create(size = 50) {
    const area = size ** 2;
    const mineCount = Math.round(area * 0.15);
    const data = await redis.encodeData(
      _.shuffle("x".repeat(mineCount).padEnd(area)).map((char, index, mask) => {
        return char === " "
          ? _.sum(getOffsets(size, index).map((index) => mask[index] !== " "))
          : 9;
      }),
    );
    return new Field(size, mineCount, data);
  }

  public static async fromRedis() {
    try {
      const data = await redis.decodeData();
      const size = Math.sqrt(data.length);
      const mineCount = _.sum(data.map(isMine));
      return new Field(size, mineCount, data);
    } catch {
      return Field.create();
    }
  }

  public exposeCell(index: number) {
    if (!_.isNil(this.data[index]) && !isExposed(this.data[index])) {
      // set exposed state bit, unset the flagged state bit
      this.data[index] = (this.data[index] | (1 << 5)) & ~(1 << 4);
      if (getValue(this.data[index]) === 0) {
        getOffsets(this.size, index).forEach(this.exposeCell.bind(this));
      }
    }
  }

  public flagCell(index: number) {
    if (!_.isNil(this.data[index]) && !isExposed(this.data[index])) {
      // toggle the flagged state bit
      this.data[index] ^= 1 << 4;
    }
  }

  public get isComplete() {
    return this.data.every((data, index) => {
      const plot = this.plots[index]!;
      return (isMine(data) && plot === "flagged") || typeof plot === "number";
    });
  }
}

function getOffsets(size: number, index: number) {
  const [x, y] = [index % size, Math.floor(index / size)];
  const [isLeft, isRight] = [x === 0, x === size - 1];
  const [isTop, isBottom] = [y === 0, y === size - 1];
  return [
    !isTop && !isLeft && index - size - 1,
    !isTop && index - size,
    !isTop && !isRight && index - size + 1,
    !isLeft && index - 1,
    !isRight && index + 1,
    !isBottom && !isLeft && index + size - 1,
    !isBottom && index + size,
    !isBottom && !isRight && index + size + 1,
  ].filter((offset) => offset !== false);
}

function getState(byte: number) {
  switch (byte >> 4) {
    case 0b0000:
      return "unknown";
    case 0b0001:
      return "flagged";
    case 0b0010:
      return isMine(byte) ? "mine" : getValue(byte);
    default:
      throw new Error(`unexpected state on byte: ${byte.toString(2)}`);
  }
}

function getValue(byte: number) {
  return byte & 0b1111;
}

function isExposed(byte: number) {
  return byte & (1 << 5) ? true : false;
}

function isMine(byte: number) {
  return getValue(byte) === 9;
}
