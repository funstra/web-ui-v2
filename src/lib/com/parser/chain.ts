import type { COMmoduleStruct } from '$lib/com/definition/module'
import { parseModuleString } from "./module"
import type { COMperiphial } from "$lib/com/definition/config"
import { COMChain } from '$lib/com/definition/chain'

export interface COMchainStruct {
    index: number
    input: {
        cv: COMperiphial
        gt: COMperiphial
    }
    modules: COMmoduleStruct[]
}
export const parseChainString = (s: string, index: number = 0): COMchainStruct => {
    const [inputs_string, modules_string] = s.split('>')
    const input_strings = inputs_string.split(',')
    const [cv, gt] = input_strings.map(s => s.slice(2).split(':').map(d => parseInt(d)))
    return {
        index,
        input: {
            cv: {
                pid: cv[0],
                ch: cv[1]
            },
            gt: {
                pid: gt[0],
                ch: gt[1]
            }
        },
        modules: modules_string !== '_' ? modules_string.split(',').map(parseModuleString) : [],
    }
}
