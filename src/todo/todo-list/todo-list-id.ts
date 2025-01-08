import { Brand } from "../../core/brand.ts";

export type TodoListId = Brand<string, "TodoListId">;

const encode = (id: TodoListId): string => {
  return id;
};

const decode = (id: unknown): TodoListId | null => {
  if (typeof id === "string") {
    if (id.trim().length === 0) {
      return null;
    }
    return id as TodoListId;
  }
  return null;
};

const generate = (): TodoListId => {
  const id = Math.random().toString(36).slice(2);
  return id as TodoListId;
};

const is = (id: unknown): id is TodoListId => {
  return decode(id) !== null;
};

export const TodoListId = {
  encode,
  decode,
  generate,
  is,
};
