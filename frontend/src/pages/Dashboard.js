import { useState } from "react";
import { useAdminWorkouts } from "../hooks/useAdminWorkouts";
import { useAuthContext } from "../hooks/useAuthContext";

const AdminPanel = () => {
  const { user } = useAuthContext();
  const { adminWorkouts, error } = useAdminWorkouts(user);
  const [previewVisible, setPreviewVisible] = useState({}); // Tracks visibility for each unique workout

  if (error) return <div>Error: {error}</div>;

  const togglePreview = (uniqueKey) => {
    setPreviewVisible((prevState) => ({
      ...prevState,
      [uniqueKey]: !prevState[uniqueKey], // Toggle visibility for the specific workout
    }));
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      {adminWorkouts.map((entry) => (
        <div key={entry.userId} className="user-workouts">
          <h3>
            {entry.userDetails?.email || "No Email"}
          </h3>
          <p>Total Points: {entry.totalPoints}/100</p>
          <ul>
            {entry.workouts.map((workout, index) => {
              const uniqueKey = `${entry.userId}-${workout._id}`; // Combine userId and workout ID
              return (
                <li key={uniqueKey} style={{ marginBottom: "20px" }}>
                  <strong>{workout.title}</strong>: {workout.points} points
                  {workout.certificate && workout.certificate.path && (
                    <>
                      <button
                        className="toggle-preview-btn"
                        onClick={() => togglePreview(uniqueKey)}
                      >
                        {previewVisible[uniqueKey]
                          ? "Hide Certificate"
                          : "Show Certificate"}
                      </button>
                      {previewVisible[uniqueKey] && (
                        <div className="certificate-preview">
                          {workout.certificate.contentType.startsWith(
                            "image"
                          ) ? (
                            <img
                              src={workout.certificate.path}
                              alt="Certificate Preview"
                              style={{
                                maxWidth: "200px",
                                marginTop: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                padding: "5px",
                              }}
                            />
                          ) : workout.certificate.contentType ===
                            "application/pdf" ? (
                            <embed
                              src={workout.certificate.path}
                              type="application/pdf"
                              style={{
                                width: "100%",
                                height: "300px",
                                marginTop: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                              }}
                            />
                          ) : (
                            <p style={{ color: "red" }}>
                              Unsupported certificate format.
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
