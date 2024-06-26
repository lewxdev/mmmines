import { FIELD_HEIGHT, FIELD_WIDTH, createField } from "./game";

const field = createField();

export default function App() {
	return (
		<div
			className={`grid gap-1 grid-cols-[repeat(${FIELD_WIDTH}, 50px)] grid-rows-[repeat(${FIELD_HEIGHT}, 50px)]`}>
			{field.map((n, index) => {
				const value = n % 10;
				return (
					<div
						className="select-none p-2 text-center bg-gray-200 hover:bg-gray-300 active:bg-gray-400"
						key={index}>
						{value === 9 ? "X" : value === 0 ? "" : value}
					</div>
				);
			})}
		</div>
	);
}
