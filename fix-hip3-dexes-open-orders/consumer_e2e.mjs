// Consumer-side check: imports the installed opentool package through its public
// export and calls both across-dex open-order helpers on mainnet (read-only).
// Usage: node consumer_e2e.mjs <label> <pause-ms-between-users> <address> [<address> ...]
import { readFileSync } from "node:fs";
import {
  fetchHyperliquidFrontendOpenOrdersAcrossDexes,
  fetchHyperliquidOpenOrdersAcrossDexes,
  getKnownHyperliquidDexes,
} from "opentool/adapters/hyperliquid";

const [label, pauseMs, ...users] = process.argv.slice(2);
const pkg = JSON.parse(
  readFileSync(new URL("./node_modules/opentool/package.json", import.meta.url), "utf8"),
);

const summarize = (orders) => {
  const byDex = {};
  for (const order of orders) {
    const key = order.dex ?? "primary";
    byDex[key] = (byDex[key] ?? 0) + 1;
  }
  return byDex;
};

console.log(`# ${label}: opentool ${pkg.version} via "opentool/adapters/hyperliquid"`);
console.log(`# ${new Date().toISOString()}`);
console.log(`getKnownHyperliquidDexes("mainnet") = ${JSON.stringify(getKnownHyperliquidDexes("mainnet"))}`);

const cases = [
  ["fetchHyperliquidOpenOrdersAcrossDexes", fetchHyperliquidOpenOrdersAcrossDexes, {}],
  ["fetchHyperliquidOpenOrdersAcrossDexes", fetchHyperliquidOpenOrdersAcrossDexes, { dexes: ["para"] }],
  ["fetchHyperliquidFrontendOpenOrdersAcrossDexes", fetchHyperliquidFrontendOpenOrdersAcrossDexes, {}],
  [
    "fetchHyperliquidFrontendOpenOrdersAcrossDexes",
    fetchHyperliquidFrontendOpenOrdersAcrossDexes,
    { dexes: ["para"] },
  ],
];

for (const [index, user] of users.entries()) {
  if (index > 0) await new Promise((resolve) => setTimeout(resolve, Number(pauseMs)));
  console.log(`\nuser ${user}`);
  for (const [name, fn, extra] of cases) {
    const orders = await fn({ environment: "mainnet", user, ...extra });
    const para = orders.filter((order) => String(order.coin).startsWith("para:"));
    const args = extra.dexes ? `{ dexes: ${JSON.stringify(extra.dexes)} }` : "{}";
    console.log(
      `  ${name}(${args})`.padEnd(70) +
        ` orders=${String(orders.length).padStart(4)} para=${String(para.length).padStart(4)} ${JSON.stringify(summarize(orders))}`,
    );
  }
}
