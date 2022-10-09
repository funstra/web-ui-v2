import type { COMchainStruct } from "$lib/com/definition/chain"
import type { COMmoduleStruct } from "$lib/com/definition/module"
import { writeChain } from "$lib/com/writer/chain"
import { parseConfString } from "$lib/com/parser/conf"
import { sendToIntercom } from "$lib/com/director/ws"
import { chains } from "$lib/store"
import type { COMparamStruct } from "../parser/param"
import { writeModule } from "../writer/module"


type msg_types = 'new chain' | 'new module'
interface msg_type_lookup {
    'new chain': COMchainStruct
    'new module': COMmoduleStruct
}
export const send = <T extends msg_types>(type: T, struct: msg_type_lookup[T]) => {
    console.log(`calling ${type} -> passing: ${type === 'new chain' ? writeChain(struct) : struct} to intercom`)
    sendToIntercom(writeChain(struct), 'conf -l')
}


export const recive = (data: string) => {
    const res = parseConfString(data)
    chains.set({
        c: res.chains,
        o: res.outs
    })
}

// export const sendInput = 

export const sendParam = (c, m, p, struct: COMparamStruct) => {
    // p -m chain:module -v param:value
    console.log(`sending: p -m ${c}:${m} -v ${p}:${struct.value} to InterCom`)
    sendToIntercom(`${c}:${m} -v ${p}:${struct.value}`, 'p -m ')
    console.log(`sending: c -m ${c} to InterCom`)
    sendToIntercom(`${c}`, 'c -m ')
}

export const sendNewModule = (c, struct: COMmoduleStruct) => {
    const moduleString = writeModule(struct)
    console.log(`sending m -c ${c} -a ${moduleString} to InterCom`)
    sendToIntercom(`${c} -a ${moduleString}`, `m -c `)
    // chains.
}
// export const sendNewModule = (c, moduleType: module_types) => {
//     const newModule = COMmodule(moduleType)
//     const moduleString = writeModule(newModule)
//     console.log(`sending m -c ${c} -a ${moduleString} to InterCom`)
//     sendToIntercom(`${c} -a ${moduleString}`, `m -c `)
//     // chains.
// }