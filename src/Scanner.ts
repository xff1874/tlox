import Token from "./Token";
import TokenType from "./TokenType";
import Lox from "./lox";


class Scanner{
    hadError: boolean=false;
    source:string;
    tokens:Token[]=[];
    start:number=0;
    current:number = 0;
    line:number = 1;
    keywords:Map<string,TokenType> = new Map();

    constructor(source:string){
        this.source = source;
        this.keywords.set("and",    TokenType.AND);                       
        this.keywords.set("class",  TokenType.CLASS);                     
        this.keywords.set("else",   TokenType.ELSE);                      
        this.keywords.set("false",  TokenType.FALSE);                     
        this.keywords.set("for",    TokenType.FOR);                       
        this.keywords.set("fun",    TokenType.FUN);                       
        this.keywords.set("if",     TokenType.IF);                        
        this.keywords.set("nil",    TokenType.NIL);                       
        this.keywords.set("or",     TokenType.OR);                        
        this.keywords.set("print",  TokenType.PRINT);                     
        this.keywords.set("return", TokenType.RETURN);                    
        this.keywords.set("super",  TokenType.SUPER);                     
        this.keywords.set("this",   TokenType.THIS);                      
        this.keywords.set("true",   TokenType.TRUE);                      
        this.keywords.set("var",    TokenType.VAR);                       
        this.keywords.set("while",  TokenType.WHILE); 
    }

    scanTokens():Token[]{
        while(!this.isAtEnd()){
            //这里 设置start的值。每次循环重新处理一次
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF,"",'',this.line));
        return this.tokens;
    }
    
    isAtEnd():boolean{
        return this.current >= this.source.length;
    }

    private scanToken():void{
        let c = this.advance();

        switch(c){
            case '(': this.addToken(TokenType.LEFT_PAREN);break;
            case ')': this.addToken(TokenType.RIGHT_PAREN);break;
            case '{': this.addToken(TokenType.LEFT_BRACE);break;
            case '}': this.addToken(TokenType.RIGHT_BRACE);break;
            case ',': this.addToken(TokenType.COMMA);break;
            case '.': this.addToken(TokenType.DOT);break;
            case '-': this.addToken(TokenType.MINUS);break;
            case '+': this.addToken(TokenType.PLUS);break;
            case ';': this.addToken(TokenType.SEMICOLON);break;
            case '*': this.addToken(TokenType.STAR);break;
            case '!': this.addToken(this.match('=')?TokenType.BANG_EQUAL:TokenType.BANG);break;
            case '=': this.addToken(this.match('=')?TokenType.EQUAL_EQUAL:TokenType.EQUAL);break;
            case '<': this.addToken(this.match('=')?TokenType.LESS_EQUAL:TokenType.LESS);break;
            case '>': this.addToken(this.match('=')?TokenType.GREATER_EQUAL:TokenType.GREATER);break;
            case '/'://处理comment
                    if(this.match('/')){
                        while(this.peek() != '\n' && !this.isAtEnd())this.advance();
                    }else{
                        this.addToken(TokenType.SLASH);//添加slash token.
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
            case '"'://碰到“处理字符串
                    this.string();
                    break;
            default:
                if(this.isDigit(c)){//处理数字
                    this.number();
                } else if(this.isAlpha(c)){ //处理字面量
                    this.identifier();
                }
                  else{
                    this.error(this.line,`Unexpected character ${c}`);
                }
                break;
        }
    }
    /**获取下一个字符 */
    private advance():string{
        this.current++;
        return this.source.charAt(this.current -1);
    }

  

    /**匹配,其实是lookahead ,如果匹配,则移动指针,这里觉得两个功能合并在一起了，应该只做匹配，然后调用advance*/
    private match(t:string):Boolean{
        if(this.isAtEnd) return false;
        let currentChar = this.source.charAt(this.current )
        if(currentChar != t) return false;

        this.current++;
        return true;
    }
    /**peek 就是lookahead 1 */
    private peek():string{
        if(this.isAtEnd()) return '\0';
        return this.source.charAt(this.current);
    }
    /**lookahead 2, 感觉可以用同一个 */
    private peekNext():string{
        if(this.current + 1 >=this.source.length) return '\0';
        return this.source.charAt(this.current+1);
    }

    /**字符串处理 */
    private string():void{
        while(this.peek() != '"'&& !this.isAtEnd()){
            if(this.peek() == '\n') this.line++;
            this.advance();
        }

        if(this.isAtEnd()){
            this.error(this.line,"unterminated string.");
            return;
        }
        this.advance();//处理最后一个"
        let value:string = this.source.substring(this.start+1, this.current-1);
        this.addToken(TokenType.STRING,value);
    }

      /*数字匹配*/
    isDigit(c:string):boolean{
        return /\d/.test(c);
    }
    //数字和字符
    isAlpha(c:string):boolean{
        return (c >= 'a' && c <= 'z') ||      
        (c >= 'A' && c <= 'Z') ||      
         c == '_';
    }

    isAlphaNumber(c:string){
        return this.isAlpha(c) || this.isDigit(c);
    }

    /**处理数字 */
    number():void{

        //判断是否一直是数字
        while(this.isDigit(this.peek())) this.advance();

        //处理小数
        if(this.peek() == '.' && this.isDigit(this.peekNext())){
            this.advance();

            while(this.isDigit(this.peek())) this.advance();
        }

        this.addToken(TokenType.NUMBER, Number(this.source.substring(this.start,this.current)))
    };

    /**字面量 */
    identifier(){
        while(this.isAlphaNumber(this.peek())) this.advance();

        //判断是否是关键字
        let text:string = this.source.substring(this.start,this.current);

        let type = this.keywords.get(text);
        if(type ==null) type = TokenType.IDENTIFIER;
        this.addToken(type);
    }

    /**添加token */
    private addToken(type:TokenType, literal?:string|number ):void{
        let text = this.source.substring(this.start,this.current);
        this.tokens.push(new Token(type,text,literal,this.line))
    }

    /**错误处理 */
    error(line:number, message:string):void{
        this.report(line,"",message);
    }

    /** report 信息 */
    report(line:number,where:string,message:string){
        console.log(`[line ${line}] Error ${where} : ${message}`);
        this.hadError = true;
    }

     
}
export default Scanner;