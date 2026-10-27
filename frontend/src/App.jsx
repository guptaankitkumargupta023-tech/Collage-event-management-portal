import { useEffect, useState } from "react";
import api from "./api";
import "./styles.css";

const sampleEvents = [
  { title: "Coding Hackathon", category: "Technology", date: "2026-11-10", venue: "Computer Lab", capacity: 100, description: "Coding competition for students." },
  { title: "Annual Cultural Fest", category: "Cultural", date: "2026-11-12", venue: "Main Auditorium", capacity: 500, description: "Dance, music and drama performances." },
  { title: "Robotics Workshop", category: "Workshop", date: "2026-11-16", venue: "Robotics Lab", capacity: 80, description: "Learn robotics and automation." },
  { title: "Tech Quiz", category: "Competition", date: "2026-11-23", venue: "Seminar Hall", capacity: 120, description: "Technology quiz competition." },
  { title: "Web Development Workshop", category: "Workshop", date: "2026-12-01", venue: "Computer Lab", capacity: 100, description: "Learn HTML, CSS, JavaScript and React." },
  { title: "Photography Competition", category: "Competition", date: "2026-12-05", venue: "College Campus", capacity: 60, description: "Show your photography skills." },
  { title: "Sports Day", category: "Sports", date: "2026-12-10", venue: "College Ground", capacity: 300, description: "Annual college sports competition." },
  { title: "Science Exhibition", category: "Exhibition", date: "2026-11-15", venue: "Exhibition Hall", capacity: 200, description: "Present innovative science projects." },
  { title: "Debate Competition", category: "Competition", date: "2026-12-20", venue: "Seminar Hall", capacity: 80, description: "Improve public speaking and debate skills." },
  { title: "Entrepreneurship Seminar", category: "Seminar", date: "2026-11-18", venue: "Main Auditorium", capacity: 150, description: "Learn about startups and entrepreneurship." },
  { title: "Cyber Security Awareness", category: "Technology", date: "2026-11-11", venue: "Computer Lab", capacity: 100, description: "Learn about online safety and cyber security." },
  { title: "Farewell Party", category: "Cultural", date: "2027-05-20", venue: "College Auditorium", capacity: 400, description: "A memorable farewell celebration." }
];

function getList(data, key) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data[key])) return data[key];
  return [];
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [results, setResults] = useState([]);
  const [tab, setTab] = useState("events");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Technology",
    date: "",
    venue: "",
    capacity: 100,
    description: ""
  });

  const [reg, setReg] = useState({
    event: "",
    studentName: "",
    email: "",
    studentId: ""
  });

  // Load all data
  async function load() {
    try {
      const [e, r, n, rs] = await Promise.all([
        api.get("/events"),
        api.get("/registrations"),
        api.get("/notifications"),
        api.get("/results")
      ]);

      setEvents(getList(e.data, "events"));
      setRegistrations(getList(r.data, "registrations"));
      setNotifications(getList(n.data, "notifications"));
      setResults(getList(rs.data, "results"));
    } catch (err) {
      console.error("Load error:", err);
      setMessage(
        err.response?.data?.message ||
        "Backend connection nahi ho raha. Backend aur MongoDB check karein."
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (events.length > 0 && !events.some(ev => ev._id === reg.event)) {
      setReg(prev => ({ ...prev, event: events[0]._id }));
    }
  }, [events, reg.event]);

  // Add event
  async function createEvent(e) {
    e.preventDefault();
    setBusy(true);

    try {
      await api.post("/events", {
        ...form,
        capacity: Number(form.capacity)
      });

      setForm({
        title: "",
        category: "Technology",
        date: "",
        venue: "",
        capacity: 100,
        description: ""
      });

      setMessage("Naya event successfully add ho gaya.");
      await load();
      setTab("events");
    } catch (err) {
      setMessage(err.response?.data?.message || "Event add nahi hua.");
    } finally {
      setBusy(false);
    }
  }

  // Delete event
  async function handleDeleteEvent(event) {
    if (!event?._id) {
      setMessage("Event ID nahi mila.");
      return;
    }

    if (!window.confirm(`Kya aap "${event.title}" event delete karna chahte hain?`)) {
      return;
    }

    setBusy(true);

    try {
      await api.delete(`/events/${event._id}`);

      setEvents(prev => prev.filter(item => item._id !== event._id));
      setReg(prev => ({
        ...prev,
        event: prev.event === event._id ? "" : prev.event
      }));

      setMessage(`"${event.title}" event delete ho gaya.`);
      await load();
    } catch (err) {
      console.error("Delete event error:", err);
      setMessage(
        err.response?.data?.message ||
        "Event delete nahi hua. Backend DELETE route check karein."
      );
    } finally {
      setBusy(false);
    }
  }

  // Add sample events
  async function seedExamples() {
    setBusy(true);

    try {
      const response = await api.get("/events");
      const currentEvents = getList(response.data, "events");

      const existingTitles = new Set(
        currentEvents.map(ev => (ev.title || "").trim().toLowerCase())
      );

      const missingEvents = sampleEvents.filter(
        ev => !existingTitles.has(ev.title.trim().toLowerCase())
      );

      for (const event of missingEvents) {
        await api.post("/events", event);
      }

      setMessage(
        missingEvents.length
          ? `${missingEvents.length} naye sample events add hue.`
          : "Sample events pehle se maujood hain."
      );

      await load();
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Sample events add nahi hue."
      );
    } finally {
      setBusy(false);
    }
  }

  // Student registration
  async function register(e) {
    e.preventDefault();
    setBusy(true);

    try {
      const response = await api.post("/registrations", reg);

      setMessage(
        `Registration successful! Registration ID: ${
          response.data?._id || "Created"
        }`
      );

      setReg(prev => ({
        ...prev,
        studentName: "",
        email: "",
        studentId: ""
      }));

      await load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration nahi hua.");
    } finally {
      setBusy(false);
    }
  }

  // Create notification
  async function createNotification(e) {
    e.preventDefault();

    const currentForm = e.currentTarget;
    const data = new FormData(currentForm);

    try {
      await api.post("/notifications", {
        title: data.get("title"),
        message: data.get("message")
      });

      currentForm.reset();
      setMessage("Notification add ho gaya.");
      await load();
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Notification add nahi hua."
      );
    }
  }

  // DELETE NOTIFICATION
  async function deleteNotification(id) {
    if (!id) {
      setMessage("Notice ID nahi mila.");
      return;
    }

    const confirmed = window.confirm(
      "Kya aap is notice ko delete karna chahte hain?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/notifications/${id}`);

      setNotifications(prev =>
        prev.filter(notice => notice._id !== id)
      );

      setMessage("Notice delete ho gaya.");
    } catch (err) {
      console.error("Delete notification error:", err);
      setMessage(
        err.response?.data?.message ||
        "Notice delete nahi hua. Backend DELETE route check karein."
      );
    }
  }

  // Add result
  async function createResult(e) {
    e.preventDefault();

    const currentForm = e.currentTarget;
    const data = new FormData(currentForm);

    try {
      await api.post("/results", {
        event: data.get("event"),
        studentName: data.get("studentName"),
        position: data.get("position")
      });

      currentForm.reset();
      setMessage("Result add ho gaya.");
      await load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Result add nahi hua.");
    }
  }

  // Download certificate
  async function downloadCertificate(id) {
    try {
      const response = await api.get(`/certificates/${id}`, {
        responseType: "blob"
      });

      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = "participation-certificate.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Certificate error:", err);
      setMessage(
        err.response?.data?.message || "Certificate download nahi hua."
      );
    }
  }

  return (
    <div className="app-shell">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-inner">
          <div className="eyebrow">
            CAMPUS • CONNECT • CELEBRATE
          </div>

          <h1>
            College Event
            <br />
            <span>Management Portal</span>
          </h1>

          <p>
            Discover campus events, register online, and stay up to date.
          </p>

          <div className="hero-stats">
            <div>
              <strong>{events.length}</strong>
              <small>Events</small>
            </div>
            <div>
              <strong>{registrations.length}</strong>
              <small>Registrations</small>
            </div>
            <div>
              <strong>{notifications.length}</strong>
              <small>Notices</small>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Status message */}
        {message && (
          <div className="notice" role="status">
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="tabs">
          {[
            ["events", "Events"],
            ["register", "Student Registration"],
            ["admin", "Admin"],
            ["notices", "Notifications"],
            ["results", "Results"]
          ].map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* EVENTS */}
        {tab === "events" && (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow dark">WHAT'S HAPPENING</p>
                <h2>Upcoming Events</h2>
              </div>

              <button
                type="button"
                className="secondary"
                onClick={seedExamples}
                disabled={busy}
              >
                {busy ? "Please wait..." : "Add sample events"}
              </button>
            </div>

            {events.length === 0 ? (
              <div className="empty">
                <h3>No events added yet</h3>
                <p>Admin tab se event add karein.</p>
              </div>
            ) : (
              <div className="event-grid">
                {events.map(ev => (
                  <article className="event-card" key={ev._id}>
                    <div className="event-top">
                      <span className="category">
                        {ev.category || "Campus Event"}
                      </span>
                      <span className="calendar">
                        📅{" "}
                        {ev.date
                          ? new Date(ev.date).toLocaleDateString("en-GB")
                          : "Date not set"}
                      </span>
                    </div>

                    <h3>{ev.title}</h3>
                    <p>{ev.description}</p>

                    <div className="event-meta">
                      <span>📍 {ev.venue}</span>
                      <span>👥 {ev.capacity} seats</span>
                    </div>

                    <div className="event-actions">
                      <button
                        type="button"
                        className="primary full"
                        onClick={() => {
                          setReg(prev => ({ ...prev, event: ev._id }));
                          setTab("register");
                        }}
                      >
                        Register for event
                      </button>

                      <button
                        type="button"
                        className="delete-event-btn"
                        disabled={busy}
                        onClick={() => handleDeleteEvent(ev)}
                      >
                        Delete Event
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* STUDENT REGISTRATION */}
        {tab === "register" && (
          <section className="panel">
            <p className="eyebrow dark">SAVE YOUR SPOT</p>
            <h2>Student Registration</h2>

            <form className="form-grid" onSubmit={register}>
              <label>
                Select event
                <select
                  required
                  value={reg.event}
                  onChange={e =>
                    setReg(prev => ({ ...prev, event: e.target.value }))
                  }
                >
                  <option value="">Choose an event</option>
                  {events.map(ev => (
                    <option key={ev._id} value={ev._id}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Student name
                <input
                  required
                  value={reg.studentName}
                  onChange={e =>
                    setReg(prev => ({
                      ...prev,
                      studentName: e.target.value
                    }))
                  }
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  required
                  value={reg.email}
                  onChange={e =>
                    setReg(prev => ({ ...prev, email: e.target.value }))
                  }
                />
              </label>

              <label>
                Student ID
                <input
                  value={reg.studentId}
                  onChange={e =>
                    setReg(prev => ({ ...prev, studentId: e.target.value }))
                  }
                />
              </label>

              <button
                className="primary"
                disabled={!events.length || busy}
              >
                {busy ? "Please wait..." : "Submit registration"}
              </button>
            </form>
          </section>
        )}

        {/* ADMIN */}
        {tab === "admin" && (
          <div className="admin-grid">
            <section className="panel">
              <p className="eyebrow dark">EVENT MANAGEMENT</p>
              <h2>Add an Event</h2>

              <form className="form-grid" onSubmit={createEvent}>
                <label>
                  Event title
                  <input
                    required
                    value={form.title}
                    onChange={e =>
                      setForm(prev => ({ ...prev, title: e.target.value }))
                    }
                  />
                </label>

                <label>
                  Category
                  <input
                    required
                    value={form.category}
                    onChange={e =>
                      setForm(prev => ({ ...prev, category: e.target.value }))
                    }
                  />
                </label>

                <label>
                  Date
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={e =>
                      setForm(prev => ({ ...prev, date: e.target.value }))
                    }
                  />
                </label>

                <label>
                  Venue
                  <input
                    required
                    value={form.venue}
                    onChange={e =>
                      setForm(prev => ({ ...prev, venue: e.target.value }))
                    }
                  />
                </label>

                <label>
                  Capacity
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.capacity}
                    onChange={e =>
                      setForm(prev => ({ ...prev, capacity: e.target.value }))
                    }
                  />
                </label>

                <label className="wide">
                  Description
                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={e =>
                      setForm(prev => ({
                        ...prev,
                        description: e.target.value
                      }))
                    }
                  />
                </label>

                <button className="primary" disabled={busy}>
                  {busy ? "Please wait..." : "Save event"}
                </button>
              </form>
            </section>

            <section className="panel">
              <p className="eyebrow dark">ADMIN OVERVIEW</p>
              <h2>Registrations</h2>

              {registrations.length > 0 ? (
                <div className="stack-list">
                  {registrations.map(r => (
                    <div className="list-row" key={r._id}>
                      <div>
                        <strong>{r.studentName || "Student"}</strong>
                        <small>
                          {r.email} • {r.event?.title || "Event"}
                        </small>
                      </div>

                      <button
                        type="button"
                        className="secondary compact"
                        onClick={() => downloadCertificate(r._id)}
                      >
                        Certificate PDF
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">Abhi registration nahi hua hai.</p>
              )}

              {/* Create notification */}
              <h3 className="subheading">Create notification</h3>

              <form className="form-grid" onSubmit={createNotification}>
                <label>
                  Title
                  <input name="title" required />
                </label>

                <label className="wide">
                  Message
                  <textarea name="message" required rows="2" />
                </label>

                <button type="submit" className="primary">
                  Publish notice
                </button>
                </form>
                {/* Add result */}
              <h3 className="subheading">Add result</h3>

              <form className="form-grid" onSubmit={createResult}>
                <label>
                  Event
                  <select name="event" required defaultValue="">
                    <option value="">Select event</option>
                    {events.map(ev => (
                      <option key={ev._id} value={ev._id}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Student name
                  <input name="studentName" required />
                </label>

                <label>
                  Position / award
                  <input name="position" required />
                </label>

                <button type="submit" className="primary">
                  Save result
                </button>
              </form>
            </section>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab === "notices" && (
          <section>
            <p className="eyebrow dark">CAMPUS UPDATES</p>
            <h2>Notifications</h2>

            <div className="notice-list">
              {notifications.map(n => (
                <article className="notice-card" key={n._id}>
                  <div>
                    <h3>{n.title}</h3>
                    <p>{n.message}</p>
                    <small>
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString()
                        : ""}
                    </small>
                  </div>

                  <button
                    type="button"
                    className="delete-event-btn"
                    onClick={() => deleteNotification(n._id)}
                  >
                    Delete Notice
                  </button>
                </article>
              ))}

              {!notifications.length && (
                <p>No notifications published yet.</p>
              )}
            </div>
          </section>
        )}

        {/* RESULTS */}
        {tab === "results" && (
          <section>
            <p className="eyebrow dark">CELEBRATING ACHIEVEMENT</p>
            <h2>Event Results</h2>

            <div className="results-list">
              {results.map(r => (
                <article className="result-card" key={r._id}>
                  <div>
                    <h3>{r.studentName || "Participant"}</h3>
                    <p>
                      {r.position || "Result"} ·{" "}
                      {r.event?.title || "College Event"}
                    </p>
                  </div>
                </article>
              ))}

              {!results.length && <p>Abhi results add nahi hue.</p>}
            </div>
          </section>
        )}

        <footer>
          College Event Management Portal · MERN Stack
        </footer>
      </main>
    </div>
  );
}