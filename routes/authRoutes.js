import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../model/userModel.js';

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim();

        if (!email || !password) {
            req.flash('error', 'Email et mot de passe sont requis');
            return res.redirect('/auth/register');
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
        console.error('🚨 Erreur lors de l\'inscription :', error);
        req.flash('error', 'Une erreur est survenue');
        res.redirect('/auth/register');
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
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Aucun compte trouvé pour cet email');
            return res.redirect('/auth/forgot-password');
        }

        // Ici, on pourrait générer un token pour l'email de réinitialisation
        req.flash('success', 'Un email avec des instructions a été envoyé.');
        res.redirect('/auth/login');
    } catch (error) {
        console.error('🚨 Erreur lors de la réinitialisation :', error);
        res.status(500).render('error', { 
            title: 'Erreur de réinitialisation', 
            message: 'Une erreur est survenue.'
        });
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
            if (err) {
                console.error("🚨 Erreur lors de la connexion :", err);
                return next(err);
            }
            return res.redirect('/exercises');
        });
    } catch (error) {
        console.error("🚨 Erreur lors de la recherche de l'utilisateur :", error);
        req.flash('error', 'Une erreur est survenue. Veuillez réessayer.');
        res.redirect('/auth/login');
    }
});

// Déconnexion
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("🚨 Erreur lors de la déconnexion :", err);
            req.flash('error', 'Erreur lors de la déconnexion');
            return res.redirect('/auth/login');
        }
        res.cookie('flash_success', 'Déconnexion réussie', { maxAge: 1000, httpOnly: true });
        return res.redirect('/auth/login');
    });
});

export default router;

