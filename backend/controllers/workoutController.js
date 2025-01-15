const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');
const path = require('path');

// get all workouts
const getWorkouts = async (req, res) => {
  try {
    const userId = req.user._id; // Ensure user ID is extracted from the authenticated user
    const workouts = await Workout.find({ user_id: userId }) // Filter workouts by the logged-in user's ID
      .populate('user_id', 'email') // Populate user_id with the email field from User model
      .sort({ createdAt: -1 });
    console.log("Workout Response:", workouts);
    res.status(200).json(workouts);
  } catch (error) {
    console.error("Error retrieving workouts:", error); // Debugging statement
    res.status(500).json({ error: error.message });
  }
};


// get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout" });
  }

  try {
    const workout = await Workout.findById(id);

    if (!workout) {
      return res.status(404).json({ error: "No such workout" });
    }

    console.log("Retrieved Workout:", workout); // Debugging statement

    res.status(200).json(workout);
  } catch (error) {
    console.error("Error retrieving workout:", error); // Debugging statement
    res.status(500).json({ error: error.message });
  }
};

const createWorkout = async (req, res) => {
  const { title, points } = req.body;
  const certificate = req.file;

  let emptyFields = [];
  if (!title) emptyFields.push("title");
  if (!points) emptyFields.push("points");
  if (!certificate) emptyFields.push("certificate");

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: "Please fill in all the fields", emptyFields });
  }

  // Validate certificate format
  const allowedExtensions = /\.(pdf|jpg|jpeg|png)$/i;
  if (!allowedExtensions.test(certificate.originalname)) {
    return res.status(400).json({ error: "Invalid file format for certificate" });
  }

  try {
    const user_id = mongoose.Types.ObjectId(req.user._id); // Assume user is authenticated

    // Store the certificate details in the workout
    const workout = await Workout.create({
      title,
      points,
      user_id,
      certificate: {
        path: `/uploads/${certificate.filename}`, // Path to the file in the 'uploads' folder
        filename: certificate.filename,           // Filename
        size: certificate.size,                   // File size in bytes
        contentType: certificate.mimetype,        // MIME type (e.g., 'application/pdf', 'image/png')
      },
    });

    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' });
  }

  const workout = await Workout.findOneAndDelete({ _id: id });

  if (!workout) {
    return res.status(400).json({ error: 'No such workout' });
  }

  res.status(200).json(workout);
};

// update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params;
  const certificate = req.file;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout" });
  }

  const updates = { ...req.body };

  if (certificate) {
    const allowedExtensions = /\.(pdf|jpg|jpeg|png)$/i;
    if (!allowedExtensions.test(certificate.originalname)) {
      return res.status(400).json({ error: "Invalid file format for certificate" });
    }

    updates.certificate = `/uploads/${certificate.filename}`; // Update with relative path
  }

  try {
    const workout = await Workout.findOneAndUpdate({ _id: id }, updates, { new: true });

    if (!workout) {
      return res.status(400).json({ error: "No such workout" });
    }

    console.log("Workout Updated:", workout); // Debugging statement

    res.status(200).json(workout);
  } catch (error) {
    console.error("Error updating workout:", error); // Debugging statement
    res.status(400).json({ error: error.message });
  }
};

// Get all workouts grouped by user (admin-only)
const getAllWorkoutsForAdmin = async (req, res) => {
  try {
    const workouts = await Workout.aggregate([
      {
        $group: {
          _id: "$user_id",
          totalPoints: { $sum: "$points" },
          workouts: {
            $push: {
              _id: "$_id",
              title: "$title",
              points: "$points",
              createdAt: "$createdAt",
              certificate: "$certificate",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $addFields: {
          userDetails: { $arrayElemAt: ["$userDetails", 0] }, // Extract single object from array
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          totalPoints: 1,
          workouts: 1,
          "userDetails.name": 1,
          "userDetails.email": 1,
        },
      },
    ]);

    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
  getAllWorkoutsForAdmin, // Export function for use in routes
};
