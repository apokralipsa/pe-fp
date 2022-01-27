interface Function<PARAMETERS extends Array<unknown>, OUTPUT> {
  (...parameters: PARAMETERS): OUTPUT;
}

interface ComposedFunction<PARAMETERS extends Array<unknown>, OUTPUT>
  extends Function<PARAMETERS, OUTPUT> {
  andThen<NEW_OUTPUT>(
    nextFunction: Function<[OUTPUT], NEW_OUTPUT>
  ): ComposedFunction<PARAMETERS, NEW_OUTPUT>;
}

export function compose<F extends Function<any, any>>(
  aFunction: F,
  argumentsDescription?: string
): ComposedFunction<Parameters<F>, ReturnType<F>> {
  const label = argumentsDescription
    ? `a composed function operating on ${argumentsDescription}`
    : undefined;

  const functions: Function<any, any>[] = [aFunction];

  const apply = (...input: Parameters<F>) =>
    functions.reduce((previousOutput, currentFunction) => {
      if (previousOutput[0] instanceof Error) {
        return previousOutput;
      }

      try {
        return [currentFunction.apply(undefined, previousOutput)];
      } catch (error) {
        return [correctlyTyped(error)];
      }
    }, input as Array<any>)[0];

  const andThen = <NEW_OUT>(nextFunction: Function<[ReturnType<F>], NEW_OUT>) => {
    functions.push(nextFunction);
    return Object.assign(apply, { andThen, label });
  };

  return Object.assign(apply, { andThen, label });
}

export const first = compose;
export const startWith = compose;
export const startsWith = compose;
export const is = <IN, OUT>(aFunction: Function<[IN], OUT>) => aFunction;
export const are = is;

const correctlyTyped = (maybeError: any) =>
  maybeError instanceof Error
    ? maybeError
    : typeof maybeError === "object"
    ? new Error(JSON.stringify(maybeError))
    : new Error(String(maybeError));
