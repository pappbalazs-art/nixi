import { VirtualNode } from "@core/vdom";

type ScopeType = {
	registery: Map<number, AppType>;
	uid: number;
	mountedRoute: Array<number>;
};

type AppType = {
	nativeElement: HTMLElement;
	vdom: VirtualNode;
	eventHandlers: Map<string, Array<Function>>;
	refs: Array<Function>;
	queue: Array<Function>;
};

const scope = createScope();
const getRegistery = () => scope.registery;
const setRegistery = (registery: Map<number, any>) =>
	(scope.registery = registery);
const getAppUID = (): number => scope.uid;
const setAppUID = (uid: number) => (scope.uid = uid);
const getMountedRoute = (): Array<number> => [...scope.mountedRoute];
const setMountedRoute = (route: Array<number>) =>
	(scope.mountedRoute = [...route]);
const getVirtualDOM = (uid: number): VirtualNode => ({
	...getRegistery().get(uid).vdom,
});

function createScope(): ScopeType {
	return {
		registery: new Map(),
		uid: 0,
		mountedRoute: [],
	};
}

function createApp(nativeElement: HTMLElement | null): AppType {
	return {
		nativeElement,
		vdom: null,
		eventHandlers: new Map(),
		refs: [],
		queue: [],
	};
}

export {
	ScopeType,
	AppType,
	getRegistery,
	setRegistery,
	getAppUID,
	setAppUID,
	getMountedRoute,
	setMountedRoute,
	getVirtualDOM,
	createScope,
	createApp,
};
