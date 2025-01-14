const express = require('express');
const multer = require('multer');
const {
  createWorkout,
  getWorkouts,
  getWorkout,
  deleteWorkout,
  updateWorkout,
  getAllWorkoutsForAdmin,
} = require('../controllers/workoutController');
const requireAuth = require('../middleware/requireAuth');

// Configure Multer for file uploads (using disk storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the 'uploads' folder as the destination
  },
  filename: (req, file, cb) => {
    // Generate a unique filename based on the current timestamp and original filename
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Require auth for all workout routes
router.use(requireAuth);

// GET all workouts
router.get('/', getWorkouts);

// GET a single workout
router.get('/:id', getWorkout);

// POST a new workout with certificate upload
router.post('/', upload.single('certificate'), createWorkout);

// DELETE a workout
router.delete('/:id', deleteWorkout);

// UPDATE a workout with certificate upload
router.patch('/:id', upload.single('certificate'), updateWorkout);

// GET all workouts for admin
router.get('/admin/all', getAllWorkoutsForAdmin);

module.exports = router;
