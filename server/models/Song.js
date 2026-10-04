import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, trim: true, default: '' },
    genre: { type: String, trim: true, default: '' },
    year: { type: Number, min: 1900, max: 2100 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    link: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Song', songSchema);
