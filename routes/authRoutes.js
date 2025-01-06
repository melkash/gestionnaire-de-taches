import express from 'express';
import passport from 'passport';
import User from '../model/userModel.js';


const router = express.Router()

router.post('/register', async (req, res) => {
 const { email, password } = req.body;
 try {

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis' });
    }

   const hashedPassowrd = await bcrypt.hash(password, 10)

   const newUser = new User ({ email, password: hashedPassowrd });
   await newUser.save();
   
   res.redirect('/auth/login')
} catch(error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error })
}
}); 

router.get('/login', (req, res) => {
    res.render('login', { error: req.flash('error') }); // Rends le formulaire de connexion avec les éventuels messages d'erreur
});


// connexion 
router.post('/login', (req, res, next) => {
    console.log('Requête POST reçue sur /auth/login avec les données suivantes:', req.body);

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Erreur Passport détectée:', err);
            return next(err);
        }
        if (!user) {
            console.log('Echec de la connexion: utilisateur non trouvé ou mot de passe incorrect:', info);
            req.flash('error', 'Email ou mot de passe incorrect'); // Message d'erreur pour l'utilisateur
            return res.redirect('/auth/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Erreur lors de la connexion de l\'utilisateur après validation:', err);
                return next(err);
            }
            console.log('Connexion réussie pour l\'utilisateur:', user.email);
            return res.redirect('/tasks');
        });
    })(req, res, next);
})



// deconnexion
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la déconnexion', error: err });
        }
        res.redirect('/auth/login');
    });
});


export default router;
