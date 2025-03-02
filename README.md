# @vdegenne/forms

Helper module that eases the process of creating complex forms using Lit & Material 3

![image](https://github.com/user-attachments/assets/071dac64-6bcd-4f87-9a65-0a862e376371)

## Usage

\*\*Prefer using the typescript files directly in your project (don't feel scared to copy/paste the files hehe).

If you really want to use this module, install it:

    npm i -D @vdegenne/forms

Then import:

```js
import {FormBuilder} from '@vdegenne/forms';

class AppStore {
	prop = '';
}
const store = new AppStore();
const F = new FormBuilder(store);
```

The module is using tailwind classes, you'll have to add:

```css
@source "../../../node_modules/@vdegenne/forms/lib/FormBuilder.js";
```

in your global stylesheet (or where you manage tailwindcss.)

You'll also have to import the Material element in the file where you use this builder, e.g.

```ts
import '@material/web/slider/slider.js';
```

if you use `F.SLIDER(...)`

This module doesn't import these by default to avoid conflict with the material version installed in your project (customElements register conflict issue).
