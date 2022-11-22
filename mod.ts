import { lesan, MongoClient, string, number } from "https://deno.land/x/lesan@v0.0.66/mod.ts";
const coreApp = lesan();
const client = new MongoClient();
await client.connect("mongodb://localhost:27017/arc");
const db = client.database("core");
coreApp.odm.setDb(db);

const userPure = {
    name: string(),
    address: string(),
    age: number(),
};

const countryPure = {
    name: string(),
    description: string(),
};

const userInRel: Record<string, Inrelation> = {
    country: {
        schemaName: "country",
        type: "one",
    }
};

const useOutRel = {};

countryInRel: Record<string, Inrelation> = {};

countryOutRel: Record<string, Inrelation> = {
    users: {
        schemaName: "user",
        number: 50,
        sort: { field: "_id", order: "desc" },
    }
};