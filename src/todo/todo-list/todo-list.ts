export type TodoList = {
  id: string;
  name: string;
};

const encode = (todoList: TodoList): string => {
  return JSON.stringify(todoList);
};

const decode = (todoList: string): TodoList | null => {
  try {
    return JSON.parse(todoList);
  } catch {
    return null;
  }
};

export const TodoList = {
  encode,
  decode,
};
