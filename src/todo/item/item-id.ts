import { Brand } from "../../core/brand.ts";

export type TodoItemId = Brand<string, "TodoItemId">;

const encode = (id: TodoItemId): string => {
  return id;
};

const decode = (id: unknown): TodoItemId | null => {
  if (typeof id === "string") {
    if (id.trim().length === 0) {
      return null;
    }
    return id as TodoItemId;
  }
  return null;
};

const generate = (): TodoItemId => {
  const id = Math.random().toString(36).slice(2);
  return id as TodoItemId;
};

const is = (id: unknown): id is TodoItemId => {
  return decode(id) !== null;
};

export const TodoItemId = {
  encode,
  decode,
  generate,
  is,
};
