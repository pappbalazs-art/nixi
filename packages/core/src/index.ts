import { NixiComponent } from './core/component';

import {
	createElement,
	ElementAttr,
	ElementAttrType
} from 'nixi-html';

class MessagesNumberComponent extends NixiComponent {
	constructor(props) {
		super(props);
	}

	view(): Node {
		return (
			createElement('span') ()
				( document.createTextNode('Number of messages: ' + this.props.messages.length) )
		);
	}
}

class App extends NixiComponent {
	constructor(props) {
		super(props);
	}

	view(): Node {
		const { messages } = this.props;

		const messageClickAttr: ElementAttr = {
			type: ElementAttrType.Event,
			name: 'click',
			value: () => {
				const messages = [
					'Hello',
					'Hi',
					'Hi there',
					'Welcome'
				];

				this.props.messages = [
					...this.props.messages,
					messages[Math.floor(Math.random() * messages.length)],
				];
			}
		};

		const clearMessages: ElementAttr = {
			type: ElementAttrType.Event,
			name: 'click',
			value: () => {
				this.props.messages = [];
			}
		};

		return (
			createElement('div') ( messageClickAttr )
				( createElement('header') ()
					( document.createTextNode('Navbar') )
				, createElement('button') ( clearMessages )
					( document.createTextNode('Clear Messages') )
				, new MessagesNumberComponent({ messages }).render()
				, messages.map(message => (
					createElement('p') () ( document.createTextNode(message)) )
				) )
		);
	}
}

document.getElementById('nixi-root').replaceWith(new App({ messages: ['Hello world!'] }).render());
