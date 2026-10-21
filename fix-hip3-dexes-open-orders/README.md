# Evidence for fix/hip3-dexes-open-orders

Read-only mainnet checks for the across-dex open-order helpers. No orders were placed.

| File | What it is |
|---|---|
| `consumer_e2e.mjs` | Imports `opentool/adapters/hyperliquid` from an installed package and calls both across-dex helpers, with and without `dexes: ["para"]`. |
| `e2e-master.png`, `e2e-branch.png` | One wallet, run back to back on `master` and the PR head; output rendered with [freeze](https://github.com/charmbracelet/freeze). |
| `e2e-master.txt` | Output with `npm pack` of `master` (`e6dcdc1`) installed. |
| `e2e-branch.txt` | Output with `npm pack` of the PR head (`27a43ef`) installed. |
| `test-branch.txt` | `npm test` on a fresh clone of the PR head. |
| `test-old-list.txt` | `tests/hyperliquid-utils.test.ts` from the PR head, run with `master`'s `info.ts`. |

Wallet addresses are shortened in the outputs.

To rerun: in an empty directory, `npm install <path to opentool-0.21.0.tgz>`, copy `consumer_e2e.mjs` next to `package.json` (with `"type": "module"`), then:

```sh
node consumer_e2e.mjs <label> <pause-ms-between-users> <address> [<address> ...]
```

Any wallet with open orders on the `para` dex shows the difference. To find one, take a user from `recentTrades` for a `para:` coin and check `openOrders` with `dex: "para"`.
