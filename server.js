import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import exerciseRoutes from './routes/exerciseRoutes.js'
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv'
import { create } from 'express-handlebars'
import methodOverride from 'method-override';
import session from 'express-session';
import passport from './config/autoConfig.js';
import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';





dotenv.config();

const app = express()
const PORT = process.env.PORT || 3300;

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

hbs.handlebars.registerPartial('header', 'views/partials/header.hbs');
hbs.handlebars.registerPartial('footer', 'views/partials/footer.hbs');


app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')


// middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

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

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

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
    console.log("📢 Messages flash transmis aux vues :", res.locals.messages); 
    res.locals.user = req.user;
    next();
  });
  


// Routes
app.use('/exercises', exerciseRoutes);
app.use('/auth', authRoutes);


// Route de base
app.get('/', (req, res) => {
 res.render('homepage', {
    title: 'Bienvenue sur Mon Gestionnaire de Tâches'
 });
}); 


// Middleware pour les erreurs 404 (page non trouvée)
app.use((req, res) => {
    //console.log('Middleware 404 - Title:', 'Page non trouvée');
    res.status(404).render('error', {
        title: 'Page non trouvée',
        message: "La page que vous recherchez n'existe pas."
    });
});

// Middleware pour les erreurs 500 (erreur serveur)
app.use((err, req, res, next) => {
    res.status(500).render('error', {
        title: 'Erreur du serveur',
        message: 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.'
    });
});

mongoose.connect(process.env.MONGO_URI)
.then(() => { 
    console.log(`Connecté à MongoDB : ${process.env.MONGO_URI}`);
    app.listen(PORT, () => {
        console.log(`Serveur en cours d'éxecution sur le ${PORT}`)   
       });
    })
.catch((error) => {
    console.log('Erreur de connection à MongoDB:', error);
    fs.appendFileSync("mongoErrors.log", `[${new Date().toISOString()}] ${error}\n`);
}); 

