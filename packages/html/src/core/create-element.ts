import { ElementAttr, ElementAttrType } from '../types/element-attribute';

/*
 * Create a new element with a given tag name.
 */
export const createElement = (tagName: string): Function => {
	// If the given tag name is fragment, then create a new document fragment.
	// If the given tag name is something else, then create a new node with it.
	const parentElement = (tagName === 'fragment')
		? document.createDocumentFragment()
		: document.createElement(tagName);

	/*
	 * Adding attributes or event listeners to the created element.
	 */
	const addElementAttributesAndEvents = (...attrs: ElementAttr[]): Function => {
		// Check if there is any given attribute or event.
		if (attrs.length) {
			// If there is any, implement them.
			for (const attr of attrs) {
				switch (attr.type) {
					// If the attribute is really an attribute add it to the
					// element, we created.
					case ElementAttrType.Attr:
						// Check if the parent element is really a HTML element.
						// It is needed, because the `setAttribute` function
						// does not exists on Document Fragments.
						//
						// Also check if the attribute's value is whether a
						// `string` or not. We need to do this, because the it
						// could be a `function` as well.
						if (
							parentElement instanceof HTMLElement
							&& typeof attr.value === 'string'
						) {
							parentElement.setAttribute(attr.name, attr.value);
						}

						break;
					// If the attribute is an event, create the event listener
					// for the the element, we created.
					case ElementAttrType.Event:
						// Check if the attribute's value is whether `function`
						// or not. We need to do this, because it could be a
						// `string` as well.
						if (typeof attr.value === 'function') {
							parentElement.addEventListener(attr.name, attr.value);
						}
						break;
				}
			}
		}

		/*
		 * Add child elements to the crated element if there is any.
		 */
		const addChildElements = (...children: Node[]): Node => {
			// Append the child element to the parent.
			for (const child of children) {
				parentElement.appendChild(child);
			}

			return parentElement;
		};

		return addChildElements;
	};

	return addElementAttributesAndEvents;
};
