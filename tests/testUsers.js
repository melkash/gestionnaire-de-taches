import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../model/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

async function testUserCreationAndLogin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connecté à MongoDB");

        const email = "testuser@example.com";
        const password = "TestPassword123";

        // Suppression de l'utilisateur s'il existe déjà
        await User.deleteOne({ email });

        // Création d'un nouvel utilisateur
        const newUser = new User({ email, password });
        await newUser.save();
        console.log("🎉 Utilisateur créé avec succès !");

        // Récupération de l'utilisateur et test du mot de passe
        const foundUser = await User.findOne({ email });
        const isMatch = await bcrypt.compare(password, foundUser.password);

        console.log(isMatch ? "✅ Connexion réussie avec le mot de passe correct !" : "❌ ERREUR : Le mot de passe ne correspond pas !");
        
        // Nettoyage (on supprime l'utilisateur après le test)
        await User.deleteOne({ email });
        console.log("🧹 Utilisateur de test supprimé !");
        
        mongoose.disconnect();
    } catch (error) {
        console.error("❌ Erreur dans le test :", error);
    }
}

testUserCreationAndLogin();
