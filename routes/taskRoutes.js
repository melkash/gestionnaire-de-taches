import express from "express";
import { getAllTasks, createTask, updateTask, deleteTask } from "../controller/taskController.js";
import Task from '../model/taskModel.js';

const router = express.Router();

// Middleware pour authentification
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

// Routes protégées avec middleware
router.get('/', ensureAuthenticated, getAllTasks);
router.post('/', ensureAuthenticated, createTask);
router.put('/:id', ensureAuthenticated, updateTask);
router.delete('/:id', ensureAuthenticated, deleteTask);


router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('addTasks');
});

router.get('/:id/edit', ensureAuthenticated, async (req, res) => { 
    const { id } = req.params;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).send('Tâche non trouvée');
        }

        res.render('updateTask', { task });
    } catch (error) {
        res.status(500).send('Erreur lors du chargement de la tâche');
    }
});


export default router;
