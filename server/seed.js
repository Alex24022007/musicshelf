import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Song from './models/Song.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Remove existing demo user if present
    const existingUser = await User.findOne({
      email: 'demo@musicshelf.com'
    });

    if (existingUser) {
      await Song.deleteMany({ user: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });

      console.log('Old demo data removed');
    }

    // Create demo user
    const user = await User.create({
      name: 'MusicShelf Demo',
      email: 'demo@musicshelf.com',
      password: 'Demo123'
    });

    console.log('Demo user created');

    // Demo songs
    const songs = [
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

    await Song.insertMany(songs);

    console.log('8 demo songs added successfully');
    console.log('');
    console.log('Demo Login:');
    console.log('Email: demo@musicshelf.com');
    console.log('Password: Demo123');

    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();