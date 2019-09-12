/* global describe, it */
// import Scanner from "./build/Scanner"

const fs = require("fs");
const path = require("path");
const Scanner = require("../build/Scanner");
const TokenType = require("../build/TokenType");
const { Binary, Grouping, Literal, Unary } = require("../build/Expr");
const { AstPrinter } = require("../build/AstPrinter");
const Token = require("../build/Token");
const Parser = require("../build/Parser");

test("parser", () => {
  const tokens = new Scanner.default(`6/3-1`).scanTokens();
  let p = new Parser.default(tokens);
  const ast = p.parse();
  expect(p.isValid).toBe(true);
});
