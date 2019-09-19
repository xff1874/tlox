import Token from "./Token";
export abstract class Expr {
  abstract accept<R>(v: Visitor<R>): R;
}
export interface Visitor<R> {
  visitAssignExpr(expr: Assign): R;
  visitBinaryExpr(expr: Binary): R;
  visitGroupingExpr(expr: Grouping): R;
  visitLiteralExpr(expr: Literal): R;
  visitLogicalExpr(expr: Logical): R;
  visitUnaryExpr(expr: Unary): R;
  visitVariableExpr(expr: Variable): R;
}
export class Assign extends Expr {
  name: Token;
  value: Expr;
  constructor(name: Token, value: Expr) {
    super();
    this.name = name;
    this.value = value;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitAssignExpr(this);
  }
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
  value: any;
  constructor(value: any) {
    super();
    this.value = value;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitLiteralExpr(this);
  }
}
export class Logical extends Expr {
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
    return v.visitLogicalExpr(this);
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
export class Variable extends Expr {
  name: Token;
  constructor(name: Token) {
    super();
    this.name = name;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitVariableExpr(this);
  }
}
