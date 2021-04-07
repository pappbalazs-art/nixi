import { expect } from 'chai';

import { createElement } from './create-element';
import { ElementAttrType } from '../types/element-attribute';

describe('`createElement` function', () => {
	describe('return types', () => {
		it('should return a function if we do not call any nested functions', () => {
			const element = createElement('div');
			expect(typeof element === 'function').to.be.true;
		});

		it('should return a function if we call the `addElementAttributesAndEvents` function as well', () => {
			const element = createElement('div')();
			expect(typeof element === 'function').to.be.true;
		});

		it('should return a Node if we call the `addChildElements` function as well', () => {
			const element = createElement('div')()();
			expect(element instanceof Node).to.be.true;
		});

		it('should return a Document Fragment if the given tag name is `fragment`', () => {
			const element = createElement('fragment')()();
			expect(element instanceof DocumentFragment).to.be.true;
		});

		it('should return a HTML Element if the given tag name IS NOT `fragment`', () => {
			const element = createElement('div')()();
			expect(element instanceof HTMLElement).to.be.true;
		});

		it('should return a HTML Div Element if the given tag name is `div`', () => {
			const element = createElement('div')()();
			expect(element instanceof HTMLDivElement).to.be.true;
		});

		it('should return a HTML Heading Element if the given tag name is `h1`', () => {
			const element = createElement('h1')()();
			expect(element instanceof HTMLHeadingElement).to.be.true;
		});

		it('should return a HTML Span Element if the given tag name is `span`', () => {
			const element = createElement('span')()();
			expect(element instanceof HTMLSpanElement).to.be.true;
		});

		it('should return a HTML Element if the given tag name IS NOT a standard HTML tag name', () => {
			const element = createElement('nixi-router')()();
			expect(element instanceof HTMLElement).to.be.true;
		});
	});

	describe('attributes', () => {
		it('should have no attributes if we do not gave any', () => {
			const element = createElement('div')()();
			expect(element.attributes.length).to.be.equal(0);
		});

		it('should have a class named `container` if we gave it', () => {
			const classAttribute = {
				type: ElementAttrType.Attr,
				name: 'class',
				value: 'container'
			};
			const element = createElement('div')(classAttribute)();
		
			expect(element.className).to.be.equal('container');
		});

		it('should have an ID `first` if we gave it', () => {
			const idAttribute = {
				type: ElementAttrType.Attr,
				name: 'id',
				value: 'first'
			};
			const element = createElement('div')(idAttribute)();

			expect(element.id).to.be.equal('first');
		});

		it('should be able to have multiple attributes', () => {
			const classAttribute = {
				type: ElementAttrType.Attr,
				name: 'class',
				value: 'centered'
			};
			const idAttribute = {
				type: ElementAttrType.Attr,
				name: 'id',
				value: 'landing'
			};
			const element = createElement('div')(classAttribute, idAttribute)();

			expect(element.className).to.be.equal('centered');
			expect(element.id).to.be.equal('landing');
		});

		it('should have an `click` event if we gave it', () => {
			let isClicked = false;

			const clickEventCallback = () => isClicked = true;
			const clickEvent = {
				type: ElementAttrType.Event,
				name: 'click',
				value: clickEventCallback
			};
			const element = createElement('div')(clickEvent)();

			element.click();

			expect(isClicked).to.be.true;
		});
	});

	describe('children', () => {
		it('should have no child element if we do not gave any', () => {
			const element = createElement('div')()();
			expect(element.childElementCount).to.be.equal(0);
		});

		it('should have child element if we gave any', () => {
			const element =
				createElement('div')()
					(createElement('div')()());

			expect(element.childElementCount).to.be.equal(1);
		});

		it('should be able to have multiple child elements', () => {
			const element =
				createElement('div') ()
					( createElement('div')()()
					, createElement('div')()()
					);

			expect(element.childElementCount).to.be.equal(2);
		});

		it('should have a HTML Div Element as a child, if we gave it', () => {
			const childElement = createElement('div')()();
			const element = createElement('div')()(childElement);

			expect(element.childNodes[0] instanceof HTMLDivElement).to.be.true;
		});
	});
});
