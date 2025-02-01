import express from "express";
import { getAllExercises, createExercise, updateExercise, deleteExercise } from "../controller/exerciseController.js";
import Exercise from '../model/exerciseModel.js';

const router = express.Router();

// Middleware pour authentification
function ensureAuthenticated(req, res, next) {
console.log('Session :', req.session);
console.log('Utilisateur connecté :', req.isAuthenticated ? req.isAuthenticated() : false);
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

// Routes protégées avec middleware
router.get('/', ensureAuthenticated, getAllExercises);
router.post('/', ensureAuthenticated, createExercise);
router.put('/:id', ensureAuthenticated, updateExercise);
router.delete('/:id', ensureAuthenticated, deleteExercise);


router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('addExercise');
});

router.get('/:id/edit', ensureAuthenticated, async (req, res) => { 
    const { id } = req.params;

    try {
        const exercise = await Exercise.findById(id);

        if (!exercise) {
            return res.status(404).render('error', {
            title: 'Erreur',  
            message: 'Exercice non trouvé'});
        }

        res.render('updateExercise', { exercise });
    } catch (error) {
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Erreur lors du chargement de l\'exercice'});
    }
});


export default router;
