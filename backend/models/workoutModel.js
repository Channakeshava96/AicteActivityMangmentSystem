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
    ref: 'User',
  },
  certificate: {
    data: Buffer,  // Keep the binary data for processing when needed (optional)
    contentType: String, // MIME type (e.g., 'application/pdf', 'image/png')
    filename: String,  // Store the file name
    path: String,  // Path to the file in the uploads folder
    size: Number, // File size in bytes
  },
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
