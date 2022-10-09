
export interface COMparamStruct {
    name: string
    value: number
}

export type param_lookup = Record<string, string[]>

const MODULE_TYPE_LOOKUP: param_lookup = {
    pth: [],
    lfo: ['frequency', 'amplitude'],
    prob: ['chance'],
}

const _param = (lookup: param_lookup) => (name: string) => (value: string, i: number): COMparamStruct => ({
    name: lookup[name][i],
    value: parseInt(value)
})

export const param = _param(MODULE_TYPE_LOOKUP)