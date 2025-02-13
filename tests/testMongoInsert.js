const { MongoClient } = require('mongodb');
import bcrypt from 'bcryptjs';

async function testInsert() {
    const uri = process.env.MONGO_URI; // Assure-toi que la variable est bien définie
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const db = client.db('nom_de_ta_base'); // Remplace par le nom de ta base
        const collection = db.collection('users');

        const password = "testpassword";
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log("📢 Hash AVANT insertion:", hashedPassword);
        
        const result = await collection.insertOne({
            email: "test@debug.com",
            password: hashedPassword
        });

        const insertedUser = await collection.findOne({ _id: result.insertedId });
        console.log("📢 Hash APRÈS insertion :", insertedUser.password);

    } finally {
        await client.close();
    }
}

testInsert().catch(console.dir);
