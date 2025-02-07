import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../model/userModel.js';
import crypto from 'crypto';


const router = express.Router()

router.post('/register', async (req, res) => {
try {
    let { email, password } = req.body;
        email = email.trim()
    if (!email || !password) {
        req.flash('error', 'Email et mot de passe sont requis')
        return res.redirect('/auth/register');
    }

    const existingUser = await User.findOne({ email })
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

router.get('/test-flash', (req, res) => {
    req.flash('success', 'Test réussi !');
    req.flash('error', 'Ceci est un test d’erreur.');
    res.redirect('/auth/login'); 
});



router.get('/register', (req, res) => {
    res.render('register', { 
         title: 'Créer un compte'
    });
});

router.get('/login', (req, res) => {
    const successMessage = req.cookies.flash_success;
    res.clearCookie('flash_success');
    res.render('login', { successMessage });
    
});


router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { 
        title: 'Mot de passe oublié'
    });
});

router.post('/forgot-password', async(req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) {
          req.flash('error', 'Aucun compte trouvé pour cet email')
          return res.redirect('/auth/forgot-password');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
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
            req.flash('error', 'Email ou mot de passe incorrect');
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
      req.session.destroy((err) => {
        if (err) {
            console.error("Erreur lors de la déconnexion :", err);
            req.flash('error','Erreur lors de la déconnexion')
            return res.redirect('/auth/login');
            }
            res.cookie('flash_success','Déconnexion réussie', { maxAge: 1000, httpOnly: true });
            return res.redirect('/auth/login');
    });
});


export default router;
