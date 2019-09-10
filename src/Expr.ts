import Token from "./Token";
export abstract class Expr {
  abstract accept<R>(v: Visitor<R>): R;
}
export interface Visitor<R> {
  visitBinaryExpr(expr: Binary): R;
  visitGroupingExpr(expr: Grouping): R;
  visitLiteralExpr(expr: Literal): R;
  visitUnaryExpr(expr: Unary): R;
}
export class Binary extends Expr {
  left: Expr;
  operator: Token;
  right: Expr;
  constructor(left: Expr, operator: Token, right: Expr) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitBinaryExpr(this);
  }
}
export class Grouping extends Expr {
  expression: Expr;
  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitGroupingExpr(this);
  }
}
export class Literal extends Expr {
  value: Object;
  constructor(value: Object) {
    super();
    this.value = value;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitLiteralExpr(this);
  }
}
export class Unary extends Expr {
  operator: Token;
  right: Expr;
  constructor(operator: Token, right: Expr) {
    super();
    this.operator = operator;
    this.right = right;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitUnaryExpr(this);
  }
}
