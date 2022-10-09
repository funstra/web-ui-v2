import { writable } from "svelte/store";
import type { COMchainStruct } from '$lib/com/definition/chain'
import { send, sendNewModule } from "$lib/com/director";
import type { COMmoduleStruct } from "./com/definition/module";
import type { COMoutStruct } from "$lib/com/definition/out";



const createChainStore = (init?: { c: COMchainStruct[], o: COMoutStruct[] }) => {
    const state = writable<COMchainStruct[]>(init);
    return {
        ...state,
        addChain: (chain: COMchainStruct, external = false) => {
            if (!external) {
                send("new chain", chain);
            }
            state.update(v => [...v, chain]);
        },
        addModule: (module: COMmoduleStruct, cIdx: number, external = false) => {
            if (!external) {
                sendNewModule(cIdx, module)
            }
            state.update(v => v.map(chain => chain.index === cIdx ? ({
                ...chain,
                modules: [...chain.modules, module]
            }) : chain))
        }
    };
};


export const chains = createChainStore([]);