import { VirtualNode } from "@core/vdom";

type ScopeType = {
	registery: Map<number, AppType>;
	uid: number;
};

type AppType = {
	nativeElement: HTMLElement;
	vdom: VirtualNode;
	eventStore: Map<string, WeakMap<any, Function>>;
};

const scope = createScope();
const getRegistery = () => scope.registery;
const setRegistery = (registery: Map<number, any>) =>
	(scope.registery = registery);
const getAppUID = (): number => scope.uid;
const setAppUID = (uid: number) => (scope.uid = uid);
const getVirtualDOM = (uid: number): VirtualNode => ({
	...getRegistery().get(uid).vdom,
});

function createScope(): ScopeType {
	return {
		registery: new Map(),
		uid: 0,
	};
}

function createApp(nativeElement: HTMLElement | null): AppType {
	return {
		nativeElement,
		vdom: null,
		eventStore: new Map(),
	};
}

export {
	ScopeType,
	AppType,
	getRegistery,
	setRegistery,
	getAppUID,
	setAppUID,
	getVirtualDOM,
	createScope,
	createApp,
};
