import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import SongForm from '../components/SongForm.jsx';
import SongCard from '../components/SongCard.jsx';

export default function Dashboard() {
  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | song object

  const loadGenres = useCallback(async () => {
    try {
      setGenres((await api.get('/songs/genres/list')).data);
    } catch { /* ignore */ }
  }, []);

  const loadSongs = useCallback(async () => {
    try {
      const res = await api.get('/songs', { params: { search, genre, sort } });
      setSongs(res.data);
      setError('');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }, [search, genre, sort]);

  // debounce search typing
  useEffect(() => {
    const t = setTimeout(loadSongs, 250);
    return () => clearTimeout(t);
  }, [loadSongs]);

  useEffect(() => { loadGenres(); }, [loadGenres]);

  const onSaved = () => {
    setEditing(null);
    loadSongs();
    loadGenres();
  };

  const onDelete = async (song) => {
    if (!window.confirm(`Delete "${song.title}" from your shelf?`)) return;
    try {
      await api.delete(`/songs/${song._id}`);
      setSongs((s) => s.filter((x) => x._id !== song._id));
      loadGenres();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const filtering = search || genre;

  return (
    <>
      <div className="toolbar">
        <input className="search" placeholder="Search title, artist or album…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All genres</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest added</option>
          <option value="oldest">Oldest added</option>
          <option value="title">Title A–Z</option>
          <option value="artist">Artist A–Z</option>
          <option value="rating">Top rated</option>
        </select>
        <button className="btn" onClick={() => setEditing('new')}>+ Add song</button>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading ? (
        <p className="center-msg">Loading your shelf…</p>
      ) : songs.length === 0 ? (
        <div className="empty">
          <h3>{filtering ? 'No songs match your search' : 'Your shelf is empty'}</h3>
          <p className="muted">
            {filtering ? 'Try a different search or genre.' : 'Click “Add song” to save your first track.'}
          </p>
        </div>
      ) : (
        <>
          <p className="muted count">{songs.length} song{songs.length !== 1 && 's'}</p>
          <div className="song-grid">
            {songs.map((s) => (
              <SongCard key={s._id} song={s} onEdit={setEditing} onDelete={onDelete} />
            ))}
          </div>
        </>
      )}

      {editing && (
        <SongForm song={editing === 'new' ? null : editing} onSaved={onSaved} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
