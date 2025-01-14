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
    // Only store the file path in the database
    path: {
      type: String,  // Path to the file in the uploads folder
      required: true,
    },
    filename: {
      type: String,  // Store the file name
      required: true,
    },
    size: {
      type: Number,  // Store the file size
      required: true,
    },
    contentType: {
      type: String,  // MIME type (e.g., 'application/pdf', 'image/png')
      required: true,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
