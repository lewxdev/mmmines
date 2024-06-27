/// <reference lib="dom" />

import { render } from "hono/jsx/dom";
import { Field } from "./game";

const GRID_SIZE = 20;
const field = new Field();

function App() {
	return (
		<div
			className={`grid gap-[${GRID_SIZE * 0.1}px] grid-cols-[repeat(${field.width}, ${GRID_SIZE}px)] grid-rows-[repeat(${field.height}, ${GRID_SIZE}px)]`}>
			{field["data"].map((n, index) => {
				const value = n % 10;
				const color = `bg-${value < 9 ? `gray-${value * 100 || 50}` : "red-500"}`;
				const handleClick = () => console.log(value); // tests interactivity
				return <div className={color} key={index} onClick={handleClick} />;
			})}
		</div>
	);
}

render(<App />, document.getElementById("app")!);
