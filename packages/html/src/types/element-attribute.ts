export enum ElementAttrType {
	Attr,
	Event
};

export type ElementAttr = {
	type: ElementAttrType,
	name: string,
	value: (string | (() => void))
};
