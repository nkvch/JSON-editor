
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
        const matched = str.match(/\{[^;=\(\)]*\}/)[0];
        try {
            return eval('(' + matched + ')');
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