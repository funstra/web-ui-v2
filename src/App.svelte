<script lang="ts">
  import { COMChain } from "$lib/com/definition/chain";
  import { COMmodule, param_lookup } from "$lib/com/definition/module";
  import { sendParam } from "$lib/com/director";
  import { ws } from "$lib/com/director/ws";
  import { chains, mapping } from "$lib/store";

  const addChain = () => {
    const chain = COMChain({
      index: $chains.length,
    });
    chains.addChain(chain);
  };

  ws.connect("localhost", 9090);
  let wsState: "connected" | "disconnected";
  let _u, _p;
  $: {
    if ($ws.ws) {
      [_u, _p] = $ws.ws.url.split(":").slice(1);
      _u = _u.split("//")[1];
      _p = _p.slice(0, -1);
    } else {
      _u = "";
      _p = "";
    }
    wsState = $ws?.connected ? "connected" : "disconnected";
  }

  const handleWs = (e: SubmitEvent) => {
    if (e.submitter.value === "disconnect") {
      ws.disconnect();
    } else {
      const data = new FormData(e.target);
      const url = data.get("url") as string;
      const port = data.get("port");
      if (url && port) {
        ws.connect(url, +port);
      }
    }
  };

  const getRelation = (cIdx: number, mIdx: number) => {
    const _cv = $chains.o.find(
      o => o.source.cv.chain === cIdx && o.source.cv.module === mIdx
    );
    const _gt = $chains.o.find(
      o => o.source.gt.chain === cIdx && o.source.gt.module === mIdx
    );
    return {
      cv: _cv,
      gt: _gt,
    };
  };

  $: console.log("mapping: ", $mapping);
</script>

<main>
  <form class="websocket-form" on:submit|preventDefault={handleWs}>
    <fieldset>
      <div class="ws-status">
        <h5>Websocket</h5>
        <span data-state={wsState}>
          <span>&dashv;</span><span>&vdash;</span>
        </span>
      </div>
      <label>
        <span>url</span>
        <input type="text" name="url" value={_u} />
      </label>
      <br />
      <label>
        <span>port</span>
        <input type="text" name="port" value={_p} />
      </label>
      <div class="buttons">
        <input type="submit" value="connect" />
        <input type="submit" value="disconnect" />
      </div>
    </fieldset>
  </form>

  <button class="add-chain" on:click={addChain}>add chain</button>

  {#if $chains?.c}
    <ul class="chains">
      {#each $chains?.c as chain, cIdx (cIdx)}
        <li class="chain">
          <code class="index">
            index:
            <span>{chain.index}</span>
          </code>

          {#if chain.input}
            <hr />
            <ul class="input">
              <h4>Inputs</h4>
              {#each Object.keys(chain.input) as k}
                <li class={k}>
                  <h5>{k}</h5>
                  <ul>
                    <li>
                      ch:
                      <input type="number" bind:value={chain.input[k].ch} />
                    </li>
                    <li>
                      pid:
                      <input type="number" bind:value={chain.input[k].pid} />
                    </li>
                  </ul>
                </li>
              {/each}
            </ul>
          {/if}

          {#if chain.modules}
            <hr />
            <ul class="modules">
              <h4>Modules</h4>
              {#each chain.modules as module, mIdx (mIdx)}
                <!-- !!! -->

                <li>
                  <hr />
                  <h5>{module.name}</h5>

                  <ul class="params">
                    {#each module.params as param, pIdx (pIdx)}
                      <li on:input={e => sendParam(cIdx, mIdx, pIdx, param)}>
                        <span>{param.name}</span>
                        :
                        <input type="number" bind:value={param.value} />
                      </li>
                    {/each}
                  </ul>

                  {#if $mapping[cIdx][mIdx].length}
                    <h5>Outs</h5>
                    <ul class="out">
                      {#each $mapping[cIdx][mIdx] as out}
                        <li>
                          <span>ch: </span>
                          <span>{out.destination.ch}</span>
                          <span>pid: </span>
                          <span>{out.destination.pid}</span>
                        </li>
                      {/each}
                    </ul>
                  {/if}
                  <button on:click={e => chains.removeModule(cIdx, mIdx)}
                    >rem</button
                  >
                  <!-- !!! -->
                </li>
              {/each}
            </ul>
          {/if}

          <label>
            <span>add module</span>
            <select
              name="newModule"
              value=""
              on:input={({ target }) => {
                chains.addModule(COMmodule(target.value), cIdx);
                target.value = "";
              }}
            >
              {#each Object.keys(param_lookup) as typeKey, i (i)}
                <option value={typeKey}>
                  {typeKey}
                </option>
              {/each}
            </select>
          </label>
        </li>
      {/each}
    </ul>
  {/if}
</main>

<style>
  form {
    width: max-content;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  form :where(h4, h5) {
    margin: 0;
  }
  fieldset {
    padding: 8px;
    border-radius: 4px;
    display: flex;
    gap: 4px;
    align-items: center;
  }
  fieldset input[name="url"] {
    width: 16ch;
  }
  fieldset input[name="port"] {
    width: 7ch;
  }
  fieldset .buttons {
    margin-inline-start: 2ch;
  }

  .ws-status {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ws-status [data-state] {
    letter-spacing: 0.5ch;
    font-size: 1.25em;
    transition-property: color, letter-spacing;
    transition-duration: 500ms, 250ms;
    color: red;
    line-height: 0;
    font-family: monospace;
    font-weight: 1000;
  }
  .ws-status [data-state="connected"] {
    color: green;
    letter-spacing: 0ch;
  }

  main {
    grid-template-columns: min-content;
    grid-template-rows: min-content;
    display: grid;
    gap: 8px;
    border: 1px black solid;
    padding: 4px;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .websocket-form {
    grid-column: 1 / span 2;
  }
  .add-chain {
    grid-column: 1;
    grid-row: 2 / span 1;
    writing-mode: sideways-rl;
  }
  .chains {
    display: flex;
    gap: 8px;
    grid-column: 2 / span 2;
    grid-row: 2 / span 2;
    overflow: scroll;
    width: 100%;
  }
  .chain {
    padding: 8px;
    border: 1px black solid;
    border-radius: 4px;
    flex-shrink: 0;
    overflow-y: scroll;
  }

  .chain hr {
    margin-block: 1ch;
    border-style: dashed;
    color: currentColor;
  }

  .params li {
    white-space: nowrap;
  }
  .chain input {
    width: 6ch;
  }
  .modules > li {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px;
    border: 0.5px currentColor solid;
  }
  .modules li:hover {
    background-color: #f9f9f9;
  }
  .modules hr {
    border-style: solid;
    border-width: 1px;
    width: 10%;
    margin: 0;
  }
  .out {
    font-family: monospace;
  }
</style>
