import { BoardType } from "../types/board"

const KEY = "Boards"

export const getBoards = (): BoardType[] | null => {
  const val = globalThis.localStorage.getItem(KEY)

  return val ? JSON.parse(val) : null
}

export const saveBoards = (boards: BoardType[]) => {
  const val = JSON.stringify(boards)

  globalThis.localStorage.setItem(KEY, val)
}
