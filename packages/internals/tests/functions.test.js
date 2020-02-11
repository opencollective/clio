const { Fn } = require("../src/functions");
const { getArity } = require("../src/arity");
const { Lazy } = require("../src/lazy");

test("Test Clio function currying", () => {
  const add = new Fn((scope, a, b) => a + b, null, Lazy);
  const add2 = add(2);
  expect(add2).toBeInstanceOf(Fn);
  expect(add2(3).valueOf()).toBe(5);
});

test("Test getArity", () => {
  const arity = getArity(function(a, b, c) {
    return a + b + c;
  });
  expect(arity).toBe(3);
});

test("Test getArity with function declaration", () => {
  const arity = getArity(function myFunction(a, b, c) {
    return a + b + c;
  });
  expect(arity).toBe(3);
});

test("Test getArity on fat arrow functions", () => {
  const arity = getArity((a, b, c) => a + b + c);
  expect(arity).toBe(3);
});

test("Test getArity with default values", () => {
  const arity = getArity((a, b = 2, c) => a + b + c);
  expect(arity).toBe(3);
});

test("Test getArity with rest operator", () => {
  const arity = getArity((a, b, ...rest) => [a, b, ...rest]);
  expect(arity).toBe(Infinity);
});

test("Test getArity with deconstructing parameters", () => {
  const airty = getArity((a, { x, y, z }, c = [1, 2, 3]) => {});
  expect(arity).toBe(3);
});

test("Test getArity with array and object as default values", () => {
  const airty = getArity((a, c = [1, 2, 3], i = { x, y, z }) => {});
  expect(arity).toBe(3);
});

test("Test getArity with string and parentheses default values", () => {
  const airty = getArity((a, c = ",", b = 2 && (3 || 4)) => {});
  expect(arity).toBe(3);
});

test("Test getArity with parentheses default value", () => {
  const airty = getArity(function(a, b = 2 && (3 || 4)) {});
  expect(arity).toBe(2);
});

test("Test getArity with native functions", () => {
  const airty = getArity(Math.pow);
  expect(arity).toBe(2);
});
