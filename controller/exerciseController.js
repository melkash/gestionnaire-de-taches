import Exercise from '../model/exerciseModel.js';
import logDev from '../utils/logDev.js';

export const getAllExercises = async (req, res) => {
   try {
      const exercises = await Exercise.find().sort({ date: -1});
      res.render('exercise', {
        title:'liste des exercices',
        exercises
    });
   } catch (error) {
    res.status(500).render( 'error', {
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la récupération des exercices.'});
   }
};

export const createExercise = async (req, res) => {
      try {
        const { type, description, duration, distance, calories, completed } = req.body;
        if(!type || !description ) { 
         req.flash( 'error', 'Les champs type et description sont obligatoires')
         return res.redirect('/exercises/new')
        }

        const timeBasedExercises = ["Course", "HIIT", "Cyclisme"];
        if (timeBasedExercises.includes(type) && (!duration || duration <= 0)) {
            req.flash('error', 'La durée est obligatoire pour ce type d\'exercice');
            return res.redirect('/exercises/new');
        }
        
       const exercise = new Exercise({ 
        type, 
        description,
        duration: duration || null,
        distance,
        calories,
        completed: completed === "true"
    });

        await exercise.save();
        req.flash('success', 'Exercice ajouté avec succès')
        res.redirect('/exercises');
      } catch (error) {
        logDev('Erreur lors de la création de l\'exercice :', error)
        req.flash( 'error', 'Une erreur est survenue lors de la création');
        res.redirect('/exercises/new')
      }
    };

export const updateExercise = async (req, res) => {
    try {
        const { type, description, duration, distance, calories, completed } = req.body;
        const updates = {};

        // Ajouter seulement les champs envoyés dans la mise à jour
        if (type) updates.type = type;
        if(description) updates.description = description;
        if (duration) updates.duration = Number(duration);
        if(distance) updates.distance = Number(distance);
        if(calories) updates.calories = Number(calories);
        if (completed !== undefined) updates.completed = completed === "true";

        const updatedExercise = await Exercise.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!updatedExercise) {
            req.flash('error', 'Exercice non trouvé.');
            return res.redirect('/exercises');
        }

        req.flash('success', 'Exercice mis à jour avec succès.');
        res.redirect('/exercises');
      } catch (error) {
        logDev('Erreur lors de la mise à jour :', error);
        req.flash('error', 'Une erreur est survenue.');
        return res.redirect(`/exercises/${req.params.id}/edit`);
    }
};


export const deleteExercise = async (req, res) => {
    try {
        const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
        if(!deletedExercise) {
          return res.status(404).render('error', {
            title: 'Erreur',
            message: 'Exercice non trouvé'})  
        }
        res.redirect('/exercises');
    } catch (error) {
       res.status(500).render('error', {
         title: 'Erreur',
         message: 'Erreur de la suppression de l\'exercice.'
        });
    }
};