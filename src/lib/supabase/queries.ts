import { createClient } from "./client"

const sb = createClient()

export function db() {
  return sb
}
