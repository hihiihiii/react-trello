import { atom, selector } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

//string으로 이루어진 array를 가질거라고 선언.
interface ITodoState {
  [key: string]: ITodo[];
}

export const todoState = atom<ITodoState>({
  key: "todo",
  default: {
    "To Do": [{ id: Date.now(), text: "반갑습니다." }],
    Doing: [],
    Done: [],
  },
});
