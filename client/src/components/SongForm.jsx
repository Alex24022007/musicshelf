import { useState } from 'react';
import api, { errMsg } from '../api';

const empty = { title: '', artist: '', album: '', genre: '', year: '', rating: 0, link: '', notes: '' };

export default function SongForm({ song, onSaved, onClose }) {
  const [form, setForm] = useState(song ? { ...empty, ...song, year: song.year ?? '' } : empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const body = { ...form, rating: Number(form.rating) || 0, year: form.year === '' ? '' : Number(form.year) };
    try {
      const res = song ? await api.put(`/songs/${song._id}`, body) : await api.post('/songs', body);
      onSaved(res.data);
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{song ? 'Edit song' : 'Add a song'}</h2>
        {error && <div className="alert">{error}</div>}
        <div className="grid2">
          <label>Title *<input required value={form.title} onChange={set('title')} /></label>
          <label>Artist *<input required value={form.artist} onChange={set('artist')} /></label>
          <label>Album<input value={form.album} onChange={set('album')} /></label>
          <label>Genre<input value={form.genre} onChange={set('genre')} placeholder="Pop, Rock, Jazz…" /></label>
          <label>Year<input type="number" min="1900" max="2100" value={form.year} onChange={set('year')} /></label>
          <label>Rating
            <select value={form.rating} onChange={set('rating')}>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n === 0 ? 'Not rated' : '★'.repeat(n)}</option>
              ))}
            </select>
          </label>
        </div>
        <label>Link (YouTube / Spotify)<input type="url" value={form.link} onChange={set('link')} placeholder="https://…" /></label>
        <label>Notes<textarea rows="3" value={form.notes} onChange={set('notes')} /></label>
        <div className="row-end">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
