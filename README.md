# pe-fp
Functional programming in plain english

# TL;DR

Allows to turn this:

```typescript
const cake = cooledOnDampTeaTowel(bakedIn(preheated("oven"))(whiskedUntilSmooth(mixed(["flour", "eggs", "sugar", "chocolate"]))))

expect(`A ${cake}`).toBe(
  "A room temperature cake made from whisked batter made out of flour, eggs, sugar and chocolate baked in a preheated oven"
);
```

Into this:

```typescript
export const preparedCake = startsWith(mixed, "ingredients")
  .andThen(is(whiskedUntilSmooth))
  .andThen(is(bakedIn(preheated("oven"))))
  .andThen(is(cooledOnDampTeaTowel));
  
expect(`A ${preparedCake(["flour", "eggs", "sugar", "chocolate"])}`).toBe(
  "A room temperature cake made from whisked batter made out of flour, eggs, sugar and chocolate baked in a preheated oven"
);

```
