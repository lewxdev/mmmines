import _ from "lodash";

export class Field {
	protected readonly data: number[];
	public static isMine = (value: number) => value % 10 === 9;
	public static isFlagged = (value: number) => _.inRange(value, 10, 20);
	public static isExposed = (value: number) => value >= 20;

	public constructor(
		public readonly width = 50,
		public readonly height = 50,
		public readonly mineCount = Math.round(width * height * 0.2),
	) {
		const MINE = "x";
		const EMPTY = " ";

		const area = width * height;
		const mask = _.shuffle(MINE.repeat(mineCount).padEnd(area, EMPTY));
		const offsetMap: [string, number][] = [
			["top-left", width - 1],
			["top", width],
			["top-right", width + 1],
			["left", -1],
			["right", 1],
			["bottom-left", -width - 1],
			["bottom", -width],
			["bottom-right", -width + 1],
		];

		// todo: make this async to support large fields and suspense
		this.data = mask.map((placeholder, index) =>
			placeholder === MINE
				? 9
				: _.sum(
						offsetMap.map(
							([key, offset]) =>
								_.inRange(index, area) &&
								!(key.match("left") && index % width === 0) &&
								!(key.match("right") && index % width === width - 1) &&
								!(key.match("bottom") && index < width) &&
								!(key.match("top") && index >= area - width) &&
								mask[index + offset] === MINE,
						),
					),
		);
	}
}
