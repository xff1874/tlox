import Token from "./Token";

export default class Environment {
  values: Map<string, object | undefined>;
  enclosing: Environment | null;

  constructor(enclosing?: Environment) {
    this.values = new Map();
    if (enclosing) this.enclosing = enclosing;
  }

  define(name: string, value?: object) {
    this.values.set(name, value);
  }

  assign(name: Token, value: Object): void {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }
    if (this.enclosing) {
      this.enclosing.assign(name, value);
      return;
    }
    throw new Error(`Runtime Error undefined variable ${name.lexeme}`);
  }

  get(name: Token): any {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    if (this.enclosing) return this.enclosing.get(name);

    throw Error(`Runtime Error Undefined variable ${name.lexeme}`);
  }
}
