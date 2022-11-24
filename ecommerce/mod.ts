
import { lesan, MongoClient, string, number, InRelation, OutRelation, object, ActFn, optional } from "https://deno.land/x/lesan@v0.0.66/mod.ts";

const ecommerceApp = lesan();
const client = new MongoClient();
await client.connect("mongodb://localhost:27017/arc");
const db = client.database("ecommerce");

ecommerceApp.odm.setDb(db);

const warePure = {
    name: string(),
    brand: optional(string()),
    price: number(),
};

const wareTypePure = {
    name: string(),
    description: string(),
};

const wareInRel: Record<string, Inrelation> = {
    wareType: {
        schemaName: "wareType",
        type: "one",
    }
};

const wareOutRel = {};

wareTypeInRel: Record<string, Inrelation> = {};

wareTypeOutRel: Record<string, Inrelation> = {
    wares: {
        schemaName: "ware",
        number: 50,
        sort: { field: "_id", order: "desc" },
    }
};

const wares = ecommerceApp.odm.setModel("ware", warePure, wareInRel, wareOutRel);
const wareTypes = ecommerceApp.odm.setModel("wareType", wareTypePure, wareTypeInRel, wareTypeOutRel);


const addwareValidator = () => {
    return object({
        set: object(warePure),
        get: ecommerceApp.schema.selectStruct<wareInp>("ware", { wareType: 1 })
    })
}

const addware: ActFn = async (body) => {
    // const acts = ecommerceApp.acts.getActsWithServices();
    // console.log("in addware function");
    const createdware = await wares.insertOne(body.details.set);
    return await wares.findOne({ _id: createdware }, body.details.get);//??
}
ecommerceApp.acts.setAct({
    type: "dynamic", // ??
    schema: "ware",
    actName: "addware",
    validator: addwareValidator,
    fn: addware
});

export const ecommerceActs = ecommerceApp.acts.getMainActs();
ecommerceApp.runServer({ port: 8585, typeGeneration: true, 
playground: false }); // ??