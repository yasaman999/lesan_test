import { lesan, MongoClient, string, number, InRelation, OutRelation, object, ActFn, optional } from "https://deno.land/x/lesan@v0.0.66/mod.ts";
import ecommerceActs from "../ecommerce/mod.ts"
const coreApp = lesan();
const client = new MongoClient();
await client.connect("mongodb://localhost:27017/arc");
const db = client.database("core");
coreApp.odm.setDb(db);

const userPure = {
    name: string(),
    address: optional(string()),
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

const userOutRel = {};

countryInRel: Record<string, Inrelation> = {};

countryOutRel: Record<string, Inrelation> = {
    users: {
        schemaName: "user",
        number: 50,
        sort: { field: "_id", order: "desc" },
    }
};

const users = coreApp.odm.setModel("user", userPure, userInRel, userOutRel);
const countries = coreApp.odm.setModel("country", countryPure, countryInRel, countryOutRel);


const addUserValidator = () => {
    return object({
        set: object(userPure),
        get: coreApp.schema.selectStruct<userInp>("user", { country: 1 })
    })
}

const addUser: ActFn = async (body) => {
    // const acts = coreApp.acts.getActsWithServices();
    // console.log("in addUser function");
    const createdUser = await users.insertOne(body.details.set);
    return await users.findOne({ _id: createdUser }, body.details.get);//??
}
coreApp.acts.setAct({
    type: "dynamic", // ??
    schema: "user",
    actName: "addUser",
    validator: addUserValidator,
    fn: addUser
});

// coreApp.acts.setService("ecommerce", "http://localhost:8585/lesan");

coreApp.acts.setService("ecommerce", ecommerceActs);

coreApp.runServer({ port: 8080, typeGeneration: true, playground: false }); // ??