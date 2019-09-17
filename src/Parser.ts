import Token from "./Token";
import { Expr, Binary, Unary, Literal, Grouping, Variable } from "./Expr";
import TokenType from "./TokenType";
import { Stmt, Print, Expression, Var } from "./Stmt";

export default class Parser {
  tokens: Token[]; //all input tokens
  current: number = 0; // index pointing to tokens.
  isValid: boolean = true;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  expression(): Expr {
    return this.equality();
  }

  //equality → comparison ( ( "!=" | "==" ) comparison )* ;
  equality(): Expr {
    let expr: Expr = this.comparison();
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      let operator = this.previous();
      let right: Expr = this.comparison();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  match(...types: TokenType[]): boolean {
    for (let t of types) {
      if (this.check(t)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }

  //return current token and move to next;
  advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd(): boolean {
    return this.peek().type == TokenType.EOF;
  }

  //Token yet to consume
  peek(): Token {
    return this.tokens[this.current];
  }
  //the most consumed token
  previous(): Token {
    return this.tokens[this.current - 1];
  }

  //comparison → addition ( ( ">" | ">=" | "<" | "<=" ) addition )* ;

  comparison(): Expr {
    let expr: Expr = this.addition();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      let op = this.previous();
      let right = this.addition();
      expr = new Binary(expr, op, right);
    }

    return expr;
  }

  addition(): Expr {
    let expr: Expr = this.multiplication();
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      let op: Token = this.previous();
      let right: Expr = this.multiplication();
      expr = new Binary(expr, op, right);
    }
    return expr;
  }

  multiplication(): Expr {
    let expr: Expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      let op = this.previous();
      let right = this.unary();
      expr = new Binary(expr, op, right);
    }

    return expr;
  }

  // unary → ( "!" | "-" ) unary
  //   | primary ;

  unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      let op = this.previous();
      let right = this.unary();
      return new Unary(op, right);
    }

    return this.primary();
  }

  // NUMBER | STRING | "false" | "true" | "nil"
  //     | "(" expression ")" ;

  primary(): Expr {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal({});

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }
    if (this.match(TokenType.LEFT_BRACE)) {
      let expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "expect ) after expresion");
      return new Grouping(expr);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return new Variable(this.previous());
    }

    throw this.error(this.peek(), "Expect expression.");
  }

  consume(type: TokenType, message: string): any {
    if (this.check(type)) return this.advance();
    this.error(this.peek(), message);
  }

  error(token: Token, message: string) {
    if (token.type == TokenType.EOF) {
      throw new Error(token.line + "at end" + message);
    } else {
      throw new Error(` ${token.line}  at ${token.lexeme} ${message}`);
    }
    this.isValid = false;
  }

  /**discard all tokens until next statement */
  synchonize(): void {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type == TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }
    }

    this.advance();
  }

  parse() {
    // try {
    //   return this.expression();
    // } catch (err) {
    //   //do some code handle
    //   throw new Error(err);
    // }
    let statements = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
  }

  declaration() {
    try {
      if (this.match(TokenType.VAR)) return this.varDeclaration();
      return this.statement();
    } catch (err) {
      this.synchonize();
    }
  }

  varDeclaration() {
    let name = this.consume(TokenType.IDENTIFIER, `Expect variable name`);
    let initializer;
    let v;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
      v = new Var(name, initializer);
    }
    this.consume(TokenType.SEMICOLON, `Expectd ; after variable declaration`);
    return v;
  }

  statement(): Stmt {
    if (this.match(TokenType.PRINT)) return this.printStatement();
    return this.expressionStatement();
  }

  printStatement(): Stmt {
    let val = this.expression();
    this.consume(TokenType.SEMICOLON, `Expect ; after value.`);
    return new Print(val);
  }

  expressionStatement(): Stmt {
    let expr = this.expression();
    this.consume(TokenType.SEMICOLON, `Excpect ; after expression`);
    return new Expression(expr);
  }
}
