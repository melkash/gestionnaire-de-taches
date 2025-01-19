import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema(
{
  email : {
     type: String,
     required: true,
     unique: true,
     trim: true,
     match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 },
 password : {
     type: String,
     required: true
},
 name : {
  type: String,
  required: false,
  trim: true,
  minlength: 2,
  maxlength: 50,
 },
 role : {
  type: String,
  enum: ['user', 'admin', 'coach'],
  default: 'user'
 },
},
 {timestamps: true},
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  const User = mongoose.model('User', userSchema)
  export default User