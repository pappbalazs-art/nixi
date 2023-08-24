import { createComponent, Text, View } from "../src/core";
import { renderComponent } from "../src/platform/browser";

const domElement = document.getElementById("nixi-app");

const div = (props = {}) => View({ ...props, as: "div" });
const button = (props = {}) => View({ ...props, as: "button" });
const table = (props = {}) => View({ ...props, as: "table" });
const tbody = (props = {}) => View({ ...props, as: "tbody" });
const tr = (props = {}) => View({ ...props, as: "tr" });
const td = (props = {}) => View({ ...props, as: "td" });

let nextId = 0;
const buildData = (count, prefix = "") => {
	return Array(count)
		.fill(0)
		.map((_, idx) => ({
			id: ++nextId,
			name: `item ${idx + 1} ${prefix}`,
			select: false,
		}));
};

const state = {
	list: buildData(1000),
};

type HeaderProps = {
	onAdd: Function;
	onUpdateAll: Function;
	onSwap: Function;
	onClear: Function;
};

const Header = createComponent<HeaderProps>(
	({ onAdd, onUpdateAll, onSwap, onClear }) => {
		return [
			div({
				style: "width: 100%; height: 64px; background-color: blueviolet; display: flex; flex-align-items: center; padding: 16px",
				slot: [
					button({
						onClick: onAdd,
						slot: Text("Add 100 rows"),
					}),
					button({
						onClick: onUpdateAll,
						slot: Text("Update all rows"),
					}),
					button({
						onClick: onSwap,
						slot: Text("Swap rows"),
					}),
					button({
						onClick: onClear,
						slot: Text("Clear rows"),
					}),
				],
			}),
		];
	}
);

type ListProps = {
	items: Array<{ id: number; name: string; select: boolean }>;
	onRemove: Function;
	onHighlight: Function;
};

const List = createComponent<ListProps>(({ items, onRemove, onHighlight }) => {
	return table({
		style: "width: 100%; border-collapse: collapse",
		slot: tbody({
			slot: items.map((x) => {
				const cellStyle = `border: 1px solid pink; ${
					x.select ? "background-color: green;" : ""
				}`;

				return tr({
					key: x.id,
					slot: [
						td({ style: cellStyle, slot: Text(x.name) }),
						td({ style: cellStyle, slot: Text("1") }),
						td({ style: cellStyle, slot: Text("2") }),
						td({
							style: cellStyle,
							slot: [
								button({
									slot: Text("remove"),
									onClick: () => onRemove(x),
								}),
								button({
									slot: Text("highlight"),
									onClick: () => onHighlight(x),
								}),
							],
						}),
					],
				});
			}),
		}),
	});
});

const App = createComponent(() => {
	const handleAdd = () => {
		console.time("add");

		state.list = [...buildData(100, "!!!"), ...state.list];
		forceUpdate();

		console.timeEnd("add");
	};
	const handleUpdateAll = () => {
		console.time("update all");

		state.list = state.list.map((x) => ({ ...x, name: x.name + "!!!" }));
		forceUpdate();

		console.timeEnd("update all");
	};
	const handleRemove = (x) => {
		const idx = state.list.findIndex((z) => z.id === x.id);
		state.list.splice(idx, 1);

		forceUpdate();
	};
	const handleHighlight = (x) => {
		console.time("highlight");

		const idx = state.list.findIndex((z) => z.id === x.id);
		state.list[idx].select = !state.list[idx].select;
		forceUpdate();

		console.timeEnd("highlight");
	};
	const handleSwap = () => {
		console.time("swap");

		const temp = state.list[1];
		state.list[1] = state.list[state.list.length - 2];
		state.list[state.list.length - 2] = temp;

		forceUpdate();

		console.timeEnd("swap");
	};
	const handleClear = () => {
		console.time("clear");

		state.list = [];
		forceUpdate();

		console.timeEnd("clear");
	};

	return div({
		slot: [
			Header({
				onAdd: handleAdd,
				onUpdateAll: handleUpdateAll,
				onSwap: handleSwap,
				onClear: handleClear,
			}),
			List({
				items: state.list,
				onRemove: handleRemove,
				onHighlight: handleHighlight,
			}),
		],
	});
});

function runBench() {
	console.time("create");

	renderComponent(App(), domElement);

	console.timeEnd("create");
}

function forceUpdate() {
	renderComponent(App(), domElement);
}

export default runBench;
