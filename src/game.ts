import _ from "lodash";

type PositionKey = typeof offsetMap extends Map<infer K, any> ? K : never;

// temporarily hardcoded
export const MINE_COUNT = 500;
export const FIELD_WIDTH = 50;
export const FIELD_HEIGHT = 50;
export const FIELD_SIZE = FIELD_WIDTH * FIELD_HEIGHT;

const offsetMap = new Map([
	["top-left", FIELD_WIDTH - 1],
	["top", FIELD_WIDTH],
	["top-right", FIELD_WIDTH + 1],
	["left", -1],
	["right", 1],
	["bottom-left", -FIELD_WIDTH - 1],
	["bottom", -FIELD_WIDTH],
	["bottom-right", -FIELD_WIDTH + 1],
] as const);

const getNeighbor = (index: number, key: PositionKey) => {
	if (!_.inRange(index, FIELD_SIZE)) return null;
	if (key.includes("left") && index % FIELD_WIDTH === 0) return null;
	if (key.includes("right") && index % FIELD_WIDTH === FIELD_WIDTH - 1)
		return null;
	if (key.includes("bottom") && index < FIELD_WIDTH) return null;
	if (key.includes("top") && index >= FIELD_SIZE - FIELD_WIDTH) return null;
	return index + offsetMap.get(key)!;
};

const MINE = "X";
const EMPTY = ".";

const getValues = (mask: string[]) =>
	mask.map((value, index, array) => {
		if (value === MINE) return 9;
		return _.sum(
			Array.from(offsetMap.keys(), (key) => {
				const neighbor = getNeighbor(index, key);
				return neighbor === null || array[neighbor] === EMPTY ? 0 : 1;
			}),
		);
	});

export const createField = () =>
	getValues(_.shuffle(MINE.repeat(MINE_COUNT).padEnd(FIELD_SIZE, EMPTY)));
