import { Layout } from "react-grid-layout"
import { Script } from "./script"

export type BoardType = {
  id: string
  name: string
  layout: Layout[]
  scripts: Script[]
}
