import { is, startsWith } from "./chaining";

const mixedIngredients = (ingredients: string[]) => {
  if (!ingredients.includes("sugar")) {
    throw "up"; // NOTE: throwing something else than an Error is a bad practice. Also, tee-hee.
  }
  return `batter made out of ${listed(ingredients)}`;
};

const listed = (ingredients: string[]) => {
  const [last, ...rest] = [...ingredients].reverse();
  return `${rest.reverse().join(", ")} and ${last}`;
};

const bakedIn = (oven: string) => (batter: string) => {
  if (oven.includes("preheated")) {
    return `cake made from ${batter} baked in ${oven}`;
  } else {
    throw new Error("Cannot bake in a cold oven"); // NOTE: throwing errors instead of returning may make your code harder to follow
  }
};

const preheated = (oven: string) => `preheated ${oven}`;

const cooledOnDampTeaTowel = (hotThing: string) =>
  `room temperature ${hotThing}`;

describe("chaining", () => {
  const preparedCake = startsWith(mixedIngredients)
    .andThen(is(bakedIn(preheated("oven"))))
    .andThen(is(cooledOnDampTeaTowel));

  it("should allow to combine functions", () => {
    expect(`A ${preparedCake(["flour", "eggs", "sugar", "chocolate"])}`).toBe(
      "A room temperature cake made from batter made out of flour, eggs, sugar and chocolate baked in preheated oven"
    );
  });

  it("should allow to run a single function", () => {
    expect(
      startsWith(mixedIngredients)(["flour", "eggs", "sugar", "chocolate"])
    ).toEqual("batter made out of flour, eggs, sugar and chocolate");
  });

  it("should return errors instead of throwing them", () => {
    const coldBatter = startsWith(mixedIngredients)
      .andThen(is(bakedIn("cold oven")))
      .andThen(is(cooledOnDampTeaTowel));

    const result = coldBatter(["flour", "eggs", "sugar", "chocolate"]);

    if (result instanceof Error) {
      expect(result.message).toBe("Cannot bake in a cold oven");
    } else {
      fail("An expected error was not returned");
    }
  });

  it("should wrap incorrectly thrown values in errors", () => {
    const saltyCake = preparedCake(["flour", "eggs", "SALT", "chocolate"]);
    expect(saltyCake instanceof Error).toBe(true);
  });
});
