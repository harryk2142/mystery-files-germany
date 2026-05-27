import { atom } from "nanostores";

const likeCountStore = atom(0);
const commentCountStore = atom<number>(0);

export { commentCountStore, likeCountStore };
