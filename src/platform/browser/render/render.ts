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
import { isArray, isNull, isUndefined } from "@helpers";
import { mountDOM, processDOM } from "../dom";

const zoneIdByRootNodeMap = new WeakMap();
let renderInProccess = false;
let isInternalRenderCall = false;
let zoneCount = 0;

function createRootVirtualNode(
	sourceVNode: VirtualNode | Array<VirtualNode> | null
): VirtualNode {
	let vNode = null;

	if (isNull(sourceVNode)) {
		sourceVNode = createVirtualEmptyNode();
	}

	vNode = createVirtualNode("TAG", {
		name: "root",
		children: isArray(sourceVNode) ? [...sourceVNode] : [sourceVNode],
	});

	return vNode;
}

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
		let vNode: VirtualNode | Array<VirtualNode> = null;
		const registery = getRegistery();
		const app = createApp(container);

		container.innerHTML = "";
		registery.set(zoneId, app);

		vNode = mountVirtualDOM(source);
		vNode = createRootVirtualNode(vNode);
		vNode = buildVirtualNodeWithRoutes(vNode);

		app.vdom = vNode;

		Array.from(mountDOM(vNode, app.nativeElement).childNodes).forEach((node) =>
			container.appendChild(node)
		);

		console.log("vNode: ", vNode);

		app.queue.forEach((fn) => fn());
		app.queue = [];
	} else {
		const vNode = getVirtualDOM(zoneId);
		let nextVNode: VirtualNode | Array<VirtualNode> = null;

		nextVNode = mountVirtualDOM(source);
		nextVNode = createRootVirtualNode(nextVNode);
		nextVNode = buildVirtualNodeWithRoutes(nextVNode);

		console.log("nextVNode: ", nextVNode);

		processDOM({ vNode, nextVNode });
	}

	if (!isInternalRenderCall) {
		renderInProccess = false;
	} else {
		isInternalRenderCall = false;

		setAppUID(prevZoneId);
	}
}

export { renderComponent };
