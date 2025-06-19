import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../model/userModel.js';

const router = express.Router();

// Inscription
router.post('/register', async (req, res, next) => {
    try {
        let { email, password } = req.body;
        email = email.trim();

        if (!email || !password) {
            req.flash('error', 'Email et mot de passe sont requis');
            return res.redirect('/auth/register');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if(!emailRegex.test(email)){
           req.flash("error", "Veuillez entrer un email valide")
            return res.redirect("/auth/register")
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Cet email est déjà utilisé, veuillez en choisir un autre');
            return res.redirect('/auth/register');
        }

        const newUser = new User({ email, password });
        await newUser.save();

        req.flash('success', 'Inscription réussie. Vous pouvez maintenant vous connecter.');
        res.redirect('/auth/login');
    } catch (error) {
        return next(error);  
    }
});

// Page d'inscription
router.get('/register', (req, res) => {
    res.render('register', { title: 'Créer un compte' });
});

// Page de connexion
router.get('/login', (req, res) => {
    const successMessage = req.cookies.flash_success;
    res.clearCookie('flash_success');
    res.render('login', { successMessage });
});

// Mot de passe oublié (affichage du formulaire)
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Mot de passe oublié' });
});

// Mot de passe oublié (soumission du formulaire) 
router.post('/forgot-password', async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Aucun compte trouvé pour cet email');
            return res.redirect('/auth/forgot-password');
        }

        req.flash('success', 'Un email avec des instructions a été envoyé.');
        res.redirect('/auth/login');
    } catch (error) {
        return next(error);  
    }
});

// Connexion
router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            req.flash('error', 'Email ou mot de passe incorrect');
            return res.redirect('/auth/login');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            req.flash('error', 'Email ou mot de passe incorrect');
            return res.redirect('/auth/login');
        }

        req.logIn(user, (err) => {
            if (err) return next(err);  
            return res.redirect('/exercises');
        });
    } catch (error) {
        return next(error);  
    }
});

// Déconnexion
router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err);  
        res.cookie('flash_success', 'Déconnexion réussie', { maxAge: 1000, httpOnly: true });
        res.redirect('/auth/login');
    });
});

export default router;
