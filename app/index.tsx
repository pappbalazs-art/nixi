import { createComponent, Fragment, h, Text, View } from "../src/core";
import { renderComponent } from "../src/platform/browser";

const domElement = document.getElementById("nixi-app");
//const domElement2 = document.getElementById("nixi-app2");
//const domElement2 = document.getElementById("nixi-app3");

const div = (props = {}) => View({ ...props, as: "div" });
const button = (props = {}) => View({ ...props, as: "button" });
const input = (props = {}) => View({ ...props, as: "input", isVoid: true });

let nextId = 0;
const buildData = (count, prefix = "") => {
	return Array(count)
		.fill(0)
		.map((_, idx) => ({
			id: ++nextId,
			name: `item ${idx + 1} ${prefix}`,
		}));
};

type WithListProp = {
	list: Array<{ id: number; name: string }>;
};

const state = {
	list: buildData(10),
};

const List = createComponent<WithListProp & { onRemove }>(
	({ list, onRemove }) => {
		return list.map((x, idx) => {
			return div({
				key: x.id,
				slot: [
					Text(x.name),
					button({
						onClick: () => onRemove(x),
						slot: Text("remove " + x.id),
					}),
				],
			});
		});
	}
);

const Header = createComponent<{
	onAdd: Function;
	onUpdateAll: Function;
	onSwap: Function;
}>(({ onAdd, onUpdateAll, onSwap }) => {
	return [
		div({
			style:
				"width: 100%; height: 64px; background-color: blueviolet; display: flex; flex-align-items: center; padding: 16px",
			slot: [
				button({
					onClick: onAdd,
					slot: Text("Add 1000 rows"),
				}),
				button({
					onClick: onUpdateAll,
					slot: Text("Update all rows"),
				}),
				button({
					onClick: onSwap,
					slot: Text("Swap rows"),
				}),
			],
		}),
	];
});

const App = createComponent(() => {
	const handleAdd = () => {
		console.time("add");

		state.list = [...buildData(4, "!!!"), ...state.list];
		renderComponent(App(), domElement);

		console.timeEnd("add");
	};
	const handleUpdateAll = () => {
		console.time("update all");

		state.list = state.list.map((x) => ({ ...x, name: x.name + "!!!" }));
		renderComponent(App(), domElement);

		console.timeEnd("update all");
	};
	const handleRemove = (x) => {
		const idx = state.list.findIndex((z) => z.id === x.id);
		state.list.splice(idx, 1);

		renderComponent(App(), domElement);
	};
	const handleSwap = () => {
		if (state.list.length > 998) {
			const temp = state.list[1];
			state.list[1] = state.list[998];
			state.list[998] = temp;
		}

		console.time("swap");

		renderComponent(App(), domElement);

		console.timeEnd("swap");
	};

	return div({
		slot: [
			Header({
				onAdd: handleAdd,
				onUpdateAll: handleUpdateAll,
				onSwap: handleSwap,
			}),
			List({ list: state.list, onRemove: handleRemove }),
		],
	});
});

console.time("add");

renderComponent(App(), domElement);

console.timeEnd("add");
