const [key] = Deno.args;

import nodeIDS from "./servers.ts";

const nodeID = nodeIDS[Math.floor(Math.random() * nodeIDS.length)];
const response = await fetch(`http://localhost:${nodeID}${key}`);
console.log(await response.text());
