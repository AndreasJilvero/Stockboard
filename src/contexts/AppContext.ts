import { createContext } from "react";

type AppState = {
  editing: boolean
}

export const AppContext = createContext<AppState>({
  editing: false
})