import Spinner from '../../src/component/spinner';

jasmine.getFixtures().fixturesPath = '/base/test/';
describe('spinner > typeof el === string >', () => {
    let spinner;
    const thisEvent = new Event('click'),
        thisInputEvent = new Event('keyup');

    beforeEach(() => {
        jasmine.getFixtures().load('component/spinner-test.html');
        jasmine.clock().install();

        spinner = new Spinner('#wrapper', {
            initValue: 30,
            minNumber: 0,
            maxLength: 2,
            input: "[data-spinner='input']",
            btnMinus: "[data-spinner-action='minus']",
            btnPlus: "[data-spinner-action='plus']",
            btnSetValue: "[data-spinner-action='setValue']",
            onChangedValue() {
                //do not anything
            }
        });

        spyOn(spinner, 'initialize').and.callThrough();
        spyOn(spinner, 'addHandler').and.callThrough();
        spyOn(spinner, 'eventInput').and.callThrough();
        spyOn(spinner, 'eventMinus').and.callThrough();
        spyOn(spinner, 'eventPlus').and.callThrough();
        spyOn(spinner, 'value').and.callThrough();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
        spinner = null;
    });

    afterAll(() => {
        document.querySelector('body').style='';
        document.querySelector('style').innerHTML='';
    });

    describe('initialize >', () => {
        it('spinner.initialize를 호출시 spinner 가 bind 되고 input element의 타입에 따라 초기값이 지정이 되며 addHandler가 실행된다.', () => {
            spinner.initialize();

            expect(spinner.addHandler).toHaveBeenCalled();
        });
    });

    describe('input >', () => {
        it('input에 keyup 이벤트 발생시 eventInput 이 실행된다.', () => {
            // Given
            // When
            spinner.input.dispatchEvent(thisInputEvent);

            // Then
            expect(spinner.eventInput).toHaveBeenCalled();
        });

        it('input에 keyup 이벤트 발생시 value의 자릿수가 opts.maxLength 보다 길 경우 opts.maxLength 로 강제로 맞춰준다.', () => {
            // Given
            spinner.input.value = 300;

            // When
            spinner.input.dispatchEvent(thisInputEvent);

            // Then
            expect(spinner.input.value.toString().length).toEqual(spinner.opts.maxLength);
        });

        it('minus 버튼 클릭시 spinner.opts.minNumber 보다 작을경우 spinner.value 값은 더이상 -1 을 실행하지 않는다.', () => {
            // Given
            spinner.opts.minNumber = 0;
            spinner.value = 0;

            // When
            spinner.btnMinus.dispatchEvent(thisEvent);

            // Then
            expect(spinner.value).toEqual(spinner.opts.minNumber);
        });
    });

    describe('minus >', () => {
        it('minus 버튼 클릭시 spinner.eventMinus가 호출되고, 값은 -1 이 된다.', () => {
            // Given
            spinner.value = 5;

            // When
            spinner.btnMinus.dispatchEvent(thisEvent);

            // Then
            expect(spinner.eventMinus).toHaveBeenCalled();
            expect(spinner.value).toEqual( spinner.beforeValue - 1 );
        });

        it('minus 버튼 클릭시 spinner.opts.minNumber 보다 작을경우 spinner.value 값은 더이상 -1 을 실행하지 않는다.', () => {
            // Given
            spinner.opts.minNumber = 0;
            spinner.value = 0;

            // When
            spinner.btnMinus.dispatchEvent(thisEvent);

            // Then
            expect(spinner.value).toEqual(spinner.opts.minNumber);
        });
    });

    describe('plus >', () => {
        it('plus 버튼 클릭시 spinner.eventPlus가 호출되고, 값은 +1 이 된다.', () => {
            // Given
            spinner.value = 1;

            // When
            spinner.btnPlus.dispatchEvent(thisEvent);

            // Then
            expect(spinner.eventPlus).toHaveBeenCalled();
            expect(spinner.value).toEqual(spinner.beforeValue + 1);
        });

        it('plus 버튼 클릭시 spinner.opts.maxLength 보다 자릿수가 높을경우 spinner.value 값은 더이상 +1 을 실행하지 않는다.', () => {
            // Given
            spinner.value = 9;
            spinner.opts.maxLength = 1;

            // When
            spinner.btnPlus.dispatchEvent(thisEvent);

            // Then
            expect(spinner.value.toString().length).toEqual( spinner.opts.maxLength );
        });
    });

    describe('setter / getter >', () => {
        it('setValue 버튼 클릭시 spinner.input의 value 값이 spinner.value 값으로 설정된다.', () => {
            // Given
            spinner.input.value = 76;

            // When
            spinner.btnSetValue.dispatchEvent(thisEvent);

            // Then
            expect(spinner.value).toEqual(Number(spinner.input.value));
        });

        it('spinner.value = 30 을 적용하면 spinner.value는 30이 되고, spinner.value 는 현재값이 return 된다.', () => {
            // Given
            const _setValue = 30;

            // When
            spinner.value = _setValue;

            // Then
            expect(spinner.value).toEqual(_setValue);
        });
    });
});

describe('spinner > typeof el === dom >', () => {
    let spinner;

    beforeEach(() => {
        jasmine.getFixtures().load('component/spinner-test.html');
        jasmine.clock().install();

        spinner = new Spinner(document.getElementById('wrapper'), {
            onChangedValue: (val) => {
                console.log(val);
            }
        });

        spyOn(spinner, 'initialize').and.callThrough();
        spyOn(spinner, 'addHandler').and.callThrough();
        spyOn(spinner, 'value').and.callThrough();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
        spinner = null;
    });

    it('new Spinner 실행 시 el 값을 string 이 아닌 dom 으로 지정해도 initialize가 정상 실행되고 addHandler가 실행된다.', () => {
        spinner.initialize();

        expect(spinner.addHandler).toHaveBeenCalled();
    });
});

describe('spinner > el undefined >', () => {
    let spinner;

    beforeEach(() => {
        jasmine.getFixtures().load('component/spinner-test.html');
        jasmine.clock().install();

        spinner = new Spinner();

        spyOn(spinner, 'initialize').and.callThrough();
        spyOn(spinner, 'addHandler').and.callThrough();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
        spinner = null;
    });

    it('new Spinner 실행 시 el 지정하지 않을 경우 addHandler 는 실행되지 않고 return 된다.', () => {
        spinner.initialize();

        expect(spinner.addHandler).not.toHaveBeenCalled();
    });
});

describe('spinner > input.nodeName === INPUT ', () => {
    let spinner;
    const thisEvent = new Event('click');

    beforeEach(() => {
        jasmine.getFixtures().load('component/spinner-test.html');
        jasmine.clock().install();

        spinner = new Spinner('#wrapper2');

        spyOn(spinner, 'initialize').and.callThrough();
        spyOn(spinner, 'addHandler').and.callThrough();
        spyOn(spinner, 'eventInput').and.callThrough();
        spyOn(spinner, 'eventMinus').and.callThrough();
        spyOn(spinner, 'eventPlus').and.callThrough();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
        spinner = null;
    });

    afterAll(() => {
        document.querySelector('body').style='';
        document.querySelector('style').innerHTML='';
    });

    describe('initialize >', () => {
        it('spinner.initialize를 호출시 spinner 가 bind 되고 input element의 타입에 따라 초기값이 지정이 되며 addHandler가 실행된다.', () => {
            spinner.initialize();

            expect(spinner.addHandler).toHaveBeenCalled();
        });
    });

    describe('minus >', () => {
        it('minus 버튼 클릭시 spinner.eventMinus가 호출되고, 값은 -1 이 된다.', () => {
            // Given
            spinner.value = 5;

            // When
            spinner.btnMinus.dispatchEvent(thisEvent);

            // Then
            expect(spinner.eventMinus).toHaveBeenCalled();
            expect(spinner.value).toEqual( spinner.beforeValue - 1 );
        });

        it('minus 버튼 클릭시 spinner.opts.minNumber 보다 작을경우 spinner.value 값은 더이상 -1 을 실행하지 않는다.', () => {
            // Given
            spinner.opts.minNumber = 0;
            spinner.value = 0;

            // When
            spinner.btnMinus.dispatchEvent(thisEvent);

            // Then
            expect(spinner.value).toEqual(spinner.opts.minNumber);
        });
    });

    describe('plus >', () => {
        it('plus 버튼 클릭시 spinner.eventPlus가 호출되고, 값은 +1 이 된다.', () => {
            // Given
            spinner.value = 1;

            // When
            spinner.btnPlus.dispatchEvent(thisEvent);

            // Then
            expect(spinner.eventPlus).toHaveBeenCalled();
            expect(spinner.value).toEqual(spinner.beforeValue + 1);
        });

        it('plus 버튼 클릭시 spinner.opts.maxLength 보다 자릿수가 높을경우 spinner.value 값은 더이상 +1 을 실행하지 않는다.', () => {
            // Given
            spinner.value = 9;
            spinner.opts.maxLength = 1;

            // When
            spinner.btnPlus.dispatchEvent(thisEvent);

            // Then
            expect(spinner.value.toString().length).toEqual( spinner.opts.maxLength );
        });
    });

    describe('setter / getter >', () => {
        it('spinner.value = 30 을 적용하면 spinner.value는 30이 되고, spinner.value 는 현재값이 return 된다.', () => {
            // Given
            const _setValue = 30;

            // When
            spinner.value = _setValue;

            // Then
            expect(spinner.value).toEqual(_setValue);
        });

        it('input.nodeTypt === INPUT 일 경우 value setter 는 유효하지 않는다', () => {
            // Given

            // When
            spinner.btnSetValue = null;
        });
    });
});

describe('spinner > input type !== number >', () => {
    let spinner;

    beforeEach(() => {
        jasmine.getFixtures().load('component/spinner-test.html');
        jasmine.clock().install();

        spinner = new Spinner('#wrapper3');

        spyOn(spinner, 'initialize').and.callThrough();
        spyOn(spinner, 'addHandler').and.callThrough();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
        spinner = null;
    });

    it('input의 type 이 number 가 아닐 경우 number 로 변경해준다.', () => {
        spinner.initialize();

        expect(spinner.addHandler).toHaveBeenCalled();
    });
});
