/**
 * # **Spinner Class**
 * *숫자를 지정된 값으로 입력 및 증가/감소 할 수 있다.*
 * ```javascript
 *     new Spinner(element, options);
 * ```
 */
class Spinner {
    constructor(el, options = {}) {
        this.wrapper = (typeof el === 'string') ? document.querySelector(el) : el;

        this.opts = Object.assign({}, this.constructor.defaults(), options);

        this.initialize();
    }

    /**
     * ### **default options**
     */
    static defaults() {
        return {
            initValue: 0,
            minNumber: 0,
            maxLength: 2,
            input: "[data-spinner='input']",
            btnMinus: "[data-spinner-action='minus']",
            btnPlus: "[data-spinner-action='plus']",
            btnSetValue: "[data-spinner-action='setValue']",
            onChangedValue: false,
        };
    }

    /**
     * ### **initialize()**
     * *Spinner 초기화 실행.*
     * * input 의 초기값을 입력한다.
     * * addHandler 실행한다.
     */
    initialize() {
        if (!this.wrapper) {
            return;
        }

        this.input = this.wrapper.querySelector(this.opts.input);
        this.btnMinus = this.wrapper.querySelector(this.opts.btnMinus);
        this.btnPlus = this.wrapper.querySelector(this.opts.btnPlus);
        this.btnSetValue = this.wrapper.querySelector(this.opts.btnSetValue);
        this.isInput = this.input.nodeName === 'INPUT';

        if (this.isInput) {
            if (this.input.getAttribute('type') !== 'number') {
                this.input.setAttribute('type', 'number');
            }
            this.input.value = this.opts.initValue;
        } else {
            this.input.innerHTML = this.opts.initValue;
        }

        this.addHandler();
    }


    /**
     * ### **addHandler()**
     * *Handler를 등록한다.*
     * * input에 대한 keyup 이벤트를 등록한다.
     * * btnMinus에 대한 click 이벤트를 등록한다.
     * * btnPlus에 대한 click 이벤트를 등록한다.
     * * btnSetValue에 대한 click 이벤트를 등록한다.
     */
    addHandler() {
        this.input.addEventListener('keyup', () => {
            this.eventInput();
        }, false);
        this.btnMinus.addEventListener('click', () => {
            this.eventMinus();
        }, false);
        this.btnPlus.addEventListener('click', () => {
            this.eventPlus();
        }, false);

        if (this.btnSetValue) {
            this.btnSetValue.addEventListener('click', () => {
                this.value = this.input.value;
            }, false);
        }
    }

    /**
     * ### **eventInput()**
     * *input에 값을 직접 입력한다.*
     * * get currentValue using get this.value
     * * If currentValue.length is greater than maxLength, then maxLength can not be entered.
     */
    eventInput() {
        if (this.input.value.toString().length > this.opts.maxLength) {
            this.input.value = this.input.value.substring(0, this.opts.maxLength);
        }
    }

    /**
     * ### **eventMinus()**
     * *현재값에서 1을 뺀다.*
     * * Run set value if currentValue is greater than minNumber
     */
    eventMinus() {
        this.beforeValue = this.value;
        if ((this.value - 1) >= this.opts.minNumber) {
            this.value = this.value - 1;
        }
    }

    /**
     * ### **eventPlus()**
     * *현재값에서 1을 더한다.*
     */
    eventPlus() {
        this.beforeValue = this.value;
        if (!this.opts.maxLength || (this.value + 1).toString().length <= this.opts.maxLength) {
            this.value = this.value + 1;
        }
    }

    /**
     * ### **get value()**
     * *현재값을 반환한다.*
     */
    get value() {
        if (this.isInput) {
            return Number(this.input.value);
        }

        return Number(this.input.innerHTML);
    }

    /**
     * ### **set value()**
     * *현재값을 설정한다.*
     * * If have onChangedValue and onChangedValue is a function, execute it.
     * * onChangedValue returns currentValue
     */
    set value(val) {
        const onChangedValue = this.opts.onChangedValue;

        if (this.isInput) {
            this.input.value = val;
        } else {
            this.input.innerHTML = val;
        }

        if (onChangedValue && typeof onChangedValue === 'function') {
            onChangedValue(val * 1);
        }
    }
}

export default Spinner;
