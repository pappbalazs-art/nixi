import { isEmpty, isFunction } from "@helpers";
import { ATTR_KEY } from "@core/constants";
import { createAttribute, getNodeKey, VirtualNode } from "../vnode";

const ADD_NODE = "ADD_NODE";
const REMOVE_NODE = "REMOVE_NODE";
const REPLACE_NODE = "REPLACE_NODE";
const ADD_ATTRIBUTE = "ADD_ATTRIBUTE";
const REMOVE_ATTRIBUTE = "REMOVE_ATTRIBUTE";
const REPLACE_ATTRIBUTE = "REPLACE_ATTRIBUTE";

export type VirtualDOMActions =
	| "ADD_NODE"
	| "REMOVE_NODE"
	| "REPLACE_NODE"
	| "ADD_ATTRIBUTE"
	| "REMOVE_ATTRIBUTE"
	| "REPLACE_ATTRIBUTE";

export type VirtualDOMDiff = {
	action: VirtualDOMActions;
	route: Array<number>;
	oldValue: VirtualNode | Record<string, number | string | boolean>;
	nextValue: VirtualNode | Record<string, number | string | boolean>;
};

function createDiffAction(
	action: VirtualDOMActions,
	route: Array<number> = [],
	oldValue: any,
	nextValue: any
): VirtualDOMDiff {
	return {
		action,
		route,
		oldValue,
		nextValue,
	};
}

function getVirtualDOMDiff(
	VDOM: VirtualNode,
	nextVDOM: VirtualNode,
	prevDiff: Array<VirtualDOMDiff> = [],
	prevRoute: Array<number> = [],
	level: number = 0,
	idx: number = 0
) {
	let diff = [...prevDiff];
	const route = [...prevRoute];
	const key = getNodeKey(VDOM);
	const nextKey = getNodeKey(nextVDOM);

	route[level] = idx;

	if (!VDOM && !nextVDOM) {
		return diff;
	}

	if (!VDOM) {
		diff.push(createDiffAction(ADD_NODE, route, null, nextVDOM));
		return diff;
	} else if (
		!nextVDOM ||
		(!isEmpty(key) && !isEmpty(nextKey) && key !== nextKey)
	) {
		diff.push(createDiffAction(REMOVE_NODE, route, VDOM, null));
		return diff;
	} else if (
		VDOM.type !== nextVDOM.type ||
		VDOM.name !== nextVDOM.name ||
		VDOM.text !== nextVDOM.text ||
		key !== nextKey
	) {
		diff.push(createDiffAction(REPLACE_NODE, route, VDOM, nextVDOM));
		return diff;
	} else {
		if (VDOM.attrs && nextVDOM.attrs) {
			const mapOldAttr = (attrName: string) => {
				if (attrName === ATTR_KEY) {
					return;
				}

				if (isEmpty(nextVDOM.attrs[attrName])) {
					diff.push(
						createDiffAction(
							REMOVE_ATTRIBUTE,
							route,
							createAttribute(attrName, VDOM.attrs[attrName]),
							null
						)
					);
				} else if (
					nextVDOM.attrs[attrName] !== VDOM.attrs[attrName] &&
					!isFunction(nextVDOM.attrs[attrName])
				) {
					diff.push(
						createDiffAction(
							REPLACE_ATTRIBUTE,
							route,
							createAttribute(attrName, VDOM.attrs[attrName]),
							createAttribute(attrName, nextVDOM.attrs[attrName])
						)
					);
				}
			};

			const mapNewAttr = (attrName: string) => {
				if (attrName === ATTR_KEY) {
					return;
				}

				if (
					isEmpty(VDOM.attrs[attrName]) &&
					!isFunction(nextVDOM.attrs[attrName])
				) {
					diff.push(
						createDiffAction(
							ADD_ATTRIBUTE,
							route,
							null,
							createAttribute(attrName, nextVDOM.attrs[attrName])
						)
					);
				}
			};

			Object.keys(VDOM.attrs).forEach(mapOldAttr);
			Object.keys(nextVDOM.attrs).forEach(mapNewAttr);
		}

		level++;

		const iterateVDOM = (vNode: VirtualNode, nextVNode: VirtualNode) => {
			const iterations = Math.max(
				vNode.children.length,
				nextVNode.children.length
			);

			for (let i = 0; i < iterations; i++) {
				const childVNode = VDOM.children[i];
				const childNextVNode = nextVDOM.children[i];
				const key = getNodeKey(childVNode);
				const nextKey = getNodeKey(childNextVNode);

				if (childVNode && childVNode.processed) {
					continue;
				}

				diff = [
					...getVirtualDOMDiff(
						childVNode,
						childNextVNode,
						diff,
						route,
						level,
						i
					),
				];

				if (!isEmpty(key) && !isEmpty(nextKey) && key !== nextKey) {
					VDOM.children.splice(i, 1);
					iterateVDOM(VDOM, nextVDOM);

					break;
				}
			}
		};

		iterateVDOM(VDOM, nextVDOM);
	}

	return diff;
}

export {
	ADD_NODE,
	REMOVE_NODE,
	REPLACE_NODE,
	ADD_ATTRIBUTE,
	REMOVE_ATTRIBUTE,
	REPLACE_ATTRIBUTE,
	getVirtualDOMDiff,
};
