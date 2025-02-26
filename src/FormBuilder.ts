import {html} from 'lit';
import {bindInput} from 'relit';

export class FormBuilder<T> {
	constructor(protected host: T) {}

	SWITCH(headline: string, key: keyof T) {
		return SWITCH(headline, this.host, key);
	}

	SLIDER(label: string, key: keyof T, options = {min: 1, max: 5}) {
		return SLIDER(label, this.host, key, options);
	}

	SELECT(label: string, key: keyof T, choices: string[] = []) {
		return SELECT(label, this.host, key, choices);
	}

	TEXTFIELD(label: string, type: string, key: keyof T) {
		return TEXTFIELD(label, type, this.host, key);
	}

	TEXTAREA(label: string, key: keyof T) {
		return TEXTAREA(label, this.host, key);
	}
}

export const SWITCH = <T>(headline: string, host: T, key: keyof T) => html`
	<md-list-item
		type="button"
		@click=${() => {
			// @ts-ignore
			host[key] = !host[key];
		}}
		class="select-none cursor-pointer flex items-center gap-3"
		style="/*--md-list-item-top-space:0;--md-list-item-bottom-space:0;--md-list-item-leading-space:0;--md-list-item-trailing-space:0;*/"
	>
		<md-switch slot="start" ?selected=${host[key]} inert></md-switch>
		<div slot="headline">${headline}</div>
	</md-list-item>
`;

export const SLIDER = <T>(
	label: string,
	host: T,
	key: keyof T,
	options = {min: 1, max: 5},
) => html`
	<div class="flex items-center gap-3">
		<span>${label}</span>
		<md-slider
			class="flex-1"
			ticks
			labeled
			min=${options.min}
			max=${options.max}
			${bindInput(host, key)}
		>
		</md-slider>
	</div>
`;

export const SELECT = <T>(
	label: string,
	host: T,
	key: keyof T,
	choices: string[] = [],
) => html`
	<md-filled-select quick value=${host[key]} label=${label}>
		<md-select-option></md-select-option>
		${choices.map(
			(item, id) => html`
				<md-select-option value=${id}>${item}</md-select-option>
			`,
		)}
		<md-option></md-option>
	</md-filled-select>
`;

export const TEXTFIELD = <T>(
	label: string,
	type: string,
	host: T,
	key: keyof T,
) => html`
	<md-filled-text-field
		label=${label.replace(/\*/g, '')}
		type=${type}
		${bindInput(host, key)}
		?required=${label.includes('*')}
	>
	</md-filled-text-field>
`;

export const TEXTAREA = <T>(label: string, host: T, key: keyof T) => html`
	<md-filled-text-field
		type="textarea"
		label=${label}
		${bindInput(host, key)}
	></md-filled-text-field>
`;
