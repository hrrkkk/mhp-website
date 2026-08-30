const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, default: '' },
  category: { type: String, default: '' },
  sub: { type: String, default: '' },
  image: { type: String, default: '' },
  aspect: { type: String, default: '' }
}, { _id: false });

const ReelVideoSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, default: '' },
  tag: { type: String, default: '' },
  src: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { _id: false });

const ExploreContentSchema = new mongoose.Schema({
  key: {
    type: String,
    default: 'explore_main',
    unique: true
  },
  gallery: {
    eyebrow: { type: String, default: 'INSIDE MHP' },
    heading: { type: String, default: 'GALLERY' },
    subtitle: { type: String, default: 'A glimpse into the food, people and moments that make MHP special.' },
    instagramHandle: { type: String, default: '@mhp_vfstr' },
    instagramSub: { type: String, default: 'Official Campus Handle' },
    items: [GalleryItemSchema]
  },
  reels: {
    eyebrow: { type: String, default: 'THE MOMENTS WE KEEP' },
    heading: { type: String, default: 'Events & Memories' },
    subtitle: { type: String, default: 'From celebrations and campus events to everyday moments, these are the memories that make MHP more than a place to eat.' },
    videos: [ReelVideoSchema]
  },
  brandStatement: {
    heading: { type: String, default: "EAT. MEET. REMEMBER. THAT'S MHP." },
    tagline: { type: String, default: 'More than a place to eat. A part of campus life.' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExploreContent', ExploreContentSchema);
