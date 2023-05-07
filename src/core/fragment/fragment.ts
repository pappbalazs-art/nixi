import { createComponent } from "@core/component";

const Fragment = createComponent(({ slot }) => slot || null);

export { Fragment };
