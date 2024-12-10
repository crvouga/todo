export type Result<TOk, TErr> = Ok<TOk> | Err<TErr>;

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
