export class NixiComponent {
	private hasRendered: boolean = false;
	private lastRender: Node;

	public props;

	private propsHandler = {
		get: (target, prop) => {
			if (['[object Object]', '[object Array]'].indexOf(Object.prototype.toString.call(target[prop])) > -1) {
				return new Proxy(target[prop], this.propsHandler);
			}

			return target[prop];
		},
		set: (target, prop, value, receiver) => {
			target[prop] = value;

			this.render();

			return true;
		}
	};

	constructor(propsTarget?) {
		if (propsTarget) {
			this.props = new Proxy(propsTarget, this.propsHandler);
		}
	}

	diffNode(oldRender: Node, newRender: Node) {
		const diffAllChildren = () => {
			oldRender.childNodes.forEach((oldRenderChild, index) => {
				const newRenderChild = newRender.childNodes[index];

				this.diffNode(oldRenderChild, newRenderChild);

				return;
			});
		};

		if (oldRender.isEqualNode(newRender)) {
			return;
		}

		if (!oldRender.hasChildNodes() && !newRender.hasChildNodes()) {
			oldRender.parentElement.replaceChild(newRender, oldRender);
			return;
		}

		if (oldRender.hasChildNodes() && !newRender) {
			oldRender.parentElement.removeChild(oldRender);
			return;
		}

		if (oldRender.childNodes.length == newRender.childNodes.length) {
			diffAllChildren();
			return;
		} else if (oldRender.childNodes.length < newRender.childNodes.length) {
			const childrenToAppend = [];

			newRender.childNodes.forEach((newRenderChild, index) => {
				if (oldRender.childNodes.length <= index) {
					childrenToAppend.push(newRenderChild);
				}
			});

			childrenToAppend.forEach(child => oldRender.appendChild(child));	

			diffAllChildren();

			return;
		} else if (oldRender.childNodes.length > newRender.childNodes.length) {
			console.log(newRender);

			oldRender.childNodes.forEach((oldRenderChild, index) => {
				if (newRender.childNodes.length <= index) {
					oldRender.removeChild(oldRenderChild);
				}
			});

			diffAllChildren();

			return;
		}
	}

	view(): Node {
		return;
	}

	render() {
		if (!this.hasRendered) {
			this.hasRendered = true;
			this.lastRender = this.view();
			
			return this.lastRender;
		} else {
			this.diffNode(this.lastRender, this.view());
		}
	}
}
