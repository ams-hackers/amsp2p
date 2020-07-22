import { serve } from "https://deno.land/std/http/server.ts";

import nodeIDS from "./servers.ts";

type Database = Map<string, string>;

function getOwnerForKey(key: string) {
  return nodeIDS[key.length % nodeIDS.length];
}

async function startServer(port: number) {
  const server = serve({ port });
  const nodeId = port;

  console.log(`http://localhost:${port}/`);

  let db: Database = new Map();

  const decoder = new TextDecoder("utf-8");

  async function store(key: string, value: string) {
    const ownerID = getOwnerForKey(key);
    if (nodeId === ownerID) {
      return db.set(key, value);
    } else {
      const response = await fetch(`http://localhost:${ownerID}${key}`, {
        method: "POST",
        body: value,
      });
      return await response.text();
    }
  }

  async function lookup(key: string): Promise<string> {
    const ownerID = getOwnerForKey(key);
    if (nodeId === ownerID) {
      return db.get(key) || "";
    } else {
      const response = await fetch(`http://localhost:${ownerID}${key}`);
      return await response.text();
    }
  }

  for await (const req of server) {
    const key = req.url;

    switch (req.method) {
      case "POST": {
        const body = decoder.decode(await Deno.readAll(req.body));
        await store(key, body);
        console.log("store", { nodeId, db });
        req.respond({ body: "ok" });
        break;
      }
      case "GET": {
        console.log("query", { nodeId, key });
        const value = await lookup(key);
        req.respond({ body: value });
        break;
      }
    }
  }
}

nodeIDS.forEach(startServer);
