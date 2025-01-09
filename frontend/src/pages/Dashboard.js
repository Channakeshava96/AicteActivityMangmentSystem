import { useAdminWorkouts } from "../hooks/useAdminWorkouts";
import { useAuthContext } from "../hooks/useAuthContext";

const AdminPanel = () => {
  const { user } = useAuthContext();
  const { adminWorkouts, error } = useAdminWorkouts(user);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      {adminWorkouts.map((entry) => (
        <div key={entry.userId} className="user-workouts">
          <h3>User: {entry.userDetails[0]?.name || "Unknown"}</h3>
          <p>Total Points: {entry.totalPoints}/100</p>
          <ul>
            {entry.workouts.map((workout, index) => (
              <li key={index}>
                <strong>{workout.title}</strong>: {workout.points} points
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
