import { StatelessComponentFactory } from "@core/component";
import {
	createApp,
	getAppUID,
	setAppUID,
	getRegistery,
	getVirtualDOM,
} from "@core/scope";
import { mountVirtualDOM, VirtualNode } from "@core/vdom";
import { isUndefined } from "@helpers";
import { mountRealDOM, processDOM } from "../dom";

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

	setAppUID(zoneId);

	if (!isMounted) {
		let vNode: VirtualNode = null;
		const registery = getRegistery();
		const app = createApp(container);

		container.innerHTML = "";
		registery.set(zoneId, app);

		vNode = mountVirtualDOM({
			element: source,
			fromRoot: true,
		}) as VirtualNode;

		app.vdom = vNode;

		const nodes = Array.from(
			mountRealDOM(vNode, app.nativeElement).childNodes
		);

		for (const node of nodes) {
			container.appendChild(node);
		}
	} else {
		const vNode = getVirtualDOM(zoneId);
		let nextVNode: VirtualNode = null;

		nextVNode = mountVirtualDOM({
			element: source,
			fromRoot: true,
		}) as VirtualNode;

		console.log("nextVNode: ", nextVNode);

		processDOM({ vNode, nextVNode });
	}

	if (!isInternalRenderCall) {
		renderInProccess = false;
	} else {
		isInternalRenderCall = false;

		setAppUID(prevZoneId);
	}

	typeof onRender === "function" && onRender();
}

export { renderComponent };
