import type { COMperiphial } from "$lib/com/definition/config"

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

export const parseOutString = (s: string): COMoutStruct => {
    const [pid, ch, ...src] = s.slice(3).split(':').map(v => parseInt(v))
    return {
        destination: {
            pid,
            ch
        },
        source: {
            cv: {
                chain: src[0],
                module: src[1]
            },
            gt: {
                chain: src[2],
                module: src[3]
            }
        }
    }
}