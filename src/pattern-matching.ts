type TypeGuard<IN extends any, T extends IN> = (input: IN) => input is T;
type GuardedFunction<TG> = TG extends TypeGuard<any, infer T> ? (value: T) => any : never;

interface IncompleteMatch<IN, POSSIBLE_OUTS> {
  ifIt<T extends IN, TG extends TypeGuard<IN, T>, GF extends GuardedFunction<TG>>(
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

  ifIt<T extends IN, TG extends TypeGuard<IN, T>, GF extends GuardedFunction<TG>>(
    typeGuard: TG,
    then: GF
  ) {
    if (typeGuard(this.value)) {
      const result = Object.assign([then(this.value)], {
        ifIt: () => result,
      }) as any;
      return result;
    }

    return this;
  }
}
