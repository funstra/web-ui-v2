import type { COMmoduleStruct } from "$lib/com/definition/module";

export const writeModule = (struct: COMmoduleStruct): string => {
    return `${struct.name}${struct?.params.map(p => p.value).join(':')}`
}