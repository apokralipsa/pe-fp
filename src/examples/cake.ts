import { is, startsWith } from "../function-composition";

export const mixed = (ingredients: string[]) => {
  if (!ingredients.includes("sugar")) {
    throw "up"; // NOTE: throwing something else than an Error is a bad practice. Also, tee-hee.
  }
  return `batter made out of ${listOf(ingredients)}`;
};

export const listOf = (things: string[]) => {
  const [last, ...rest] = [...things].reverse();
  return `${rest.reverse().join(", ")} and ${last}`;
};

export const whiskedUntilSmooth = (batter: string) => `whisked ${batter}`;

export const bakedIn = (appliance: string) => (batter: string) => {
  if (appliance.includes("preheated")) {
    return `cake made from ${batter} baked in a ${appliance}`;
  } else {
    throw new Error(`Cannot bake because ${appliance} is not preheated`); // NOTE: throwing errors instead of returning may make your code harder to follow
  }
};
export const preheated = (appliance: string) => `preheated ${appliance}`;

export const cooledOnDampTeaTowel = (hotThing: string) => `room temperature ${hotThing}`;

export const preparedCake = startsWith(mixed, "ingredients")
  .andThen(is(whiskedUntilSmooth))
  .andThen(is(bakedIn(preheated("oven"))))
  .andThen(is(cooledOnDampTeaTowel));
