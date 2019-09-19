import Token from "./Token";
import { Expr } from "./Expr";
export abstract class Stmt {
  abstract accept<R>(v: Visitor<R>): R;
}
export interface Visitor<R> {
  visitBlockStmt(stmt: Block): R;
  visitExpressionStmt(stmt: Expression): R;
  visitIfStmt(stmt: If): R;
  visitPrintStmt(stmt: Print): R;
  visitVarStmt(stmt: Var): R;
  visitWhileStmt(stmt: While): R;
}
export class Block extends Stmt {
  statements: Stmt[];
  constructor(statements: Stmt[]) {
    super();
    this.statements = statements;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitBlockStmt(this);
  }
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
export class If extends Stmt {
  condition: Expr;
  thenBranch: Stmt;
  elseBranch: Stmt | null;
  constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitIfStmt(this);
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
export class While extends Stmt {
  condition: Expr;
  body: Stmt;
  constructor(condition: Expr, body: Stmt) {
    super();
    this.condition = condition;
    this.body = body;
  }
  accept<R>(v: Visitor<R>) {
    return v.visitWhileStmt(this);
  }
}
