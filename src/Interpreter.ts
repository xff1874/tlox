import { Visitor, Binary, Grouping, Literal, Unary, Expr } from "./Expr";
import TokenType from "./TokenType";
import Token from "./Token";
import { Visitor as StmtVistor, Stmt, Expression, Print } from "./Stmt";

class Interpreter implements Visitor<Object>, StmtVistor<Object> {
  visitVariableExpr(expr: import("./Expr").Variable): Object {
    throw new Error("Method not implemented.");
  }
  visitVarStmt(stmt: import("./Stmt").Var): Object {
    throw new Error("Method not implemented.");
  }
  visitExpressionStmt(stmt: Expression): Object {
    return this.evaluate(stmt.expression);
  }
  visitPrintStmt(stmt: Print): Object {
    let val = this.evaluate(stmt.expression);
    let r = JSON.stringify(val);
    console.log(r);
    return r;
  }
  visitBinaryExpr(expr: Binary): Object {
    let left = this.evaluate(expr.left);
    let right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) - Number(right);
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) / Number(right);
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) * Number(right);
      case TokenType.PLUS:
        if (typeof left == "number" && typeof right == "number") {
          return Number(left) + Number(right);
        } else if (typeof left == "string" && typeof right == "string") {
          return String(left) + String(right);
        } else
          throw new Error(
            `${expr.operator} Operands must be numbers or string`
          );
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) >= Number(right);
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) <= Number(right);
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
    }

    return new Error(`visitBinaryExpr error`);
  }

  isEqual(a: Object, b: Object): boolean {
    return a === b;
  }

  visitUnaryExpr(expr: Unary): Object {
    let right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS:
        return -Number(right);
      case TokenType.BANG:
        return !this.isTruthy(right);
    }
    throw new Error(` visitUnaryExpr error`);
  }

  visitGroupingExpr(expr: Grouping): Object {
    return this.evaluate(expr.expression);
  }

  visitLiteralExpr(expr: Literal): Object {
    return expr.value;
  }

  evaluate(expr: Expr): Object {
    return expr.accept(this);
  }

  isTruthy(object: Object) {
    if (object == null) return false;
    if (object instanceof Boolean) return Boolean(object);
    return true;
  }
  checkNumberOperand(operator: Token, operand: Object) {
    if (typeof operand == "number") return;
    throw new Error(`${operator} operand must be a number`);
  }

  checkNumberOperands(operator: Token, left: Object, right: Object) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new Error(`${operator} Oprands must be number`);
  }

  execute(stmt: Stmt) {
    stmt.accept(this);
  }

  interpret(statements: Stmt[]) {
    try {
      for (let statement of statements) {
        this.execute(statement);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default Interpreter;
