interface SingleArgumentFunction<IN, OUT> {
  (input: IN): OUT;
}

interface ComposedFunction<IN extends Array<any>, OUT> {
  (...input: IN): OUT | Error;
  andThen<NEW_OUT>(
    nextFunction: SingleArgumentFunction<OUT, NEW_OUT>
  ): ComposedFunction<IN, NEW_OUT>;
}

export function compose<F extends (...args: any) => any>(
  firstFunction: F,
  argumentsDescription?: string
): ComposedFunction<Parameters<F>, ReturnType<F>> {
  const label = argumentsDescription
    ? `a composed function operating on ${argumentsDescription}`
    : undefined;

  const functions: Function[] = [firstFunction];

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

  const andThen = <NEW_OUT>(
    nextFunction: SingleArgumentFunction<ReturnType<F>, NEW_OUT>
  ) => {
    functions.push(nextFunction);
    return Object.assign(apply, { andThen, label });
  };

  return Object.assign(apply, { andThen, label });
}

export const first = compose;
export const startWith = compose;
export const startsWith = compose;
export const is = <IN, OUT>(aFunction: SingleArgumentFunction<IN, OUT>) =>
  aFunction;
export const are = is;

const correctlyTyped = (maybeError: any) =>
  maybeError instanceof Error
    ? maybeError
    : typeof maybeError === "object"
    ? new Error(JSON.stringify(maybeError))
    : new Error(String(maybeError));
