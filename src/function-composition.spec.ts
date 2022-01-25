import { first, is, startsWith } from './function-composition';
import { bakedIn, cooledOnDampTeaTowel, mixed, preparedCake } from './examples/cake';

describe("Function composition", () => {

  it("should allow to combine functions", () => {
    expect(`A ${preparedCake(["flour", "eggs", "sugar", "chocolate"])}`).toBe(
      "A room temperature cake made from whisked batter made out of flour, eggs, sugar and chocolate baked in preheated oven"
    );
  });

  it("should allow to run a single function", () => {
    expect(
      startsWith(mixed)(["flour", "eggs", "sugar", "chocolate"])
    ).toEqual("batter made out of flour, eggs, sugar and chocolate");
  });

  it("should return errors instead of throwing them", () => {
    const makeColdBatter = startsWith(mixed)
      .andThen(is(bakedIn("cold oven")))
      .andThen(is(cooledOnDampTeaTowel));

    expect(makeColdBatter(["flour", "eggs", "sugar", "chocolate"])).toEqual(
      new Error("Cannot bake because cold oven is not preheated")
    );
  });

  it("should wrap incorrectly thrown values in errors", () => {
    const saltyCake = preparedCake(["flour", "eggs", "SALT", "chocolate"]);
    expect(saltyCake).toBeInstanceOf(Error);
  });

  it("should allow to start with multiple arguments", () => {
    const add = (a: number, other: number) => a + other;
    const multiplyBy = (multiplier: number) => (multiplicand: number) =>
      multiplier * multiplicand;

    const operate = first(add).andThen(multiplyBy(2));

    expect(operate(1, 2)).toEqual(6);
  });
});
