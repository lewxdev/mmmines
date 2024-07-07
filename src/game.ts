import { shuffle } from "lodash";

export class Field {
	/**
	 * a representation of the field where each cell is represented by a `number`
	 * value indicating the cell's state (an integer between `0` and `29`).
	 * - `0-9`: not-exposed, not-flagged (flagged: `+10`, exposed: `+20`)
	 * - `10-19`: not-exposed, flagged (not-flagged: `-10`, exposed: `+10`)
	 * - `20-29`: exposed
	 *
	 * this is used to store the `Field` as a bitfield in redis.
	 */
	public readonly data: number[];
	/**
	 * the side length of the field. for now, the field is always a square since
	 * it makes it easier to construct the `Field` from the bitfield
	 * representation.
	 */
	public readonly length: number;
	/**
	 * the number of mines in the field.
	 */
	public readonly mineCount: number;

	public constructor(init: number | string | null) {
		// init with length
		if (!init || typeof init === "number") {
			const length = Math.max(typeof init === "number" ? init : 0, 50);
			const mineCount = Math.round(length ** 2 * 0.2);
			const area = length ** 2;

			this.data = shuffle("x".repeat(mineCount).padEnd(area)).map(
				(placeholder, index, mask) => {
					return placeholder.trim()
						? 9
						: this.offsetMap.reduce((result, [key, offset]) => {
								return index >= 0 &&
									index < area &&
									!(key.match("left") && index % length === 0) &&
									!(key.match("right") && index % length === length - 1) &&
									!(key.match("bottom") && index < length) &&
									!(key.match("top") && index >= area - length) &&
									mask[index + offset].trim()
									? result + 1
									: result;
							}, 0);
				},
			);
			this.length = length;
			this.mineCount = mineCount;
		}

		// init with redis data
		else {
			this.data = Array.from(new Uint8Array(init.length), (_, index) => {
				return init.charCodeAt(index);
			});
			this.length = Math.sqrt(this.data.length);
			this.mineCount = this.data.reduce((result, value) => {
				return value % 10 === 9 ? result + 1 : result;
			}, 0);
		}
	}

	private get offsetMap(): [string, number][] {
		return [
			["top-left", this.length - 1],
			["top", this.length],
			["top-right", this.length + 1],
			["left", -1],
			["right", 1],
			["bottom-left", -this.length - 1],
			["bottom", -this.length],
			["bottom-right", -this.length + 1],
		];
	}

	/**
	 * a _client-safe_ representation of the field where exposed cells are
	 * represented by a `number` value (an integer between `0` and `9`) and non-
	 * exposed cells are represented by a `boolean` value indicating whether the
	 * cell is flagged or not.
	 * - `false`: not-exposed, not-flagged
	 * - `true`: not-exposed, flagged
	 * - `0-9`: exposed
	 *
	 * this is used to display the field to the client on initial load.
	 */
	public get state() {
		return this.data.map((value) => (value >= 20 ? value % 10 : value >= 10));
	}
}
