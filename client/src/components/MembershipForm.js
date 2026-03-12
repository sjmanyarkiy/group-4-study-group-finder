import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function MembershipForm({ user }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    fee: "",
    tier: "",
    study_group_id: "",
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${BASE_URL}/memberships`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, user_id: user.user_id }),
    }).then((res) => {
      if (res.ok) {
        history.push("/memberships");
      } else {
        res.json().then((data) => setErrors([data.error]));
      }
    });
  };

  if (!user) return <p>Please log in to join a group.</p>;

  return (
    <div>
      <h2>Join a Study Group</h2>
      {errors.map((err) => (
        <p key={err} style={{ color: "red" }}>{err}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <label>Membership Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Fee</label>
        <input name="fee" type="number" value={formData.fee} onChange={handleChange} required />

        <label>Tier</label>
        <input name="tier" value={formData.tier} onChange={handleChange} required />

        <label>Study Group ID</label>
        <input name="study_group_id" type="number" value={formData.study_group_id} onChange={handleChange} required />

        <button type="submit">Join Group</button>
      </form>
    </div>
  );
}

export default MembershipForm
