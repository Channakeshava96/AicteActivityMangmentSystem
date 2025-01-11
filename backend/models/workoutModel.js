const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  certificate: {
    type: {
      data: Buffer, // Binary data for the file
      contentType: String, // MIME type (e.g., 'application/pdf', 'image/png')
    },
    required: true, // This ensures the entire certificate object is mandatory
  },
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
