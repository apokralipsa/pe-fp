type TypeGuard<IN, T extends IN> = (input: IN) => input is T;
type GuardedFunction<TG> = TG extends TypeGuard<any, infer T>
  ? (value: T) => any
  : never;

export const isAString = (value: any): value is string =>
  typeof value === "string";

export const isANumber = (value: any): value is number =>
  typeof value === "number";

export const isABigInt = (input: any): input is bigint =>
  typeof input == "bigint";

export const isABoolean = (input: any): input is boolean =>
  typeof input === "boolean";

export const isASymbol = (input: any): input is symbol =>
  typeof input === "symbol";

export const isNull = (input: any): input is null => input === null;

export const isUndefined = (input: any): input is undefined =>
  input === undefined;

interface IncompleteMatch<IN, POSSIBLE_OUTS> {
  ifIt<
    T extends IN,
    TG extends TypeGuard<IN, T>,
    GF extends GuardedFunction<TG>
  >(
    typeGuard: TG,
    then: GF
  ): TG extends TypeGuard<any, infer NT>
    ? [Exclude<IN, NT>] extends [never]
      ? CompletedMatch<POSSIBLE_OUTS | ReturnType<GF>>
      : IncompleteMatch<Exclude<IN, NT>, POSSIBLE_OUTS | ReturnType<GF>>
    : never;
}

type CompletedMatch<R> = [R];

export const match = <IN>(input: IN): IncompleteMatch<IN, never> => {
  return new Match(input);
};

class Match<IN, OUT> implements IncompleteMatch<IN, OUT> {
  constructor(private readonly value: IN) {}

  ifIt<
    T extends IN,
    TG extends TypeGuard<IN, T>,
    GF extends GuardedFunction<TG>
  >(typeGuard: TG, then: GF) {
    if (typeGuard(this.value)) {
      const result = Object.assign([then(this.value)], {
        ifIt: () => result,
      }) as any;
      return result;
    }

    return this;
  }
}
