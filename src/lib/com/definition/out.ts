import type { COMperiphial } from "./config"

export interface COMoutStruct {
    destination: COMperiphial
    source: {
        cv: {
            chain: number
            module: number
        }
        gt: {
            chain: number
            module: number
        }
    }
}