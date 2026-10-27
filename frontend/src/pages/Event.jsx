import React from "react";

export default function Event() {
  const handleRegister = () => {
    alert("Event registration selected!");
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Kya aap is event ko delete karna chahte hain?"
    );

    if (confirmDelete) {
      alert("Delete action selected!");
    }
  };

  return (
    <div>
      <button
        className="btn-primary" 
        onClick={handleRegister}
        disabled
      >
        Register for event
      </button>

      <button
        className="delete-event-btn"
        onClick={handleDelete}
      >
        Delete Event
      </button>
    </div>
  );
}