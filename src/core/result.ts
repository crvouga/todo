export type Result<T, E> = Ok<T> | Err<E>;

export type Ok<T> = {
  t: "ok";
  v: T;
};

export type Err<T> = {
  t: "err";
  v: T;
};

export const Ok = <T>(v: T): Ok<T> => {
  return { t: "ok", v };
};

export const Err = <T>(v: T): Err<T> => {
  return { t: "err", v };
};

export const isErr = <T, E>(result: Result<T, E>): result is Err<E> => {
  return result.t === "err";
};

export const mapOk = <T, U, E>(
  result: Result<T, E>,
  f: (v: T) => U
): Result<U, E> => {
  return isErr(result) ? result : Ok(f(result.v));
};

export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  return isErr(result) ? defaultValue : result.v;
};

export const unwrapElse = <T, E>(result: Result<T, E>, f: (e: E) => T): T => {
  return isErr(result) ? f(result.v) : result.v;
};
