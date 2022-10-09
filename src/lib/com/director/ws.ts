import { writable } from "svelte/store"
import { recive } from "."
import { get } from "svelte/store"

const wsScope = (url: string, port: number) => {
    const ws = new WebSocket(`ws://${url}:${port}`)
    ws.onopen = e => {
        console.log(`WebSocket open at: ${url}:${port}`)
        console.log('Sending conf -p to InterCom')

        ws.send('conf -p')
    }
    ws.onmessage = e => {
        recive(e.data)
    }
    return ws
}

const createWebSocketStore = () => {
    const { subscribe, set } = writable<{ ws: WebSocket, connected: boolean }>()
    let ws: WebSocket
    return {
        subscribe,
        connect: (url: string, port: number) => {
            ws = wsScope(url, port)
            if (ws) {
                set({ ws: ws, connected: true })
            }
        },
        disconnect: () => {
            if (ws) {
                console.log('Closing WebSocket')
                ws.close()
                set({ ws: null, connected: false })
            }
        }
    }
}
export const ws = createWebSocketStore()

export const sendToIntercom = (msg: string, command: string) => {
    const _ws = get(ws)
    if (_ws.connected) {
        _ws.ws.send(`${command} ${msg}`)
    }
}