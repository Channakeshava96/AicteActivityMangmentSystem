import { useWorkoutsContext } from '../hooks/useWorkoutsContext';

const WorkoutCompletion = () => {
  const { workouts } = useWorkoutsContext(); // Get all workouts from context

  // Calculate total points
  const totalPoints = workouts?.reduce((sum, workout) => sum + workout.points, 0) || 0;

  // Determine progress percentage
  const progressPercentage = Math.min((totalPoints / 100) * 100, 100); // Cap at 100%

  return (
    <div className="workout-completion">
      <h3>Activity Points Progression</h3>
      <div className="progress-circle">
        <svg viewBox="0 0 36 36" className="circular-chart">
          <path
            className="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="circle"
            strokeDasharray={`${progressPercentage}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="circle-text">
          <strong>{totalPoints}</strong> / 100
        </div>
      </div>
    </div>
  );
};

export default WorkoutCompletion;
