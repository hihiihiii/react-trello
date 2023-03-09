import { atom, selector } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface ITodoState {
  [key: string]: ITodo[];
}

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue: ITodo[]) => {
      localStorage.setItem("trello", JSON.stringify(newValue));
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

export const trashState = atom<boolean>({
  key: "trash",
  default: false,
});
