import type { COMperiphial } from './config'
import type { COMmoduleStruct, module_types } from './module'
import { COMmodule } from './module'

export interface COMchainStruct {
    index: number
    input?: {
        cv?: COMperiphial
        gt?: COMperiphial
    }
    modules?: COMmoduleStruct[]
}


const periphial = ([ch, pid]): COMperiphial => ({ ch, pid });
const _input = ([cv, gt]): COMchainStruct["input"] => {
    const o = {}
    if (cv) {
        o['cv'] = periphial(cv)
    }
    if (gt) {
        o['gt'] = periphial(gt)
    }
    return o
}

interface _i {
    index: number,
    input?: [
        [number?, number?]?,
        [number?, number?]?
    ],
    modules?: module_types[]
}

export const COMChain = ({ index, input, modules }: _i): COMchainStruct => {
    const o = { index } as COMchainStruct
    if (input) {
        o['input'] = _input(input)
    }
    if (modules) {
        o['modules'] = modules.map(t => COMmodule(t))
    }
    return o
}