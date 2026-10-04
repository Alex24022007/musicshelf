import { Router } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import Song from '../models/Song.js';
import protect from '../middleware/auth.js';

const router = Router();

const sign = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const payload = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  token: sign(u._id)
});


/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
| Creates a new user and automatically adds 8 sample songs.
|--------------------------------------------------------------------------
*/

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    // Convert email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check if email already exists
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password
    });

    /*
    |--------------------------------------------------------------------------
    | SAMPLE SONGS
    |--------------------------------------------------------------------------
    | These songs belong to the newly registered user.
    |--------------------------------------------------------------------------
    */

    const sampleSongs = [
      {
        user: user._id,
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        genre: 'Pop',
        year: 2020,
        rating: 5,
        link: '',
        notes: 'One of my favorite songs.'
      },

      {
        user: user._id,
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        album: '÷',
        genre: 'Pop',
        year: 2017,
        rating: 4,
        link: '',
        notes: 'Great song for casual listening.'
      },

      {
        user: user._id,
        title: 'Believer',
        artist: 'Imagine Dragons',
        album: 'Evolve',
        genre: 'Rock',
        year: 2017,
        rating: 5,
        link: '',
        notes: 'Energetic song.'
      },

      {
        user: user._id,
        title: 'Perfect',
        artist: 'Ed Sheeran',
        album: '÷',
        genre: 'Pop',
        year: 2017,
        rating: 4,
        link: '',
        notes: 'Relaxing song.'
      },

      {
        user: user._id,
        title: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        genre: 'Pop',
        year: 2020,
        rating: 5,
        link: '',
        notes: 'Fun and catchy.'
      },

      {
        user: user._id,
        title: 'Counting Stars',
        artist: 'OneRepublic',
        album: 'Native',
        genre: 'Pop Rock',
        year: 2013,
        rating: 4,
        link: '',
        notes: 'Good motivational song.'
      },

      {
        user: user._id,
        title: 'Faded',
        artist: 'Alan Walker',
        album: 'Different World',
        genre: 'Electronic',
        year: 2015,
        rating: 5,
        link: '',
        notes: 'Electronic favorite.'
      },

      {
        user: user._id,
        title: 'Numb',
        artist: 'Linkin Park',
        album: 'Meteora',
        genre: 'Rock',
        year: 2003,
        rating: 5,
        link: '',
        notes: 'Classic rock track.'
      }
    ];

    // Insert sample songs
    await Song.insertMany(sampleSongs);

    // Return registered user
    res.status(201).json(payload(user));

  } catch (err) {
    console.error('Registration error:', err);

    res.status(500).json({
      message: err.message
    });
  }
});


/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: (email || '').toLowerCase()
    });

    if (
      !user ||
      !(await user.matchPassword(password || ''))
    ) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    res.json(payload(user));

  } catch (err) {
    console.error('Login error:', err);

    res.status(500).json({
      message: err.message
    });
  }
});


/*
|--------------------------------------------------------------------------
| GET CURRENT USER
|--------------------------------------------------------------------------
*/

router.get('/me', protect, (req, res) => {
  res.json(req.user);
});


export default router;