import { Result } from "../result.ts";

export type IKeyValueDb = {
  set: (key: string, value: string) => Promise<Result<null, Error>>;
  get: (key: string) => Promise<Result<string | null, Error>>;
};
