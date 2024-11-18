import { Layout } from "react-grid-layout";
import { v4 as uuidv4 } from 'uuid'

const KEY = "Layout"

type StoredLayout = Pick<Layout, "i" | "x" | "y" | "w" | "h">

const createKey = (board: string) => `${KEY}-${board}`

export  const DEFAULT_LAYOUT: Layout[] = [
    { i: "top", x: 0, y: 0, w: 12, h: 1 },
    { i: "a", x: 0, y: 1, w: 6, h: 10 },
    { i: "b", x: 6, y: 1, w: 4, h: 10 },
    { i: "eurusd", x: 10, y: 1, w: 2, h: 2 },
    { i: "inve", x: 10, y: 1, w: 2, h: 2 },
    { i: "e", x: 10, y: 2, w: 2, h: 3 },
    { i: uuidv4(), x: 10, y: 2, w: 1, h: 1 },
  ]

export const getLayout = (board: string): Layout[] | null => {
    const value = globalThis.localStorage.getItem(createKey(board))
    const values = value ? JSON.parse(value) : null

    if (values) {
        const mappedValues = values.map((x: StoredLayout) => {
            const value: Layout = {
                i: x.i,
                x: x.x,
                y: x.y,
                w: x.w,
                h: x.h
            }

            return value
        })

        return mappedValues
    }

    return null
}

export const saveLayout = (board: string, layout: Layout[]) => {
    const values = layout.map(x => {
        const value: StoredLayout = {
            i: x.i,
            x: x.x,
            y: x.y,
            w: x.w,
            h: x.h
        }

        return value
    })

    globalThis.localStorage.setItem(createKey(board), JSON.stringify(values))
}
