/// <reference lib="dom" />
import { useState } from "hono/jsx";
import { render } from "hono/jsx/dom";

function App() {
	const [count, setCount] = useState(0);
	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>Increment</button>
		</div>
	);
}

const root = document.getElementById("app-root");
render(<App />, root!);
