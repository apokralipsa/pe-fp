export const isAString = (value: any): value is string => typeof value === "string";
export const isANumber = (value: any): value is number => typeof value === "number";
export const isABigInt = (input: any): input is bigint => typeof input == "bigint";
export const isABoolean = (input: any): input is boolean => typeof input === "boolean";
export const isASymbol = (input: any): input is symbol => typeof input === "symbol";
export const isNull = (input: any): input is null => input === null;
export const isUndefined = (input: any): input is undefined => input === undefined;

type Class<T> = { new (...args: any): T };

export const isAnInstanceOf =
  <C extends Class<any>>(aClass: C) =>
  (input: any): input is InstanceType<C> =>
    input instanceof aClass;

export const isA = <T extends { kind?: string; type?: string }>() => ({
  ofKind:
    <K extends T["kind"]>(kind: K) =>
    (input: any): input is Extract<T, { kind: K }> =>
      input.kind === kind,
  ofType:
    <K extends T["type"]>(type: K) =>
    (input: any): input is Extract<T, { type: K }> =>
      input.type === type,
});
