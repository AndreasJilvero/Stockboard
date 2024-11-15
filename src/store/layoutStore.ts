import { Layout } from "react-grid-layout";

const KEY = "Layout"

type StoredLayout = Pick<Layout, "i" | "x" | "y" | "w" | "h">

export const getLayouts = (): Layout[] | null => {
    const value = global.localStorage.getItem(KEY)
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

export const setLayouts = (layout: Layout[]) => {
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

    global.localStorage.setItem(KEY, JSON.stringify(values))
}
