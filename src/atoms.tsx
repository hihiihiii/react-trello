import { atom, selector } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

export interface IBoard {
  id: number;
  title: string;
  toDos: ITodo[];
}

interface ITodoState {
  [key: string]: ITodo[];
}

const instanceOfToDo = (object: unknown): object is ITodo => {
  return (
    object !== null &&
    object !== undefined &&
    object.constructor === Object &&
    typeof (object as { id: unknown; text: unknown }).id === "number" &&
    typeof (object as { id: unknown; text: unknown }).text === "string"
  );
};

const instanceOfBoard = (object: unknown): object is IBoard => {
  return (
    object !== null &&
    object !== undefined &&
    object.constructor === Object &&
    typeof (object as { id: unknown; title: unknown; toDos: unknown }).id ===
      "number" &&
    typeof (object as { id: unknown; title: unknown; toDos: unknown }).title ===
      "string" &&
    Array.isArray(
      (object as { id: unknown; title: unknown; toDos: unknown }).toDos
    ) &&
    (object as { id: unknown; title: unknown; toDos: unknown[] }).toDos.every(
      (toDo) => instanceOfToDo(toDo)
    )
  );
};

const instanceOfBoards = (object: unknown): object is IBoard[] => {
  return (
    Array.isArray(object) && object.every((board) => instanceOfBoard(board))
  );
};

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(key);

    if (savedValue !== null && savedValue !== undefined) {
      const json = (raw: string) => {
        try {
          return JSON.parse(raw);
        } catch (error) {
          return false;
        }
      };

      if (json(savedValue) && instanceOfBoards(json(savedValue))) {
        setSelf(json(savedValue));
      }
    }
    onSet((newValue: IBoard[]) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const todoState = atom<ITodoState>({
  key: "todo",
  default: {
    "To Do": [
      { id: Date.now(), text: "반갑습니다." },
      { id: Date.now() + 1, text: "안녕하세요" },
    ],
    Doing: [],
    Done: [],
  },
  effects: [localStorageEffect("trello")],
});
