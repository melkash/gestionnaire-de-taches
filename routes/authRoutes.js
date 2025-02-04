import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../model/userModel.js';


const router = express.Router()

router.post('/register', async (req, res) => {
try {
    const { email, password } = req.body;
    if (!email || !password) {
        req.flash('error', 'Email et mot de passe sont requis')
        return res.redirect('/auth/register');
    }

    const existingUser = await User.findOne({email})
       if(existingUser){
        req.flash('error', 'Cet email est déjà utilisé, veuillez en choisir un autre')
        return res.redirect('/auth/register')
       }

    const hashedPassword = await bcrypt.hash(password, 10)

   const newUser = new User ({ email, password: hashedPassword });
   await newUser.save();

   req.flash('success', 'Inscription réussie. Vous pouvez maintenant vous connecter.')
   res.redirect('/auth/login')
  } catch (error){
    console.error('Erreur lors de l\'inscription', error);
    req.flash('error', 'Une erreur est survenue')
    res.redirect('/auth/register') 
  }

}); 

/*router.get('/register', (req, res) => {
    console.log('Messages flash:', req.flash('error'), req.flash('success')); // Ajout du console.log
    res.render('register', {
        title: 'Créer un compte',
        error: req.flash('error'),
        success: req.flash('success')
    });
});*/

router.get('/register', (req, res) => {
    /*req.flash('error', 'Test message erreur');*/ // Ajout d'un message d'erreur temporaire
    res.render('register', { title: 'Créer un compte',
                            messages: req.flash()});
});


router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Connexion',
        error: req.flash('error'), 
        success: req.flash('success')}); 
}); // Rends le formulaire de connexion avec les éventuels messages de succès ou d'erreur

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
        req.flash('success', 'Un email avec des instructions a été envoyé.')
        res.redirect('/auth/login');
    }catch (err) {
      console.error('Erreur lors de la réinitialisation :', err);
      res.status(500).render('error', { 
          title: 'Erreur de réinitialisation', 
          message: 'Une erreur est survenue.'});
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
