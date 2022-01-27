import { match } from "./pattern-matching";
import {
  isA,
  isABigInt,
  isABoolean,
  isAnInstanceOf,
  isANumber,
  isAString,
  isASymbol,
  isNull,
  isUndefined,
} from "./type-guards";

describe("pattern matching", () => {
  function mystery(): string | number | boolean | symbol | null | undefined | bigint {
    return 42;
  }

  it("should allow to execute functions based on the type of input", () => {
    const valueOfUnknownType = mystery();

    const [result] = match(valueOfUnknownType)
      .ifIt(isAString, (value) => `was a string: ${value}`)
      .ifIt(isABoolean, (value) => `was a boolean: ${value}`)
      .ifIt(isANumber, (value) => `was a number: ${value}`)
      .ifIt(isABigInt, (value) => `was a bigint: ${value}`)
      .ifIt(isASymbol, () => `was a symbol`)
      .ifIt(isNull, () => `was null`)
      .ifIt(isUndefined, () => `was undefined`);

    expect(result).toBe("was a number: 42");
  });

  it("should allow to return different types based on input value", () => {
    const [result] = match(mystery())
      .ifIt(isAString, (value) => `foobar ${value}`)
      .ifIt(isABoolean, (value) => !value)
      .ifIt(isANumber, (value) => value / 2)
      .ifIt(isABigInt, (value) => `was a bigint: ${value}`)
      .ifIt(isASymbol, () => `was a symbol`)
      .ifIt(isNull, () => `was null`)
      .ifIt(isUndefined, () => `was undefined`);

    expect(result).toBe(21);
  });

  describe("based on classes", () => {
    class Circle {
      constructor(public readonly radius: number) {}
    }

    class Square {
      constructor(public readonly sideLength: number) {}
    }

    function mysteryInstance(): Circle | Square {
      return new Square(2);
    }

    it("should allow to work with discriminated unions", () => {
      const [area] = match(mysteryInstance())
        .ifIt(isAnInstanceOf(Square), (square) => Math.pow(square.sideLength, 2))
        .ifIt(isAnInstanceOf(Circle), (circle) => Math.pow(circle.radius, 2) * Math.PI);

      expect(area).toBe(4);
    });
  });

  describe("based on discriminated union types", () => {
    interface Circle {
      kind: "circle";
      radius: number;
    }

    interface Square {
      kind: "square";
      sideLength: number;
    }

    type Shape = Circle | Square;

    function mysteryShape(): Shape {
      return {
        kind: "square",
        sideLength: 2,
      };
    }

    it("should allow to work with discriminated unions", () => {
      const [area] = match(mysteryShape())
        .ifIt(isA<Shape>().ofKind("circle"), (shape) => Math.pow(shape.radius, 2) * Math.PI)
        .ifIt(isA<Shape>().ofKind("square"), (shape) => Math.pow(shape.sideLength, 2));

      expect(area).toBe(4);
    });
  });
});
