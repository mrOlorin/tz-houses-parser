export type RangeParserPredicate = (value: number | string, index?: number, array?: Array<string>) => unknown;

const rangeParsers: Map<RegExp, (str: string, predicate?: RangeParserPredicate) => Array<string>> = new Map();
// n-m
rangeParsers.set(/\d-\d/, (str, predicate) => {
    const range = str.split('-');
    const result = [];
    for (let i = +range[0], max = +range[1]; i <= max; i++) {
        if (!predicate || predicate(i)) {
            result.push('' + i);
        }
    }
    return result;
});
// n+ | +n
rangeParsers.set(/\d\+|\+\d/, (str, predicate) => {
    const result = [];
    for (let i = +str.replace(/\+/g, ''); i <= 999; i++) {
        if (!predicate || predicate(i)) {
            result.push('' + i);
        }
    }
    return result;
});
// n- | -n
rangeParsers.set(/\d-|-\d/, (str, predicate) => {
    const result = [];
    for (let i = 0, max = +str.replace(/-/g, ''); i <= max; i++) {
        if (!predicate || predicate(i)) {
            result.push('' + i);
        }
    }
    return result;
});
// с n
rangeParsers.set(/с\s?\d/, (str, predicate) => {
    const result = [];
    for (let i = +str.replace(/с\s?/, ''); i <= 999; i++) {
        if (!predicate || predicate(i)) {
            result.push('' + i);
        }
    }
    return result;
});

export default rangeParsers;
