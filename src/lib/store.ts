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
        },
        removeModule: (cIdx: number, mIdx: number) => {
            state.update(v => ({
                c: v.c.map(chain => {
                    if (chain.index === cIdx) {
                        return ({ ...chain, modules: chain.modules.filter((module, i) => i !== mIdx) })
                    }
                    return chain
                }),
                o: v.o
            }))
        }
    };
};


const createRelation = () => {
    const state = writable([])
    return {
        // subscribe: state.subscribe
        ...state
    }
}

export const relation = createRelation()


export const chains = createChainStore();
export const mapping = derived([chains], ([_chains]) => {
    if (_chains) {
        return _chains.c.map((chain, cIdx) => chain.modules.map((module, mIdx) => _chains.o.filter(out => (out.source.cv.chain === cIdx && out.source.cv.module === mIdx) || out.source.gt.chain === cIdx && out.source.gt.module === mIdx)))
    }
})