import bcrypt from 'bcryptjs';


const password = "motdepasse123"; // Mot de passe en clair

bcrypt.hash(password, 10, (err, newHash) => {
    if (err) {
        console.error("Erreur bcrypt.hash :", err);
    } else {
        console.log("📢 Nouveau hash généré :", newHash);

bcrypt.compare(password, newHash, (err, isMatch) => {
    if (err) {
        console.error("Erreur bcrypt.compare :", err);
    } else {
        console.log("Résultat bcrypt.compare :", isMatch ? "✅ Mot de passe correct" : "❌ Mot de passe incorrect");
    }
});
}
});