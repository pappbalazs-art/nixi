import { StatelessComponentFactory } from "@core/component";
import {
	createApp,
	getAppUID,
	getRegistery,
	getVirtualDOM,
	setAppUID,
	setMountedRoute,
} from "@core/scope";
import {
	buildVirtualNodeWithRoutes,
	createVirtualEmptyNode,
	createVirtualNode,
	mountVirtualDOM,
	VirtualNode,
} from "@core/vdom";
import { isUndefined } from "@helpers";
import { mountDOM, processDOM } from "../dom";

const zoneIdByRootNodeMap = new WeakMap();
let renderInProccess = false;
let isInternalRenderCall = false;
let zoneCount = 0;

function renderComponent(
	source: VirtualNode | StatelessComponentFactory,
	container: HTMLElement | null,
	onRender?: Function
) {
	const isMounted = !isUndefined(zoneIdByRootNodeMap.get(container));
	const prevZoneId = getAppUID();
	let zoneId = 0;

	if (!renderInProccess) {
		renderInProccess = true;
	} else {
		isInternalRenderCall = true;
	}

	if (!isMounted) {
		zoneIdByRootNodeMap.set(container, zoneCount);
		zoneCount++;
	}

	zoneId = zoneIdByRootNodeMap.get(container);

	setMountedRoute([0]);
	setAppUID(zoneId);

	if (!isMounted) {
		let vNode: VirtualNode = null;
		const registery = getRegistery();
		const app = createApp(container);

		container.innerHTML = "";
		registery.set(zoneId, app);

		vNode = mountVirtualDOM(source, true) as VirtualNode;

		app.vdom = vNode;

		Array.from(mountDOM(vNode, app.nativeElement).childNodes).forEach((node) =>
			container.appendChild(node)
		);

		console.log("vNode: ", vNode);

		app.queue.forEach((fn) => fn());
		app.queue = [];

		typeof onRender === "function" && onRender();
	} else {
		const vNode = getVirtualDOM(zoneId);
		let nextVNode: VirtualNode = null;

		nextVNode = mountVirtualDOM(source, true) as VirtualNode;

		console.log("nextVNode: ", nextVNode);

		processDOM({ vNode, nextVNode });

		typeof onRender === "function" && onRender();
	}

	if (!isInternalRenderCall) {
		renderInProccess = false;
	} else {
		isInternalRenderCall = false;

		setAppUID(prevZoneId);
	}
}

export { renderComponent };
