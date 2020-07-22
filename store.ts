const [key, value] = Deno.args;

import nodeIDS from "./servers.ts";

const nodeID = nodeIDS[Math.floor(Math.random() * nodeIDS.length)];
const response = await fetch(`http://localhost:${nodeID}${key}`, {
  method: "POST",
  body: value,
});
console.log(await response.text());
