import { Visitor, Binary, Grouping, Literal, Unary, Expr } from "./Expr";
import TokenType from "./TokenType";

class Interpreter implements Visitor<Object> {
  visitBinaryExpr(expr: Binary): Object {
    let left = this.evaluate(expr.left);
    let right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        return Number(left) - Number(right);
      case TokenType.SLASH:
        return Number(left) / Number(right);
      case TokenType.STAR:
        return Number(left) * Number(right);
      case TokenType.PLUS:
        if (left instanceof Number && right instanceof Number) {
          return Number(left) + Number(right);
        } else if (left instanceof String && right instanceof String) {
          return String(left) + String(right);
        }
      case TokenType.GREATER:
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        return Number(left) >= Number(right);
      case TokenType.LESS:
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
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
}
