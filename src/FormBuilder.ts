import {type MdCheckbox} from '@material/web/checkbox/checkbox.js';
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
import {type MdSwitch} from '@material/web/switch/switch.js';
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
import {styleMap, type StyleInfo} from 'lit/directives/style-map.js';

interface SharedOptions<T extends HTMLElement = HTMLElement> {
	/** @default false */
	autofocus: boolean;
	/** @default undefined */
	init: ((element: T) => void) | undefined;
	/** @default false */
	disabled: boolean;
	/**
	 * @default undefined
	 * @deprecated Use "style" instead.
	 */
	styles: string | undefined;
	/** @default undefined */
	style: Readonly<StyleInfo> | undefined;
	/** @default false */
	required: boolean;
}

const DEFAULT_SHARED_OPTIONS: SharedOptions = {
	autofocus: false,
	disabled: false,
	init: undefined,
	required: false,
	style: undefined,
	styles: undefined,
};

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

	/**
	 * import '@material/web/textfield/filled-text-field.js';
	 * import '@material/web/textfield/outlined-text-field.js';
	 * import '@material/web/iconbutton/icon-button.js';
	 */
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
	 * import '@material/web/checkbox/checkbox.js';
	 */
	CHECKBOX(
		headline: string | TemplateResult,
		key: keyof T,
		options?: Partial<CheckboxOptions>,
	) {
		return CHECKBOX(headline, this.host, key, options);
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

	/**
	 * import '@material/web/select/filled-select.js'
	 * import '@material/web/select/select-option.js'
	 */
	SELECT(
		label: string,
		key: keyof T,
		choices: readonly string[],
		options?: Partial<SelectOptions>,
	) {
		return SELECT(label, this.host, key, choices, options);
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

interface SwitchOptions extends SharedOptions<MdSwitch> {
	/** @default 'text' */
	type: 'text' | 'button';
	/** @default false*/
	checkbox: boolean;
	overline: string | undefined;
	supportingText: string | undefined;
	/** @default 'leading' */
	position: 'leading' | 'trailing';
	/**
	 * When position is set to "trailing"
	 * you can provite a leading content (e.g. an icon)
	 */
	leadingContent: string | TemplateResult | undefined;
	trailingSupportingText: string | TemplateResult | undefined;
}

/**
 * import '@material/web/list/list-item.js';
 * import '@material/web/switch/switch.js';
 */
export function SWITCH<T>(
	headline: string | TemplateResult,
	host: T,
	key: keyof T,
	options?: Partial<SwitchOptions>,
) {
	const _options: SwitchOptions = {
		...DEFAULT_SHARED_OPTIONS,
		type: 'text',
		checkbox: false,
		overline: undefined,
		supportingText: undefined,
		position: 'leading',
		leadingContent: undefined,
		trailingSupportingText: undefined,
		...options,
	};
	_options.style = {
		'user-select': 'none',
		cursor:
			_options.disabled || _options.type === 'text' ? 'initial' : 'pointer',
		..._options.style,
	};
	if (!customElements.get('md-list-item')) {
		import('@material/web/list/list-item.js');
	}
	if (!customElements.get('md-switch')) {
		import('@material/web/switch/switch.js');
	}
	return html`
		<md-list-item
			type="${_options.type}"
			@click=${() => {
				if (_options.disabled) {
					return;
				}
				if (_options.type === 'button') {
					(host[key] as boolean) = !host[key];
				}
			}}
			@change=${(event: Event) => {
				if (_options.type === 'text') {
					const target = event.target as HTMLElement;
					if (_options.checkbox && target.nodeName === 'MD-CHECKBOX') {
						const checkbox = target as MdCheckbox;
						checkbox.updateComplete.then(
							() => ((host[key] as boolean) = checkbox.checked),
						);
					} else if (!_options.checkbox && target.nodeName === 'MD-SWITCH') {
						const switch_ = target as MdSwitch;
						switch_.updateComplete.then(
							() => ((host[key] as boolean) = switch_.selected),
						);
					}
				}
			}}
			?disabled=${_options.disabled}
			style=${ifDefined(_options.style ? styleMap(_options.style) : undefined)}
		>
			${_options.position === 'trailing' && _options.leadingContent
				? html`<div slot="start">${_options.leadingContent}</div>`
				: null}
			${_options.checkbox
				? html`
						<md-checkbox
							slot="${_options.position === 'leading' ? 'start' : 'end'}"
							?checked=${host[key]}
							?inert=${_options.type === 'button'}
							?disabled=${_options.disabled}
						></md-checkbox>
					`
				: html`
						<md-switch
							slot="${_options.position === 'leading' ? 'start' : 'end'}"
							?selected=${host[key]}
							?inert=${_options.type === 'button'}
							?disabled=${_options.disabled}
						></md-switch>
					`}
			${_options.overline
				? html`<div slot="overline">${_options.overline}</div>`
				: null}
			<div slot="headline">${headline}</div>
			${_options.supportingText
				? html`<div slot="supporting-text">${_options.supportingText}</div>`
				: null}
			${_options.trailingSupportingText
				? html`<div slot="trailing-supporting-text">
						${_options.trailingSupportingText}
					</div>`
				: null}
		</md-list-item>
	`;
}

interface CheckboxOptions extends SwitchOptions {}

/**
 * import '@material/web/list/list-item.js';
 * import '@material/web/checkbox/checkbox.js';
 */
export function CHECKBOX<T>(
	headline: string | TemplateResult,
	host: T,
	key: keyof T,
	options?: Partial<SwitchOptions>,
) {
	// const _options: SwitchOptions = {
	// 	...DEFAULT_SHARED_OPTIONS,
	// 	checkbox: true,
	// 	...options,
	// };

	return SWITCH(headline, host, key, {...options, checkbox: true});
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
	 * @default true
	 */
	labeled: boolean;

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
		...DEFAULT_SHARED_OPTIONS,
		min: 0,
		max: 10,
		step: 1,
		range: false,
		eventType: 'input',
		timeoutMs: 0,
		ticks: false,
		persistLabel: false,
		labeled: true,
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

	if (!customElements.get('md-slider')) {
		import('@material/web/slider/slider.js');
	}

	return html`
		<div class="flex items-center gap-3 flex-1">
			${label ? html`<span>${label}</span>` : null}
			<md-slider
				?disabled=${_options.disabled}
				${ref(sliderRef)}
				?persist-label=${_options.persistLabel}
				class="flex-1"
				?ticks=${_options.ticks}
				?labeled=${_options.labeled}
				min=${_options.min}
				max=${_options.max}
				?range=${_options.range}
				value-start=${ifDefined(_options.range ? host[key][0] : undefined)}
				value-end=${ifDefined(_options.range ? host[key][1] : undefined)}
				value=${ifDefined(!_options.range ? host[key] : undefined)}
				step=${_options.step}
				@input=${eventCallBack}
				@change=${eventCallBack}
				style=${ifDefined(
					_options.style ? styleMap(_options.style) : undefined,
				)}
			>
			</md-slider>
		</div>
	`;
}

interface SelectOptions extends SharedOptions<Select> {
	// /**
	//  * Wether or not to include an empty value as first value.
	//  */
	// emptyValue: boolean;

	supportingText: string | undefined;
}

/**
 * import '@material/web/select/filled-select.js'
 * import '@material/web/select/select-option.js'
 */
export function SELECT<T>(
	label: string,
	host: T,
	key: keyof T,
	choices: readonly string[] = [],
	options?: Partial<SelectOptions>,
) {
	const _options: SelectOptions = {
		...DEFAULT_SHARED_OPTIONS,
		supportingText: undefined,
		...(options ?? {}),
	};
	const _select = createRef<MdFilledSelect>();
	return html`
		<md-filled-select
			${ref(_select)}
			quick
			value=${choices.indexOf(host[key] as string)}
			label=${label}
			@change="${() => {
				const index = _select.value.selectedIndex;
				(host[key] as string) = choices[index];
			}}"
			supporting-text=${ifDefined(_options.supportingText)}
		>
			${choices.map(
				(item, id) => html`
					<md-select-option value=${id}>${item}</md-select-option>
				`,
			)}
		</md-filled-select>
	`;
}

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
		...DEFAULT_SHARED_OPTIONS,
		leadingIcon: html`<md-icon>sort</md-icon>`,
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
	variant: 'filled' | 'outlined';
	/**
	 * Number of rows when the type is "textarea"
	 * @default 2
	 */
	rows: number;

	/**
	 * @default undefined
	 */
	resetButton:
		| {
				icon?: string | TemplateResult;
				callback?: (textfield: TextField) => void;
		  }
		| boolean
		| undefined;

	onInput: ((params: OnInputParameters) => OnInputReturnType) | undefined;

	leadingIcon: string | TemplateResult | undefined;

	supportingText: string | undefined;

	placeholder: string | undefined;
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
		...DEFAULT_SHARED_OPTIONS,
		type: 'text',
		suffixText: undefined,
		variant: 'outlined',
		rows: 2,
		resetButton: undefined,
		onInput: undefined,
		leadingIcon: undefined,
		supportingText: undefined,
		placeholder: undefined,
		...options,
	};
	const promisesToWait = [];
	let style: StaticValue;
	switch (_options.variant) {
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
			if (!customElements.get('md-icon-button')) {
				import('@material/web/iconbutton/icon-button.js');
			}
		}

		const resetButtonOrNot = _options.resetButton
			? html`<md-icon-button
					slot="trailing-icon"
					form=""
					@click=${() => {
						if (
							typeof _options.resetButton === 'object' &&
							_options.resetButton.callback
						) {
							_options.resetButton.callback(textfield());
						} else {
							(<string>host[key]) = '';
							textfield().focus();
						}
					}}
				>
					${typeof _options.resetButton === 'object' &&
					_options.resetButton.icon
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
			supporting-text=${ifDefined(_options.supportingText)}
			style=${ifDefined(_options.styles)}
			${bindInput(host, key)}
			placeholder=${ifDefined(_options.placeholder)}
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

/**
 * import '@material/web/textfield/filled-text-field.js';
 * import '@material/web/textfield/outlined-text-field.js';
 * import '@material/web/iconbutton/icon-button.js';
 */
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
		...DEFAULT_SHARED_OPTIONS,
		behavior: FilterBehavior.ZeroOrMore,
		type: 'string',
		sort: 'none',
		elevated: false,
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
		...DEFAULT_SHARED_OPTIONS,
		icon,
		selectedIcon: icon === 'close' && !options?.selectedIcon ? 'check' : icon,
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
