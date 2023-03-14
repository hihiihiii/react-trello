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

const localStorageDarkModeEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue: boolean) => {
      localStorage.setItem("darkMode", JSON.stringify(newValue));
    });
  };

export const todoState = atom<ITodoState>({
  key: "todo",
  default: {
    "할 일": [
      { id: Date.now(), text: "반갑습니다." },
      { id: Date.now() + 1, text: "안녕하세요" },
    ],
    안녕하세요: [],
  },
  effects: [localStorageEffect("trello")],
});

export const boardState = atom<string[]>({
  key: "boards",
  default: ["To Do", "Doing", "Done"],
});

export const trashState = atom<boolean>({
  key: "trash",
  default: false,
});

export const darkModeState = atom<boolean>({
  key: "darkmode",
  default: false,
  effects: [localStorageDarkModeEffect("darkMode")],
});
