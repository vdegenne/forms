import {type MdChipSet} from '@material/web/chips/chip-set.js';
import {type MdFilterChip} from '@material/web/chips/filter-chip.js';
import {type MdInputChip} from '@material/web/chips/input-chip.js';
import {type Chip} from '@material/web/chips/internal/chip.js';
import {type MdIconButton} from '@material/web/iconbutton/icon-button.js';
import {type IconButton} from '@material/web/iconbutton/internal/icon-button.js';
import type {CloseMenuEvent, MdMenu} from '@material/web/menu/menu.js';
import {type MdFilledSelect} from '@material/web/select/filled-select.js';
import {type Select} from '@material/web/select/internal/select.js';
import {type Slider} from '@material/web/slider/internal/slider.js';
import {type MdSlider} from '@material/web/slider/slider.js';
import {type Switch} from '@material/web/switch/internal/switch.js';
import {type TextField} from '@material/web/textfield/internal/text-field.js';
import {Debouncer} from '@vdegenne/debouncer';
import {html, type TemplateResult} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';
import {createRef, type Ref, ref} from 'lit/directives/ref.js';
import {
	literal,
	html as staticHtml,
	type StaticValue,
} from 'lit/static-html.js';
import {bindInput} from './bindInput.js';

interface SharedOptions<T> {
	autofocus: boolean;
	init: ((element: T) => void) | undefined;
	disabled: boolean;
	styles?: string;
	/** @default false */
	required: boolean;
}

type InputOptions = {
	availableValues: string[];
};

export class FormBuilder<T> {
	constructor(protected host: T) {}

	/**
	 * import '@material/web/textfield/filled-text-field.js';
	 * import '@material/web/textfield/outlined-text-field.js';
	 * import '@material/web/iconbutton/icon-button.js';
	 */
	TEXTFIELD(label: string, key: keyof T, options?: Partial<TextFieldOptions>) {
		return TEXTFIELD(label, this.host, key, options);
	}

	TEXTAREA(label: string, key: keyof T, options?: Partial<TextFieldOptions>) {
		return TEXTAREA(label, this.host, key, options);
	}

	TOGGLEBUTTON(key: keyof T, options?: Partial<ToggleButtonOptions>) {
		return TOGGLEBUTTON(this.host, key, options);
	}

	/**
	 * import '@material/web/list/list-item.js';
	 * import '@material/web/switch/switch.js';
	 * import '@material/web/checkbox/checkbox.js';
	 */
	SWITCH(
		headline: string | TemplateResult,
		key: keyof T,
		options?: Partial<SwitchOptions>,
	) {
		return SWITCH(headline, this.host, key, options);
	}

	/**
	 * import '@material/web/slider/slider.js'
	 */
	SLIDER(
		label: string | TemplateResult,
		key: keyof T,
		options?: Partial<SliderOptions>,
	) {
		return SLIDER(label, this.host, key, options);
	}

	SELECT(label: string, key: keyof T, choices: string[]) {
		return SELECT(label, this.host, key, choices);
	}

	/**
	 * import '@material/web/chips/chip-set.js'
	 * import '@material/web/chips/input-chip.js'
	 * import '@material/web/menu/menu.js'
	 * import '@material/web/menu/menu-item.js'
	 *
	 * <!-- <md-chip-set><md-input-chip><md-menu><md-menu-item> -->
	 */
	CHIPSELECT(
		label: string,
		key: keyof T,
		choices: readonly string[],
		options?: Partial<ChipSelectOptions>,
	) {
		return CHIPSELECT(label, this.host, key, choices, options);
	}

	FILTER(
		label: string,
		key: keyof T,
		choices: string[],
		options?: Partial<FilterOptions>,
	) {
		return FILTER(label, this.host, key, choices, options);
	}
}

interface SwitchOptions extends SharedOptions<Switch> {
	overline: string | undefined;
	supportingText: string | undefined;
	/**
	 * @default false
	 */
	checkbox: boolean;
}

/**
 * import '@material/web/list/list-item.js';
 * import '@material/web/switch/switch.js';
 * import '@material/web/checkbox/checkbox.js';
 */
export function SWITCH<T>(
	headline: string | TemplateResult,
	host: T,
	key: keyof T,
	options?: Partial<SwitchOptions>,
) {
	const _options: SwitchOptions = {
		autofocus: false,
		init: undefined,
		supportingText: undefined,
		overline: undefined,
		checkbox: false,
		disabled: false,
		required: false,
		...options,
	};
	// if (!customElements.get('md-list-item')) {
	// 	import('@material/web/list/list-item.js');
	// }
	// if (!customElements.get('md-switch')) {
	// 	import('@material/web/switch/switch.js');
	// }
	return html`
		<md-list-item
			type="button"
			@click=${() => {
				if (_options.disabled) {
					return;
				}
				(host[key] as boolean) = !host[key];
			}}
			class="select-none cursor-pointer flex items-center gap-3"
			?disabled=${_options.disabled}
		>
			${_options.checkbox
				? html`
						<md-checkbox
							slot="start"
							?checked=${host[key]}
							inert
							?disabled=${_options.disabled}
						></md-checkbox>
					`
				: html`
						<md-switch
							slot="start"
							?selected=${host[key]}
							inert
							?disabled=${_options.disabled}
						></md-switch>
					`}
			${_options.overline
				? html` <div slot="overline">${_options.overline}</div> `
				: null}
			<div slot="headline">${headline}</div>
			${_options.supportingText
				? html` <div slot="supporting-text">${_options.supportingText}</div> `
				: null}
		</md-list-item>
	`;
}

interface SliderOptions extends SharedOptions<Slider> {
	min: number;
	max: number;
	step: number;
	/*
	 * @default false
	 */
	range: boolean;
	/**
	 * @default 'input'
	 */
	eventType: 'input' | 'change';
	/**
	 * For 'input' type event, you can set a debouncer timeout,
	 * to avoid changing the value too much.
	 *
	 * @default 0
	 */
	timeoutMs: number;

	/**
	 * @default false
	 */
	ticks: boolean;

	/**
	 * Should persist the label or not.
	 *
	 * @default false
	 */
	persistLabel: boolean;
}

/**
 * import '@material/web/slider/slider.js'
 */
export function SLIDER<T>(
	label: string | TemplateResult,
	host: T,
	key: keyof T,
	options?: Partial<SliderOptions>,
) {
	const _options: SliderOptions = {
		autofocus: false,
		init: undefined,
		min: 0,
		max: 10,
		step: 1,
		range: false,
		eventType: 'input',
		timeoutMs: 0,
		ticks: false,
		persistLabel: false,
		disabled: false,
		required: false,
		...options,
	};

	const sliderRef = createRef<MdSlider>();
	function assignValues() {
		const slider = sliderRef.value!;
		if (slider.range) {
			(host[key] as [number, number]) = [slider.valueStart, slider.valueEnd];
		} else {
			(host[key] as number) = slider.value;
		}
	}
	const assignValuesDebouncer = new Debouncer(assignValues, _options.timeoutMs);
	function eventCallBack(event: Event) {
		if (event.type === _options.eventType) {
			if (event.type === 'input') {
				assignValuesDebouncer.call();
			} else {
				assignValues();
			}
		}
	}

	// if (!customElements.get('md-slider')) {
	// 	import('@material/web/slider/slider.js');
	// }

	return html`
		<div class="flex items-center gap-3 flex-1">
			${label ? html`<span>${label}</span>` : null}
			<md-slider
				?disabled=${_options.disabled}
				${ref(sliderRef)}
				?persist-label=${_options.persistLabel}
				class="flex-1"
				?ticks=${_options.ticks}
				labeled
				min=${_options.min}
				max=${_options.max}
				?range=${_options.range}
				value-start=${ifDefined(_options.range ? host[key][0] : undefined)}
				value-end=${ifDefined(_options.range ? host[key][1] : undefined)}
				value=${ifDefined(!_options.range ? host[key] : undefined)}
				step=${_options.step}
				@input=${eventCallBack}
				@change=${eventCallBack}
			>
			</md-slider>
		</div>
	`;
}

interface SelectOptions extends SharedOptions<Select> {
	/**
	 * Wether or not to include an empty value as first value.
	 */
	emptyValue: boolean;
}

export const SELECT = <T>(
	label: string,
	host: T,
	key: keyof T,
	choices: string[] = [],
) => {
	const _select = createRef<MdFilledSelect>();
	return html`
		<md-filled-select
			${ref(_select)}
			quick
			value=${choices.indexOf(host[key] as string)}
			label=${label}
			@change=${() => {
				const index = _select.value.selectedIndex;
				(host[key] as string) = choices[index];
			}}
		>
			${choices.map(
				(item, id) => html`
					<md-select-option value=${id}>${item}</md-select-option>
				`,
			)}
			<md-option></md-option>
		</md-filled-select>
	`;
};

interface ChipSelectOptions extends SharedOptions<Chip> {
	/**
	 * @default html`<md-icon>sort</md-icon>`
	 */
	leadingIcon: string | TemplateResult | undefined;
}

// MdInputChip.elementStyles.push(css`
// 	button.trailing.action {
// 		pointer-events: none;
// 	}
// `);

/**
 * import '@material/web/chips/chip-set.js'
 * import '@material/web/chips/input-chip.js'
 * import '@material/web/menu/menu.js'
 * import '@material/web/menu/menu-item.js'
 *
 * <!-- <md-chip-set><md-input-chip><md-menu><md-menu-item> -->
 */
export function CHIPSELECT<T>(
	label: string,
	host: T,
	key: keyof T,
	choices: readonly string[],
	options?: Partial<ChipSelectOptions>,
) {
	const _options: ChipSelectOptions = {
		autofocus: false,
		init: undefined,
		leadingIcon: html`<md-icon>sort</md-icon>`,
		disabled: false,
		required: false,
		...(options ?? {}),
	};

	const menuRef = createRef<MdMenu>();
	const menu = () => menuRef.value;
	const chipRef = createRef<MdInputChip>();

	// if (!customElements.get('md-menu')) {
	// 	import('@material/web/menu/menu.js');
	// }
	//
	// if (!customElements.get('md-menu-item')) {
	// 	import('@material/web/menu/menu-item.js');
	// }
	// import('@material/web/chips/chip-set.js');
	// import('@material/web/chips/input-chip.js');

	const onClick = (event: Event) => {
		event.preventDefault();
		menu().open = !menu().open;
	};

	return html`
		<md-chip-set class="relative">
			<md-input-chip
				id="chip"
				${ref(chipRef)}
				@remove=${onClick}
				@click=${onClick}
				_positioning="popover"
			>
				${_options.leadingIcon
					? typeof _options.leadingIcon === 'string'
						? html`<md-icon slot="icon">${_options.leadingIcon}</md-icon>`
						: html`<div slot="icon" style="--md-icon-size:18px;">
								${_options.leadingIcon}
							</div>`
					: null}
				<span>${host[key]}</span>
				<md-icon slot="remove-trailing-icon" style="--md-icon-size:18px;">
					arrow_drop_down
				</md-icon>
			</md-input-chip>

			<md-menu
				quick
				${ref(menuRef)}
				anchor="chip"
				@close-menu=${(event: CloseMenuEvent) => {
					const {
						reason: {kind: reason},
						initiator,
					} = event.detail;
					if (reason === 'click-selection') {
						(host[key] as string) = initiator.typeaheadText;
					}
				}}
			>
				${choices.map(
					(choice) =>
						html`<md-menu-item>
							<div slot="headline">${choice}</div>
						</md-menu-item>`,
				)}
			</md-menu>
		</md-chip-set>
	`;
}

type OnInputParameters = {textfield: TextField; value: string};
type OnInputReturnType = {errorText?: string; supportingText?: string};

interface TextFieldOptions extends SharedOptions<TextField> {
	// TODO: find a generic type for input type
	type: 'text' | 'number' | 'textarea' | 'date';
	suffixText: string | undefined;
	/** @default 'outlined' */
	style: 'filled' | 'outlined';
	/**
	 * Number of rows when the type is "textarea"
	 * @default 2
	 */
	rows: number;

	/**
	 * @default undefined
	 */
	resetButton:
		| {icon?: string | TemplateResult; callback?: () => void}
		| undefined;

	onInput: ((params: OnInputParameters) => OnInputReturnType) | undefined;

	leadingIcon: string | TemplateResult | undefined;
}

/**
 * import '@material/web/textfield/filled-text-field.js';
 * import '@material/web/textfield/outlined-text-field.js';
 * import '@material/web/iconbutton/icon-button.js';
 */
export function TEXTFIELD<T>(
	label: string,
	host: T,
	key: keyof T,
	options?: Partial<TextFieldOptions>,
) {
	const _options: TextFieldOptions = {
		autofocus: false,
		init: undefined,
		type: 'text',
		suffixText: undefined,
		style: 'outlined',
		rows: 2,
		resetButton: undefined,
		onInput: undefined,
		disabled: false,
		leadingIcon: undefined,
		required: false,
		...(options ?? {}),
	};
	const promisesToWait = [];
	let style: StaticValue;
	switch (_options.style) {
		case 'filled':
			// promisesToWait.push(
			// 	import('@material/web/textfield/filled-text-field.js'),
			// );
			style = literal`filled`;
			break;

		case 'outlined':
			// promisesToWait.push(
			// 	import('@material/web/textfield/outlined-text-field.js'),
			// );
			style = literal`outlined`;
			break;
	}

	const render = () => {
		const textFieldRef = createRef<TextField>();
		const textfield = () => textFieldRef.value;

		registerEvents(textfield, {init: _options.init}).then((textfield) => {
			if (_options.onInput) {
				const {errorText, supportingText} =
					_options.onInput?.({
						textfield,
						value: textfield.value,
					}) ?? {};
				if (errorText) {
					textfield.errorText = errorText;
				}
				if (supportingText) {
					textfield.supportingText = supportingText;
				}
			}
		});

		if (_options.resetButton) {
			// if (!customElements.get('md-icon-button')) {
			// 	import('@material/web/iconbutton/icon-button.js');
			// }
		}

		const resetButtonOrNot = _options.resetButton
			? html`<md-icon-button
					slot="trailing-icon"
					form=""
					@click=${() => {
						if (_options.resetButton.callback) {
							_options.resetButton.callback();
						} else {
							(<string>host[key]) = '';
							textfield().focus();
						}
					}}
				>
					${_options.resetButton
						? typeof _options.resetButton.icon === 'string'
							? html`<md-icon>${_options.resetButton.icon}</md-icon>`
							: _options.resetButton.icon
						: html`<md-icon>clear</md-icon>`}
				</md-icon-button>`
			: null;

		return staticHtml`
		<md-${style}-text-field
			?disabled=${_options.disabled}
			${ref(textFieldRef)}
			class="flex-1"
			?autofocus=${_options.autofocus}
			label=${label.replace(/\*/g, '')}
			type=${_options.type}
			.rows=${_options.rows}
			?required=${_options.required || label.includes('*')}
			suffix-text=${ifDefined(_options.suffixText)}
			${bindInput(host, key)}
			style=${ifDefined(_options.styles)}
		>
		${
			_options.leadingIcon
				? typeof _options.leadingIcon === 'string'
					? html`<md-icon slot="leading-icon">${_options.leadingIcon}</md-icon>`
					: html`<div slot="leading-icon">${_options.leadingIcon}</div>`
				: null
		}
		${resetButtonOrNot}
		</md-${style}-text-field>
	`;
	};

	// return until(
	// 	(async () => {
	// 		await Promise.all(promisesToWait);
	// 		return render();
	// 	})(),
	// 	'',
	// );
	return render();
}

export const TEXTAREA = <T>(
	label: string,
	host: T,
	key: keyof T,
	options?: Partial<TextFieldOptions>,
) => TEXTFIELD(label, host, key, {...options, type: 'textarea'});

export const FilterBehavior = {
	ZeroOrMore: 'zero-or-more',
	OneOrMore: 'one-or-more',
	OnlyOne: 'only-one',
} as const;
export type FilterBehaviorValue =
	(typeof FilterBehavior)[keyof typeof FilterBehavior];

interface FilterOptions extends SharedOptions<Chip> {
	/**
	 * You can also import and use FilterBehavior enum for clean code :)
	 *
	 * @default 'zero-or-more'
	 */
	behavior: FilterBehaviorValue;
	/**
	 * @default string
	 */
	type: 'string' | 'number';
	/**
	 * Not implemented yet.
	 */
	sort: 'none' | 'alphabet';

	/**
	 * @default false
	 */
	elevated: boolean;
}
type StringOrNumber = string | number;

export const FILTER = <T>(
	label: string,
	host: T,
	key: keyof T,
	choices: string[],
	options?: Partial<FilterOptions>,
) => {
	const _options: FilterOptions = {
		autofocus: false,
		init: undefined,
		behavior: FilterBehavior.ZeroOrMore,
		sort: 'none',
		type: 'string',
		elevated: false,
		disabled: false,
		required: false,
		...(options ?? {}),
	};
	const _choices = choices
		.map((choice, index) => ({value: choice, index}))
		.sort((a, b) => {
			switch (_options.sort) {
				case 'alphabet':
					return a.value.localeCompare(b.value);
				default:
					return 0;
			}
		});

	const chipsetref: Ref<MdChipSet> = createRef();

	return html`
		<div class="flex items-center gap-4 m-0">
			${label ? html` <div>${label}</div>` : null}
			<md-chip-set
				class="justify-stretch"
				?autofocus=${_options.autofocus}
				${ref(chipsetref)}
				@click=${async (event: PointerEvent) => {
					const chipset = chipsetref.value!;
					const chips = chipset.chips as MdFilterChip[];
					const chip = event.target as MdFilterChip;
					const chipIndex = chips.indexOf(chip);
					if (chipIndex === -1) {
						// Clicked outside
						return;
					}
					const getSelectedChip = () => chips.filter((c) => c.selected);
					switch (_options.behavior) {
						case 'one-or-more':
							if (getSelectedChip().length === 0) {
								event.preventDefault();
								return;
							}
							break;

						case 'only-one':
							chips.forEach((c, index) => (c.selected = index === chipIndex));
							break;
					}
					const values = getSelectedChip().map((c) =>
						_options.type === 'string'
							? c.dataset.value
							: Number(c.dataset.index),
					);

					(host[key] as StringOrNumber | StringOrNumber[]) =
						_options.behavior === 'only-one' ? values[0] : values;
				}}
			>
				${_choices.map(
					(choice) => html`
						<md-filter-chip
							?elevated=${_options.elevated}
							?selected=${[]
								.concat(host[key] as StringOrNumber[])
								.includes(
									_options.type === 'string' ? choice.value : choice.index,
								)}
							data-value=${choice.value}
							data-index=${choice.index}
							label=${choice.value}
						></md-filter-chip>
					`,
				)}
			</md-chip-set>
		</div>
	`;
};

export const INPUT = <T>(
	label: string,
	host: T,
	key: keyof T,
	options?: Partial<InputOptions>,
) => {
	throw new Error('Not implemented yet.');
	return html`<!-- -->

		<!-- -->`;
};

async function waitElement<T extends HTMLElement = HTMLElement>(
	getElement: () => T,
) {
	return new Promise<T>((resolve) => {
		function check() {
			const tf = getElement();
			if (tf) {
				resolve(tf);
			}
			requestAnimationFrame(check);
		}
		requestAnimationFrame(check);
	});
}

async function registerEvents<T extends HTMLElement = HTMLElement>(
	getElement: () => T,
	events: {init?: (element: T) => void},
) {
	const element = await waitElement(getElement);
	events.init?.(element);
	return element;
}

interface ToggleButtonOptions extends SharedOptions<IconButton> {
	icon: string | TemplateResult;
	selectedIcon: string | TemplateResult;
}
export function TOGGLEBUTTON<T>(
	// label: string,
	host: T,
	key: keyof T,
	options?: Partial<ToggleButtonOptions>,
) {
	const icon = options?.icon ?? 'close';
	const _options: ToggleButtonOptions = {
		icon,
		selectedIcon: icon === 'close' && !options?.selectedIcon ? 'check' : icon,
		// Shared
		disabled: false,
		autofocus: false,
		required: true,
		init: undefined,
		...(options ?? {}),
	};
	return html`
		<md-filled-icon-button
			toggle
			form=""
			?selected=${host[key]}
			@change=${(event: Event) => {
				const target = event.target as MdIconButton;
				(<boolean>host[key]) = target.selected;
			}}
		>
			${typeof _options.icon === 'string'
				? html`<md-icon>${_options.icon}</md-icon>`
				: _options.icon}
			<div slot="selected">
				${typeof _options.selectedIcon === 'string'
					? html`<md-icon>${_options.selectedIcon}</md-icon>`
					: _options.selectedIcon}
			</div>
		</md-filled-icon-button>
	`;
}
