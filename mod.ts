import { lesan, MongoClient } from "https://deno.land/x/lesan@v0.0.66/mod.ts";
const coreApp=lesan();
const client=new MongoClient();
await client.connect("mongodb://localhost:27017/arc");
const db=client.database("core");
coreApp.odm.setDb(db);
