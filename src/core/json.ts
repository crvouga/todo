import { Err, Ok, Result } from "./result.ts";

export const safeJsonParse = (json: string): Result<unknown, Error> => {
  try {
    const parsed: unknown = JSON.parse(json);
    return Ok(parsed);
  } catch (e) {
    if (e instanceof Error) {
      return Err(e);
    }

    return Err(new Error("Unknown error"));
  }
};
