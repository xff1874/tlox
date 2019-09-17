import { Visitor, Binary, Grouping, Literal, Unary, Expr } from "./Expr";

export class AstPrinter implements Visitor<string> {
  visitVariableExpr(expr: import("./Expr").Variable): string {
    throw new Error("Method not implemented.");
  }
  visitBinaryExpr(expr: Binary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }
  visitGroupingExpr(expr: Grouping): string {
    return this.parenthesize("group", expr.expression);
  }
  visitLiteralExpr(expr: Literal): string {
    if (expr.value == null) return "nil";
    return expr.value.toString();
  }
  visitUnaryExpr(expr: Unary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  print(expr: Expr): string {
    return expr.accept(this);
  }

  parenthesize(name: string, ...exprs: Expr[]) {
    let builder = [];
    builder.push("(");
    builder.push(name);

    for (let expr of exprs) {
      builder.push(" ");
      builder.push(expr.accept(this));
    }
    builder.push(")");

    return builder.join("");
  }
}
