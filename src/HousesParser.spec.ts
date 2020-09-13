import * as assert from 'assert';
import HousesParser from "./HousesParser";

type TestSet = Array<{
    sourceString: string,
    positive: Array<string>,
    negative: Array<string>,
}>

describe('HousesParser', function () {
    const testSet: TestSet = [
        {
            sourceString: 'четные 2-28, нечетные 1-21',
            positive: ['2', '16', '28', '1', '15', '21'],
            negative: ['-2', '0', '30', '-1', '23'],
        },
        {
            sourceString: 'нечетные 11+; четные 42-',
            positive: ['11', '13', '101', '42', '40', '2'],
            negative: ['9', '44', '46'],
        },
        {
            sourceString: 'четные с 20 и вся улица до конца',
            positive: ['20', '22', '24', '60'],
            negative: ['18', '19', '21', '23', '61'],
        },
        {
            sourceString: '7/1, 11, 17, 17/1,17/2, 8/2, 15, 15/1, 15а',
            positive: ['7/1', '17', '17/1', '8/2', '15а'],
            negative: ['7', '7/2', '11/1', '17/3', '15a'],
        },
        {
            sourceString: '12, 22, 36, 42, 45, 100-106',
            positive: ['12', '36', '100', '101', '102', '105', '106'],
            negative: ['11', '13', '43', '99', '107'],
        },
    ];

    for (const test of testSet) {
        describe(`Source string: "${test.sourceString}"`, () => {
            const parser = new HousesParser(test.sourceString);
            for (const houseNumber of test.positive) {
                it(`Included: ${houseNumber}`, () => {
                    assert.strictEqual(parser.isHouseIncluded(houseNumber), true);
                });
            }
            for (const houseNumber of test.negative) {
                it(`Not included: ${houseNumber}`, () => {
                    assert.strictEqual(parser.isHouseIncluded(houseNumber), false);
                });
            }
        });
    }
});
