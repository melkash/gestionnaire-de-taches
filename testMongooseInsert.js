import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement

console.log("🚀 Début du test d'insertion Mongoose");

async function testInsert() {
    console.log("📢 MONGO_URI utilisé :", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    const password = "testpassword";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("📢 Hash AVANT insertion :", hashedPassword);

    const result = await collection.insertOne({
        email: "test@debug.com",
        password: hashedPassword
    });

    const insertedUser = await collection.findOne({ _id: result.insertedId });
    console.log("📢 Hash APRÈS insertion :", insertedUser.password);

    mongoose.connection.close();
}

testInsert().catch(console.error);


  
