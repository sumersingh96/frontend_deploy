import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import './App.css';

const API =  'https://backend-deploy-1-gq0s.onrender.com/actors';

function App() {
  const [actors, setActors] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch all actors
  const fetchActors = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setActors(data);
  };

  useEffect(() => {
    fetchActors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actorData = { name };

    if (editingId) {
      await fetch(`${API}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actorData),
      });
    } else {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actorData),
      });
    }

    setName('');
    setEditingId(null);
    fetchActors();
  };

  const handleEdit = (actor) => {
    setName(actor.name);
    setEditingId(actor._id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchActors();
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">🎬 Actors List</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter actor name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">
          {editingId ? 'Update Actor' : 'Add Actor'}
        </button>
      </form>

      <ul className="list-group">
        {actors.map((actor) => (
          <li key={actor._id} className="list-group-item d-flex justify-content-between">
            {actor.name}
            <span>
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(actor)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(actor._id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
