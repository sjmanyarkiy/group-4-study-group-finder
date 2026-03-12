import React, { useEffect, useState } from 'react'

function Memberships({ user }) {
  const [memberships, setMemberships] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/users/${user.user_id}/memberships`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setMemberships(data);
      });
  }, [user]);

  const handleLeave = (membershipId) => {
    fetch(`/memberships/${membershipId}`, { method: "DELETE" }).then((res) => {
      if (res.ok) {
        setMemberships((prev) => prev.filter((m) => m.membership_id !== membershipId));
      }
    });
  };

  if (!user) return <p>Please log in to view your memberships.</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Memberships</h2>
      {memberships.length === 0 ? (
        <p>You have no memberships yet.</p>
      ) : (
        memberships.map((m) => (
          <div key={m.membership_id}>
            <h3>{m.name}</h3>
            <p>Tier: {m.tier}</p>
            <p>Fee: {m.fee}</p>
            <p>Joined: {new Date(m.date_joined).toLocaleDateString()}</p>
            {m.date_graduated && (
              <p>Graduated: {new Date(m.date_graduated).toLocaleDateString()}</p>
            )}
            <button onClick={() => handleLeave(m.membership_id)}>Leave Group</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Memberships
