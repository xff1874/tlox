import Token from "./Token";

export default class Environment {
  values: Map<string, object | undefined>;

  constructor() {
    this.values = new Map();
  }

  define(name: string, value?: object) {
    this.values.set(name, value);
  }

  assign(name: Token, value: Object): void {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }
    throw new Error(`Runtime Error undefined variable ${name.lexeme}`);
  }

  get(name: Token) {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    throw Error(`Runtime Error Undefined variable ${name.lexeme}`);
  }
}
