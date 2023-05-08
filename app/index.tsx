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

const App = createComponent<WithListProp>(({ list }) => {
	const handleAdd = () => {
		console.time("add");

		list = [...buildData(1000, "!!!"), ...list];
		renderComponent(App({ list }), domElement);

		console.timeEnd("add");
	};
	const handleUpdateAll = () => {
		console.time("update all");

		list = list.map((x) => ({ ...x, name: x.name + "!!!" }));
		renderComponent(App({ list }), domElement);

		console.timeEnd("update all");
	};
	const handleRemove = (x) => {
		const idx = list.findIndex((z) => z.id === x.id);
		list.splice(idx, 1);

		renderComponent(App({ list }), domElement);
	};
	const handleSwap = () => {
		if (list.length > 998) {
			const temp = list[1];
			list[1] = list[998];
			list[998] = temp;
		}

		console.time("swap");

		renderComponent(App({ list }), domElement);

		console.timeEnd("swap");
	};

	return div({
		slot: [
			Header({
				onAdd: handleAdd,
				onUpdateAll: handleUpdateAll,
				onSwap: handleSwap,
			}),
			List({ list, onRemove: handleRemove }),
		],
	});
});

const initialList = buildData(10000);

console.time("add");

renderComponent(App({ list: initialList }), domElement);

console.timeEnd("add");
