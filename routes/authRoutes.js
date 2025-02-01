import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../model/userModel.js';



const router = express.Router()

router.post('/register', async (req, res) => {
 const { email, password } = req.body;
 try {

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis' });
    }

   const hashedPassword = await bcrypt.hash(password, 10)

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

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Mot de passe oublié' });
});

router.post('/forgot-password', async(req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) {
          req.flash('error', 'Aucun compte trouvé pour cet email')
          return res.redirect('/auth/forgot-password');
        }

        const resetToken = Math.random().toString(36).substring(2);
        console.log(`Token de réinitialisation : ${resetToken}`);
        req.flash('success', 'un email avec des instructions a été envoyé.')
        res.redirect('/auth/login');
    }catch (err) {
      console.error('Erreur lors de la réinitialisation :', err);
      res.status(500).render('error', { message: 'Une erreur est survenue.'});
    }
});



// connexion 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', 'Email ou mot de passe incorrect'); // Message d'erreur pour l'utilisateur
            return res.redirect('/auth/login');
        }
        req.logIn(user, (err) => {
            if (err) {
             return next(err);
            }
            return res.redirect('/exercises');
        });
    })(req, res, next);
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
