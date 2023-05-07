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
			{typeof slot === "function" && slot("render props patterm")}
			value: {value}
		</div>
	);
});

type ButtonProps = {
	fullWidth?: boolean;
	onClick: (e) => void;
};

const Button = createComponent<ButtonProps>(({ slot, fullWidth, onClick }) => {
	return (
		<button
			data-test="test"
			style={`width: ${fullWidth ? "100%" : "auto"}`}
			onClick={onClick}
		>
			{slot}
		</button>
	);
});

type AppProps = {
	isOpen?: boolean;
	value: string;
};

const App = createComponent<AppProps>(({ value }) => {
	const isOpen = value === "open";
	const renderInput = () => {
		return (
			<input
				value={value || ""}
				onInput={(e) =>
					renderComponent(App({ value: e.target.value }), domElement)
				}
			/>
		);
	};

	return (
		<div>
			{isOpen && (
				<Fragment>
					<div>1</div>
					<div>2</div>
					<div>3</div>
				</Fragment>
			)}
			{renderInput()}
			<Container value={value}>{(v) => <div>{v}</div>}</Container>
		</div>
	);
});

renderComponent(App(), domElement);
