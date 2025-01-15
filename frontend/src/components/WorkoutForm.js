import { useState, useRef } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState('');
  const [points, setPoints] = useState('');
  const [certificate, setCertificate] = useState(null); // File state
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const fileInputRef = useRef(); // Ref for the file input

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('points', points);
    if (certificate) {
      formData.append('certificate', certificate);
    }

    const response = await fetch('/api/workouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData, // Send the form data
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
    }

    if (response.ok) {
      setTitle('');
      setPoints('');
      setCertificate(null);
      fileInputRef.current.value = ''; // Reset the file input
      setError(null);
      setEmptyFields([]);
      dispatch({ type: 'CREATE_WORKOUT', payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Activity Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Activity Points:</label>
      <input
        type="number"
        onChange={(e) => setPoints(e.target.value)}
        value={points}
        className={emptyFields.includes('points') ? 'error' : ''}
      />

      <label>Upload Certificate:</label>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => setCertificate(e.target.files[0])}
        ref={fileInputRef} // Attach the ref
      />

      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
