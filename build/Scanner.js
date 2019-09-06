"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Token_1 = __importDefault(require("./Token"));
var TokenType_1 = __importDefault(require("./TokenType"));
// import Lox from "./Lox";
var Scanner = /** @class */ (function () {
    function Scanner(source) {
        this.hadError = false;
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.keywords = new Map();
        this.source = source;
        this.keywords.set("and", TokenType_1.default.AND);
        this.keywords.set("class", TokenType_1.default.CLASS);
        this.keywords.set("else", TokenType_1.default.ELSE);
        this.keywords.set("false", TokenType_1.default.FALSE);
        this.keywords.set("for", TokenType_1.default.FOR);
        this.keywords.set("fun", TokenType_1.default.FUN);
        this.keywords.set("if", TokenType_1.default.IF);
        this.keywords.set("nil", TokenType_1.default.NIL);
        this.keywords.set("or", TokenType_1.default.OR);
        this.keywords.set("print", TokenType_1.default.PRINT);
        this.keywords.set("return", TokenType_1.default.RETURN);
        this.keywords.set("super", TokenType_1.default.SUPER);
        this.keywords.set("this", TokenType_1.default.THIS);
        this.keywords.set("true", TokenType_1.default.TRUE);
        this.keywords.set("var", TokenType_1.default.VAR);
        this.keywords.set("while", TokenType_1.default.WHILE);
    }
    Scanner.prototype.scanTokens = function () {
        while (!this.isAtEnd()) {
            //这里 设置start的值。每次循环重新处理一次
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token_1.default(TokenType_1.default.EOF, "", '', this.line));
        return this.tokens;
    };
    Scanner.prototype.isAtEnd = function () {
        return this.current >= this.source.length;
    };
    Scanner.prototype.scanToken = function () {
        var c = this.advance();
        switch (c) {
            case '(':
                this.addToken(TokenType_1.default.LEFT_PAREN);
                break;
            case ')':
                this.addToken(TokenType_1.default.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(TokenType_1.default.LEFT_BRACE);
                break;
            case '}':
                this.addToken(TokenType_1.default.RIGHT_BRACE);
                break;
            case ',':
                this.addToken(TokenType_1.default.COMMA);
                break;
            case '.':
                this.addToken(TokenType_1.default.DOT);
                break;
            case '-':
                this.addToken(TokenType_1.default.MINUS);
                break;
            case '+':
                this.addToken(TokenType_1.default.PLUS);
                break;
            case ';':
                this.addToken(TokenType_1.default.SEMICOLON);
                break;
            case '*':
                this.addToken(TokenType_1.default.STAR);
                break;
            case '!':
                this.addToken(this.match('=') ? TokenType_1.default.BANG_EQUAL : TokenType_1.default.BANG);
                break;
            case '=':
                this.addToken(this.match('=') ? TokenType_1.default.EQUAL_EQUAL : TokenType_1.default.EQUAL);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType_1.default.LESS_EQUAL : TokenType_1.default.LESS);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType_1.default.GREATER_EQUAL : TokenType_1.default.GREATER);
                break;
            case '/': //处理comment
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd())
                        this.advance();
                }
                else {
                    this.addToken(TokenType_1.default.SLASH); //添加slash token.
                }
                break;
            case ' ':
            case '\r':
            case '\t':
                //忽略空白,其他的lexer都是用一个skipWhiteSpace
                break;
            case '\n':
                this.line++;
                break;
            case '"': //碰到“处理字符串
                this.string();
                break;
            default:
                if (this.isDigit(c)) { //处理数字
                    this.number();
                }
                else if (this.isAlpha(c)) { //处理字面量
                    this.identifier();
                }
                else {
                    this.error(this.line, "Unexpected character " + c);
                }
                break;
        }
    };
    /**获取下一个字符 */
    Scanner.prototype.advance = function () {
        this.current++;
        return this.source.charAt(this.current - 1);
    };
    /**匹配,其实是lookahead ,如果匹配,则移动指针,这里觉得两个功能合并在一起了，应该只做匹配，然后调用advance*/
    Scanner.prototype.match = function (t) {
        if (this.isAtEnd)
            return false;
        var currentChar = this.source.charAt(this.current);
        if (currentChar != t)
            return false;
        this.current++;
        return true;
    };
    /**peek 就是lookahead 1 */
    Scanner.prototype.peek = function () {
        if (this.isAtEnd())
            return '\0';
        return this.source.charAt(this.current);
    };
    /**lookahead 2, 感觉可以用同一个 */
    Scanner.prototype.peekNext = function () {
        if (this.current + 1 >= this.source.length)
            return '\0';
        return this.source.charAt(this.current + 1);
    };
    /**字符串处理 */
    Scanner.prototype.string = function () {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n')
                this.line++;
            this.advance();
        }
        if (this.isAtEnd()) {
            this.error(this.line, "unterminated string.");
            return;
        }
        this.advance(); //处理最后一个"
        var value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType_1.default.STRING, value);
    };
    /*数字匹配*/
    Scanner.prototype.isDigit = function (c) {
        return /\d/.test(c);
    };
    //数字和字符
    Scanner.prototype.isAlpha = function (c) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c == '_';
    };
    Scanner.prototype.isAlphaNumber = function (c) {
        return this.isAlpha(c) || this.isDigit(c);
    };
    /**处理数字 */
    Scanner.prototype.number = function () {
        //判断是否一直是数字
        while (this.isDigit(this.peek()))
            this.advance();
        //处理小数
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek()))
                this.advance();
        }
        this.addToken(TokenType_1.default.NUMBER, Number(this.source.substring(this.start, this.current)));
    };
    ;
    /**字面量 */
    Scanner.prototype.identifier = function () {
        while (this.isAlphaNumber(this.peek()))
            this.advance();
        //判断是否是关键字
        var text = this.source.substring(this.start, this.current);
        var type = this.keywords.get(text);
        if (type == null)
            type = TokenType_1.default.IDENTIFIER;
        this.addToken(type);
    };
    /**添加token */
    Scanner.prototype.addToken = function (type, literal) {
        var text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token_1.default(type, text, literal, this.line));
    };
    /**错误处理 */
    Scanner.prototype.error = function (line, message) {
        this.report(line, "", message);
    };
    /** report 信息 */
    Scanner.prototype.report = function (line, where, message) {
        console.log("[line " + line + "] Error " + where + " : " + message);
        this.hadError = true;
    };
    return Scanner;
}());
exports.default = Scanner;
//# sourceMappingURL=Scanner.js.map