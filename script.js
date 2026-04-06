import 'dotenv/config';
import { MongoClient } from 'mongodb';

async function main() {
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('logs');

        const pipeline = [
            {
                '$group': {
                    '_id': '$status',
                    'totalWeight': { '$sum': '$weight' },
                    'count': { '$sum': 1 }
                }
            },
            { '$sort': { '_id': 1 } }
        ];

        const result = await collection.aggregate(pipeline).toArray();

        console.log("--- ИТОГИ ПО SPIRAL FACTORY ---");
        console.table(result);

    } catch (e) {
        console.error("Ошибка:", e);
    } finally {
        await client.close();
    }
}

main();


