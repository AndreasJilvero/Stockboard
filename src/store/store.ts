import Cookies from "js-cookie";
import { Layout } from "react-grid-layout";

const KEY = "Layout"

type StoredLayout = Pick<Layout, "i" | "x" | "y" | "w" | "h">

export const getLayoutStore = (): Layout[] | null => {
    const value = Cookies.get(KEY)
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

export const setLayoutStore = (layout: Layout[]) => {
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

    Cookies.set(KEY, JSON.stringify(values))
}
