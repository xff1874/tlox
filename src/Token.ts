import TokenType from "./TokenType";


class Token{
    type:TokenType;
    lexeme:string;
    literal:string|number; //不知道什么作用，感觉有lexeme就足够了
    line:number;

    constructor(type:TokenType,lexeme:string,literal:string|number='',line:number){
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    toString():string{
        return `${this.type}  ${this.lexeme} ${this.literal}`
    }
}

export default Token;