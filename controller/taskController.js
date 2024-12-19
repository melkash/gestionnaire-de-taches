import Task from '../model/taskModel.js'

export const getAllTasks = async (req, res) => {
   try {
      const tasks = await Task.find();
      res.json(tasks);
   } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error});
   }
};

export const createTask = async (req, res) => {
      try {
        const { name, description, completed } = req.body;
        if(!name) { 
        return res.status(400).json({ message: 'Le champ name est requis' });
        }

        if(!description) {
        return res.status(400).json({ message: 'Le champ description est requis' });
        }

        const task = new Task({ 
        name, 
        description,
        completed: completed === "true"
    });

        await task.save();
        res.status(201).json(task);
      } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de la tâche', error});
      }
};

export const updateTask = async (req, res) => {
    try {
        const { name, description, completed } = req.body;
        const updates = {};

        // Ajouter seulement les champs envoyés dans la mise à jour
        if (name) updates.name = name;
        if (description) updates.description = description;
        if (completed !== undefined) updates.completed = completed === "true";

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: 'Tâche non trouvée' });
        }

        res.json({ success: true, updatedTask });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour de la tâche', error });
    }
};


export const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
       res.status(500).json({ message: 'Erreur lors de la suppression de la tâche', error});
    }
};