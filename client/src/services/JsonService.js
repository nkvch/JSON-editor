
export class JsonService {
    static countOpenBrackets(str) {
        return str.split('').filter(char => char === '{').length;
    }
    
    static countClouseBrackets(str) {
        return str.split('').filter(char => char === '}').length;
    }
    
    static findJson(str, timesCalled) {
        if (timesCalled > 20) {
            return null;
        }
        // pseudo-walidacja JSONa polegająca na tym że json w teorii nie ma w sobie symboli = ; ( ) właściwych dla funkcji JS
        // walidacja służy celom pseudo-bezpieczności (uniknięcie ewaluacji jakiegoś kodu zewnętrznego, jeżeli taki znajdzie się pod podanym adresem)
        // szczególnie służy do wyodrębnienia JSONa s js-pliku pod adresem https://std.wpcdn.pl/adv/config/inline/desktop-pudelek.pl.js 
        const matched = str.match(/(\{|\[)[^;=\(\)]*(\}|\])/) ? str.match(/(\{|\[)[^;=\(\)]*(\}|\])/)[0] : undefined;
        try {
            const object = eval('(' + matched + ')');
            return Array.isArray(object) ? {array: object} : object;
        } catch {
            if (this.countClouseBrackets(matched) > this.countOpenBrackets(matched)) {
                return this.findJson(matched.slice(0,-1), timesCalled += 1);
            } else if (this.countClouseBrackets(matched) < this.countOpenBrackets(matched)) {
                return this.findJson(matched.slice(1), timesCalled += 1);
            } else {
                return this.findJson(matched.slice(1).slice(0,-1), timesCalled += 1);
            } 
        }
    }
}