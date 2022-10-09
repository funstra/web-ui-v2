export interface COMparamStruct {
    name: string
    value: number
}

export interface COMmoduleStruct {
    name: string,
    params: COMparamStruct[]
}

export type module_types = 'pth' | 'lfo' | 'prob'

export const param_lookup: Record<module_types, COMparamStruct[]> = {
    pth: [],
    lfo: [
        {
            name: 'frequency',
            value: 30
        },
        {
            name: 'amplitude',
            value: 1
        }
    ],
    prob: [
        {
            name: 'chance',
            value: 0.5
        }
    ]
}




export const COMmodule = (name: module_types, paramInit?: number[]): COMmoduleStruct => {
    return {
        name,
        params: paramInit
            ? [...param_lookup[name]].map((p, i) => ({ ...p, value: paramInit[i] }))
            : [...param_lookup[name]]
    }
}
