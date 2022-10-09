import type { COMchainStruct } from "../definition/chain";
import { writeModule } from "./module";

const p = (ch, pid) => {
    if (ch && pid) {
        return `${ch}:${pid}`
    }
    return '_'
}

export const writeChain = (struct: COMchainStruct): string => {
    return `cv${p(struct?.input?.cv)},gt${p(struct?.input?.gt)}>${struct?.modules?.map(writeModule) ?? '_'}`
}