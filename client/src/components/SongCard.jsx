export default function SongCard({ song, onEdit, onDelete }) {
  return (
    <div className="card song">
      <div className="song-head">
        <div>
          <h3>{song.title}</h3>
          <p className="muted">{song.artist}</p>
        </div>
        {song.genre && <span className="tag">{song.genre}</span>}
      </div>
      <p className="meta">
        {[song.album, song.year].filter(Boolean).join(' • ') || '—'}
      </p>
      {song.rating > 0 && <p className="stars">{'★'.repeat(song.rating)}{'☆'.repeat(5 - song.rating)}</p>}
      {song.notes && <p className="notes">{song.notes}</p>}
      <div className="row-end">
        {song.link && <a className="btn btn-ghost" href={song.link} target="_blank" rel="noreferrer">▶ Listen</a>}
        <button className="btn btn-ghost" onClick={() => onEdit(song)}>Edit</button>
        <button className="btn btn-danger" onClick={() => onDelete(song)}>Delete</button>
      </div>
    </div>
  );
}
