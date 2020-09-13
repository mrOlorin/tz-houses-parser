import rangeParsers, {RangeParserPredicate} from "./rangeParsers";

export default class HousesParser {
    private readonly houseNumbers: Array<string> = [];

    public constructor(private readonly source: string) {
        let tokens = source.split(/(четные|нечетные)(?:[;, .]*)((?:с|по)?\s?[\d+-]+)/);
        this.parseTokens(tokens);
    }

    public isHouseIncluded(houseNumber: string): boolean {
        return this.houseNumbers.indexOf(houseNumber) > -1;
    }

    private parseTokens(tokens: Array<string>) {
        if (tokens.length === 1) {
            tokens = tokens[0].split(/[\s?,]+/);
            for (let token of tokens) {
                this.houseNumbers.push(...HousesParser.parseNumberString(token));
            }
        } else {
            tokens = tokens.filter((token: string) =>
                token.length > 0 && token.match(/[\d]|чет/)
            );
            const oddPredicate = (num: string) => +num % 2 !== 0;
            const evenPredicate = (num: string) => +num % 2 === 0;
            const handlers: { [key: string]: (token: string) => any } = {
                четные: token => HousesParser.parseNumberString(token, evenPredicate),
                нечетные: token => HousesParser.parseNumberString(token, oddPredicate)
            }
            for (let i = 1, len = tokens.length; i < len; i += 2) {
                if (!handlers[tokens[i - 1]]) {
                    console.error('Unhandled token', tokens[i - 1]);
                    throw new Error('Unhandled token');
                }
                this.houseNumbers.push(...handlers[tokens[i - 1]](tokens[i]));
            }
        }
    }

    private static parseNumberString(numStr: string, predicate?: RangeParserPredicate) {
        for (let [regex, ranger] of rangeParsers) {
            if (regex.test(numStr)) {
                return ranger(numStr, predicate);
            }
        }
        return [numStr];
    }
}
