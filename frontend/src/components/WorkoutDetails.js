import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// date-fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [showPreview, setShowPreview] = useState(false); // Toggle state for certificate preview

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch("/api/workouts/" + workout._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };

  const renderCertificatePreview = () => {
    if (workout.certificate && workout.certificate.path) {
      const fileSrc = workout.certificate.path; // Use the path from the backend
      const contentType = workout.certificate.contentType;

      if (contentType && contentType.startsWith("image")) {
        return (
          <img
            src={fileSrc}
            alt="Certificate Preview"
            style={{
              maxWidth: "100%",
              height: "auto",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "5px",
            }}
          />
        );
      } else if (contentType && contentType === "application/pdf") {
        return (
          <embed
            src={fileSrc}
            type="application/pdf"
            style={{
              width: "100%",
              height: "500px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          />
        );
      } else {
        return <p style={{ color: "red" }}>Unsupported certificate format.</p>;
      }
    }

    return <p>No certificate available.</p>;
  };

  const togglePreview = () => {
    setShowPreview(!showPreview); // Toggle the preview visibility
  };

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p>
        <strong>Activity Points: </strong>
        {workout.points}
      </p>
      <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>

      {/* Button to toggle preview visibility */}
      <button className="toggle-preview-btn" onClick={togglePreview}>
        {showPreview ? "Hide Certificate" : "Show Certificate Preview"}
      </button>

      {/* Conditionally render certificate preview */}
      {showPreview && renderCertificatePreview()}

      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>
    </div>
  );
};

export default WorkoutDetails;
