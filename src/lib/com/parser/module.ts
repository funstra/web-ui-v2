import { type COMmoduleStruct, COMmodule } from "$lib/com/definition/module"
import { INT } from "$lib/util/numbers"

export const parseModuleString = (s: string): COMmoduleStruct => {
    // split at none digits att start of string
    const [name, values] = s.split(/^([^\d]+)/).slice(1)
    return COMmodule(name, values.split(':').map(INT))
}