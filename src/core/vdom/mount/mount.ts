import { deepClone, flatten, isArray, isNull } from "@helpers";
import {
	getIsStatelessComponentFactory,
	StatelessComponentFactory,
} from "../../component";
import {
	createVirtualEmptyNode,
	createVirtualNode,
	isVirtualNode,
	VirtualDOM,
	VirtualNode,
} from "../vnode";
import { isFragment } from "@core/fragment";

function wrapWithRoot(
	sourceVNode:
		| VirtualNode
		| Array<VirtualNode>
		| StatelessComponentFactory
		| null
		| undefined,
	currentRoute: Array<number>
): VirtualNode {
	let vNode = null;

	if (isNull(sourceVNode)) {
		sourceVNode = createVirtualEmptyNode();
	}

	const mountedVDOM = mountVirtualDOM(sourceVNode, [...currentRoute, 0]);

	vNode = createVirtualNode("TAG", {
		name: "root",
		route: [...currentRoute],
		children: isArray(mountedVDOM) ? mountedVDOM : [mountedVDOM],
	});

	return vNode;
}

function flatVirtualDOM(
	element: VirtualDOM,
	currentRoute: Array<number>
): VirtualDOM {
	let vNode = element;

	if (isArray(vNode)) {
		let shift = 0;
		const last = currentRoute.slice(-1)[0];
		const list = vNode.map((n, idx) => {
			const route = [...currentRoute.slice(0, -1), last + shift + idx];
			const mounted = mountVirtualDOM(n, route);

			if (isArray(mounted)) {
				shift += flatten(mounted).length - 1;
			}

			return mounted;
		});

		vNode = flatten(list);
	} else if (getIsStatelessComponentFactory(vNode)) {
		vNode = mountVirtualDOM(vNode, currentRoute);
	} else if (Boolean(vNode)) {
		if (isVirtualNode(vNode)) {
			vNode.route = [...currentRoute];
		}

		let shift = 0;
		const list = vNode.children.map((n, idx) => {
			const route = [...currentRoute, shift + idx];
			const mounted = mountVirtualDOM(n, route);

			if (isArray(mounted)) {
				shift += flatten(mounted).length - 1;
			}

			return mounted;
		});

		vNode.children = flatten(list);
	}

	return vNode;
}

function mountVirtualDOM(
	element: VirtualDOM | StatelessComponentFactory | null | undefined,
	currentRoute: Array<number>,
	fromRoot: boolean = false
): VirtualDOM {
	const isStatelessComponentFactory = getIsStatelessComponentFactory(element);
	const statelessFactory = element as StatelessComponentFactory;
	let vNode = null;

	if (fromRoot) {
		vNode = wrapWithRoot(element, currentRoute);
	} else if (isStatelessComponentFactory) {
		vNode = statelessFactory.createElement();
		vNode = flatVirtualDOM(vNode, currentRoute);
	} else if (Boolean(element)) {
		vNode = element;
		vNode = flatVirtualDOM(vNode, currentRoute);
	}

	if (!vNode) {
		vNode = createVirtualEmptyNode();
	}

	return vNode;
}

export { mountVirtualDOM };
