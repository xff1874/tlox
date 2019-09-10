/* global describe, it */
// import Scanner from "./build/Scanner"

const fs = require("fs");
const path = require("path");
const Scanner = require("../build/Scanner");
const TokenType = require("../build/TokenType");
const { Binary, Grouping, Literal, Unary } = require("../build/Expr");
const { AstPrinter } = require("../build/AstPrinter");
const Token = require("../build/Token");

debugger;

test("produces tokens for basic arithmetic", () => {
  const source = fs.readFileSync("./examples/simple.lox", "utf-8");

  const tokens = new Scanner.default(source).scanTokens();
  let expectedArr = [
    TokenType.default.PRINT,
    TokenType.default.LEFT_PAREN,
    TokenType.default.NUMBER,
    TokenType.default.PLUS,
    TokenType.default.NUMBER,
    TokenType.default.RIGHT_PAREN,
    TokenType.default.STAR,
    TokenType.default.LEFT_PAREN,
    TokenType.default.NUMBER,
    TokenType.default.MINUS,
    TokenType.default.NUMBER,
    TokenType.default.RIGHT_PAREN,
    TokenType.default.SEMICOLON,
    TokenType.default.EOF
  ];
  for (let i = 0; i < tokens.length; i++) {
    expect(tokens[i].type).toBe(expectedArr[i]);
  }
});

test("ast printer test", () => {
  let expression = new Binary(
    new Unary(
      new Token.default(TokenType.MINUS, "-", null, 1),
      new Literal(123)
    ),
    new Token.default(TokenType.STAR, "*", null, 1),
    new Grouping(new Literal(45.67))
  );

  let astPrinter = new AstPrinter();
  expect(astPrinter.print(expression)).toBe(`(* (- 123) (group 45.67))`);
});
