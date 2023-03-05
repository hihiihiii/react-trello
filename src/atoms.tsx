import { atom, selector } from "recoil";

export const minutesState = atom({
  key: "minutes",
  default: 0,
});

export const hoursSelector = selector({
  key: "hours",
  get: ({ get }) => {
    const minutes = get(minutesState);
    return minutes / 60;
  },
  //input의 변화를 느끼고 싶을뿐.
  //   set: ({ set }, newValue) => {
  //     const minutes = Number(newValue) * 60;
  //     //fist argument : atom, second argument : minutes;
  //     set(minutesState, minutes);
  //   },
  set: ({ set }, newValue) => {
    const minutes = Number(newValue) * 60;
    set(minutesState, minutes);
  },
});
