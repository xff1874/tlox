import Token from "./Token";
import { Expr } from "./Expr";
export abstract class Stmt {
  abstract accept<R>(v: Visitor<R>): R;
}
export interface Visitor<R> {
  visitExpressionStmt(stmt: Expression): R;
  visitPrintStmt(stmt: Print): R;
  visitVarStmt(stmt: Var): R;
}
export class Expression extends Stmt {
  expression: Expr;
  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitExpressionStmt(this);
  }
}
export class Print extends Stmt {
  expression: Expr;
  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitPrintStmt(this);
  }
}
export class Var extends Stmt {
  name: Token;
  initializer: Expr;
  constructor(name: Token, initializer: Expr) {
    super();
    this.name = name;
    this.initializer = initializer;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitVarStmt(this);
  }
}
