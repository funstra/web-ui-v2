import { derived, writable } from "svelte/store";
import type { COMchainStruct } from '$lib/com/definition/chain'
import { send, sendNewModule } from "$lib/com/director";
import type { COMmoduleStruct } from "./com/definition/module";
import type { COMoutStruct } from "$lib/com/definition/out";



const createChainStore = (init?: { c?: COMchainStruct[], o?: COMoutStruct[] }) => {
    const state = writable<{ c?: COMchainStruct[], o?: COMoutStruct[] }>(init);
    return {
        ...state,
        addChain: (chain: COMchainStruct, external = false) => {
            if (!external) {
                send("new chain", chain);
            }
            state.update(v => ({ c: [...v.c, chain], o: v.o }));
        },
        addModule: (module: COMmoduleStruct, cIdx: number, external = false) => {
            if (!external) {
                sendNewModule(cIdx, module)
            }
            state.update(v => ({
                c: v.c.map(chain => chain.index === cIdx ? ({
                    ...chain,
                    modules: [...chain.modules, module]
                }) : chain),
                o: v.o
            }))
        }
    };
};


const createRelation = () => {
    const state = writable(new Map())
    return {
        // subscribe: state.subscribe
        ...state
    }
}

export const relation = createRelation()



export const chains = createChainStore();
derived([chains, relation], ([_chains, _relation]) => {
    _chains.c.map((chain, cIdx) => {
        chain.modules.map((module, mIdx) => {
            _chains.o.filter(out => (out.source.cv.chain === cIdx && out.source.cv.module) || out.source.gt.chain && out.source.gt.module)
        })
    })
})