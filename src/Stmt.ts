import Token from "./Token";
import { Expr } from "./Expr";
abstract class Stmt {
  abstract accept<R>(v: Visitor<R>): R;
}
interface Visitor<R> {
  visitExpressionStmt(stmt: Expression): R;
  visitPrintStmt(stmt: Print): R;
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
