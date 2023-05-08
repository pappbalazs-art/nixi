import { createComponent, Fragment, h, Text, View } from "../src/core";
import { renderComponent } from "../src/platform/browser";

const domElement = document.getElementById("nixi-app");
//const domElement2 = document.getElementById("nixi-app2");
//const domElement2 = document.getElementById("nixi-app3");

const div = (props = {}) => View({ ...props, as: "div" });
const button = (props = {}) => View({ ...props, as: "button" });
const input = (props = {}) => View({ ...props, as: "input", isVoid: true });

type ContainerProp = {
	value: string;
};

const Container = createComponent<ContainerProp>(({ slot, value }) => {
	return (
		<div style="color: green">
			{typeof slot === "function" && slot("render props pattern")}
			value: {value}
		</div>
	);
});

const Item = createComponent(
	() => {
		return [Text("Item 666")];
	},
	{ displayName: "Item" }
);

const Component = createComponent(
	() => {
		return [
			Item(),
			div({
				slot: Text("Component 1"),
			}),
		];
	},
	{ displayName: "Component" }
);

type AppProps = {
	isOpen?: boolean;
	value: string;
};

const App = createComponent<AppProps>(
	({ isOpen }) => {
		return [
			div({
				slot: [
					Text("text 1"),
					Text("text 2"),
					isOpen && [Component(), Component()],
					Text("xxx"),
					Text("zzz"),
				],
			}),
			Text("xxx"),
		];
	},
	{ displayName: "App" }
);

renderComponent(App({ isOpen: true }), domElement);
