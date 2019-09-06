/* global describe, it */
// import Scanner from "./build/Scanner"
const fs = require('fs');
const path = require('path');
const Scanner = require('../build/Scanner');
const TokenType = require("../build/TokenType");

debugger;
test('produces tokens for basic arithmetic', () => {
    const source = fs.readFileSync('./examples/simple.lox', 'utf-8')

    const tokens = new Scanner.default(source).scanTokens();
    let expectedArr=[
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
      ]
    for(let i = 0;i<tokens.length;i++){
        expect(tokens[i].type).toBe(expectedArr[i])
    }
  })
