import { isABoolean, isANumber, isAString, match } from "./pattern-matching";

describe("pattern matching", () => {
  function mystery(): string | number | boolean {
    return 42;
  }

  it("should allow to execute functions based on the type of input", () => {
    const valueOfUnknownType = mystery();

    const [result] = match(valueOfUnknownType)
      .ifIt(isANumber, (value) => `was a number: ${value}`)
      .ifIt(isAString, (value) => `was a string: ${value}`)
      .ifIt(isABoolean, (value) => `was a boolean: ${value}`);

    expect(result).toBe("was a number: 42");
  });

  it("should allow to return different types based on input value", () => {
    const [result] = match(mystery())
      .ifIt(isAString, (value) => `foobar ${value}`)
      .ifIt(isABoolean, (value) => !value)
      .ifIt(isANumber, (value) => value / 2);

    expect(result).toBe(21);
  });
});
