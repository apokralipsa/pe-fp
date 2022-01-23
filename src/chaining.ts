interface SingleArgumentFunction<IN, OUT> {
  (input: IN): OUT;
}

interface Chain<IN extends Array<any>, OUT> {
  (...input: IN): OUT | Error;
  andThen<NEW_OUT>(
    nextFunction: SingleArgumentFunction<OUT, NEW_OUT>
  ): Chain<IN, NEW_OUT>;
}

export function first<F extends (...args: any) => any>(
  initialFunction: F
): Chain<Parameters<F>, ReturnType<F>> {
  const chainedFunctions: Function[] = [initialFunction];

  const apply = (...input: Parameters<F>) =>
    chainedFunctions.reduce((previousOutput, currentFunction) => {
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
    chainedFunctions.push(nextFunction);
    return Object.assign(apply, { andThen });
  };

  return Object.assign(apply, { andThen });
}

export const startWith = first;
export const startsWith = first;
export const is = <IN, OUT>(aFunction: SingleArgumentFunction<IN, OUT>) =>
  aFunction;
export const are = is;

const correctlyTyped = (maybeError: any) =>
  maybeError instanceof Error
    ? maybeError
    : typeof maybeError === "object"
    ? new Error(JSON.stringify(maybeError))
    : new Error(String(maybeError));
