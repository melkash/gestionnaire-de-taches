import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { create } from 'express-handlebars'
import methodOverride from 'method-override';
import session from 'express-session';
import passport from './config/autoConfig.js';
import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser'; 
import fs from 'fs';

import exerciseRoutes from './routes/exerciseRoutes.js'
import authRoutes from './routes/authRoutes.js';
import logDev from './utils/logDev.js'




// Chargement des variables d'environnement
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3300;


// Configuration de Handlebars
const hbs = create({ 
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, 
        allowProtoMethodsByDefault: true,   
    }
})

hbs.handlebars.registerHelper('eq', (a, b) => a === b);


app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')


// middleware globaux
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// ✅ Indique à Express qu’il est derrière un proxy (Render)
app.set('trust proxy', 1);

// Middleware de session (Avant Passport)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // URL de connexion MongoDB
    }),
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, 
    },

    rolling : true
}));

// Initialisation de Passport
app.use(passport.initialize())
app.use(passport.session())

// Middleware pour gérer le chemin actuel
app.use((req, res, next) => {
    res.locals.currentPath = req.path
    next()
})


// Middleware pour les messages flash
app.use(flash())
app.use((req, res, next) => {
    res.locals.messages = {
      success: req.flash('success'),
      error: req.flash('error')
    };
    logDev("📢 Messages flash transmis aux vues :", res.locals.messages); 
    res.locals.user = req.user;
    next();
  });
  


// Routes
app.use('/exercises', exerciseRoutes);
app.use('/auth', authRoutes);
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'À propos'
    })
})


// Route de base
app.get('/', (req, res) => {
 res.render('homepage', {
    title: 'Bienvenue sur Mon Gestionnaire de Tâches'
 });
}); 


// Middleware pour les erreurs 404 (page non trouvée)
app.use((req, res) => {
       res.status(404).render('error', {
        title: 'Page non trouvée',
        message: "La page que vous recherchez n'existe pas."
    });
});

// Middleware pour les erreurs 500 (erreur serveur)
app.use((err, req, res, next) => {
    logDev("🚨 Erreur serveur :", err);
    res.status(500).render('error', {
        title: 'Erreur du serveur',
        message: 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.'
    });
});


// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => { 
    logDev(" Connecté à MongoDB avec succès !");
    app.listen(PORT, () => {
        logDev(`Serveur en cours d'exécution sur le ${PORT}`)   
       });
    })
.catch((error) => {
    logDev('Erreur de connection à MongoDB:', error);
    fs.appendFileSync("mongoErrors.log", `[${new Date().toISOString()}] ${error}\n`);
}); 

