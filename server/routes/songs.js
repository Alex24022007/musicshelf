import { Router } from 'express';
import mongoose from 'mongoose';
import Song from '../models/Song.js';
import protect from '../middleware/auth.js';

const router = Router();
router.use(protect);

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const FIELDS = ['title', 'artist', 'album', 'genre', 'year', 'rating', 'link', 'notes'];
const pick = (body) => {
  const out = {};
  FIELDS.forEach((f) => {
    if (body[f] !== undefined) out[f] = body[f] === '' && f === 'year' ? undefined : body[f];
  });
  return out;
};

// List + search/filter/sort
router.get('/', async (req, res) => {
  try {
    const { search, genre, sort } = req.query;
    const q = { user: req.user._id };
    if (genre) q.genre = genre;
    if (search) {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      q.$or = [{ title: rx }, { artist: rx }, { album: rx }];
    }
    const sorts = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      title: { title: 1 },
      artist: { artist: 1 },
      rating: { rating: -1 },
    };
    const songs = await Song.find(q).sort(sorts[sort] || sorts.newest);
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/genres/list', async (req, res) => {
  try {
    const genres = await Song.distinct('genre', { user: req.user._id, genre: { $ne: '' } });
    res.json(genres.sort());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = pick(req.body);
    if (!data.title || !data.artist)
      return res.status(400).json({ message: 'Title and artist are required' });
    const song = await Song.create({ ...data, user: req.user._id });
    res.status(201).json(song);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const findOwned = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ message: 'Song not found' });
    return null;
  }
  const song = await Song.findOne({ _id: req.params.id, user: req.user._id });
  if (!song) res.status(404).json({ message: 'Song not found' });
  return song;
};

router.put('/:id', async (req, res) => {
  try {
    const song = await findOwned(req, res);
    if (!song) return;
    const data = pick(req.body);
    if (data.title === '' || data.artist === '')
      return res.status(400).json({ message: 'Title and artist are required' });
    song.set(data);
    await song.save();
    res.json(song);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const song = await findOwned(req, res);
    if (!song) return;
    await song.deleteOne();
    res.json({ message: 'Song deleted', _id: song._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
