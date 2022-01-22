interface Function<IN, OUT> {
  (input: IN): OUT;
}

interface Chain<IN, OUT> {
  (input: IN): OUT | Error;
  andThen<NEW_OUT>(nextFunction: Function<OUT, NEW_OUT>): Chain<IN, NEW_OUT>;
}

export function startsWith<IN, OUT>(
  initialFunction: Function<IN, OUT>
): Chain<IN, OUT> {
  const chainedFunctions = [initialFunction];

  const apply = (input: IN) =>
    chainedFunctions.reduce((previousOutput, currentFunction) => {
      if (previousOutput instanceof Error) {
        return previousOutput;
      }

      try {
        return currentFunction(previousOutput);
      } catch (error) {
        return wrappedIfNeeded(error);
      }
    }, input as any);

  const andThen = (nextFunction: Function<any, any>) => {
    chainedFunctions.push(nextFunction);
    return Object.assign(apply, { andThen }) as Chain<IN, OUT>;
  };

  return Object.assign(apply, { andThen }) as Chain<IN, OUT>;
}

export const startWith = startsWith;
export const is = <IN, OUT>(aFunction: Function<IN, OUT>) => aFunction;
export const are = is;

const wrappedIfNeeded = (maybeError: any) =>
  maybeError instanceof Error
    ? maybeError
    : typeof maybeError === "object"
    ? new Error(JSON.stringify(maybeError))
    : new Error(String(maybeError));
