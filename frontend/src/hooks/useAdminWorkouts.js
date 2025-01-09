import { useState, useEffect } from "react";

export const useAdminWorkouts = (user) => {
  const [adminWorkouts, setAdminWorkouts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminWorkouts = async () => {
      try {
        const response = await fetch("/api/workouts/admin/all", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch workouts");
        }
        console.log(data)
        setAdminWorkouts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (user) fetchAdminWorkouts();
  }, [user]);

  return { adminWorkouts, error };
};
