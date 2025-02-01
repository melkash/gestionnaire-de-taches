import mongoose from "mongoose";
const exerciseSchema = new mongoose.Schema({
  type: { type: String, required: true }, 
  description: { type: String, required: true },
  duration: { type: Number }, 
  distance: { type: Number }, 
  calories: { type: Number }, 
  completed: { type: Boolean, default: false }, 
  date: { type: Date, default: Date.now }, 
});

const Exercise = mongoose.model('Exercise', exerciseSchema)

export default Exercise