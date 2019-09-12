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

const noop = () => {};
const Expression = (left = noop, op = noop, right = noop) => {
  return obj => {
    assert.ok(typeof obj === "object", "Expression not an object");
    assert.ok(
      typeof obj.expression === "object",
      "Expression.expression not an object"
    );

    const expr = obj.expression;
    assert.ok(typeof expr.left === "object", "Left not an object" + expr.left);
    assert.ok(typeof expr.operator === "object", "Operator not an object");
    assert.ok(typeof expr.right === "object", "Right not an object");

    left(expr.left);
    op(expr.op);
    right(expr.right);
  };
};
const Value = val => obj => {
  assert.ok(typeof obj === "object", "Value not an object");
  assert.ok(obj.value === val, "Actual value doesnt match");
};

test("parser", () => {
  const source = fs.readFileSync("./examples/simple.lox", "utf-8");
  // debugger;

  const tokens = new Scanner.default(`6/3-1`).scanTokens();
  let p = new Parser.default(tokens);
  const ast = p.parse();
  expect(p.isValid).toBe(true);
});
