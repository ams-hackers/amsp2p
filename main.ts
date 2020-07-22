import { serve } from "https://deno.land/std/http/server.ts";

async function startServer(port: number) {
  const server = serve({ port });
  const nodeId = port;

  console.log(`http://localhost:${port}/`);

  let db: Map<string, string> = new Map();

  const decoder = new TextDecoder("utf-8");

  for await (const req of server) {
    const key = req.url;

    switch (req.method) {
      case "POST": {
        const body = decoder.decode(await Deno.readAll(req.body));
        db.set(key, body);
        console.log("store", { nodeId, db });
        req.respond({ body: "ok" });
        break;
      }
      case "GET": {
        console.log("query", { nodeId, key });
        req.respond({ body: db.get(key) });
        break;
      }
    }
  }
}

startServer(8001);
startServer(8002);
startServer(8003);
startServer(8004);
startServer(8005);
