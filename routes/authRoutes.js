import express from 'express';
import passport from 'passport';
import User from '../model/userModel.js';


const router = express.Router()

router.post('/register', async (req, res) => {
 const { email, password } = req.body;
 try {
   const newUser = new User ({ email, password});
   await newUser.save();
   res.status(201).json({ message: 'Inscription réussie' })
} catch(error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error })
}
});

// connexion 
router.post('/login', passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/auth/login',
    failureFlash: 'Email ou mot de passe incorrect'
}));

router.get('/login', (req, res) => {
    res.render('login'); 
});


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
