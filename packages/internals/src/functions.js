class ExtensibleFunction extends Function {
  constructor(fn) {
    super();
    return Object.setPrototypeOf(fn, new.target.prototype);
  }
}

class Fn extends ExtensibleFunction {
  constructor(fn, outerScope, type, options = {}) {
    const { arity, args = [], curried = true, scoped = true } = options;
    const wrapped = (...args) => {
      const newArgs = [...this.args, ...args];
      if (this.curried && newArgs.length < this.arity - scoped ? 1 : 0)
        return new Fn(this.fn, this.outerScope, this.type, {
          arity: this.arity,
          args: newArgs,
          scoped: this.scoped
        });
      if (this.scoped) newArgs.unshift(new Scope({}, this.outerScope));
      const result = new this.type(() => this.fn(...newArgs));
      return result instanceof IO ? result.valueOf() : result;
    };
    super(wrapped);
    this.id = uuidv4();
    this.fn = fn;
    this.outerScope = outerScope;
    this.type = type;
    this.isLazy = type == Lazy;
    this.arity = arity || getArity(fn);
    this.args = args;
    this.curried = curried;
    this.scoped = scoped;
    this.isClioFn = true;
  }
  unCurry() {
    return new Fn(this.fn, this.outerScope, this.type, {
      arity: this.arity,
      args: this.args,
      curried: false,
      scoped: this.scoped
    });
  }
}

const fn = (...args) => new Fn(...args);

module.exports.fn = fn;
module.exports.Fn = Fn;
module.exports.ExtensibleFunction = ExtensibleFunction;

const uuidv4 = require("./uuidv4");
const { Scope } = require("./scope");
const { IO } = require("./io");
const { Lazy } = require("./lazy");
const { getArity } = require("./arity");
