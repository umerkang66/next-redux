import mongoose from 'mongoose';
import { RoomDoc } from '../common-types/room';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter room name'],
    trim: true,
    maxLength: [100, 'Room name cannot exceed 100 characters'],
  },
  // user that created this room
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [false, 'User that created the room, must be provided'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter room price'],
    maxLength: [4, 'Room price cannot exceed 4 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please enter room description'],
  },
  address: {
    type: String,
    required: [true, 'Please enter room address'],
  },
  guestCapacity: {
    type: Number,
    required: [true, 'Please enter room guestCapacity'],
  },
  numOfBeds: {
    type: Number,
    required: [true, 'Please enter number of beds in room'],
  },
  internet: { type: Boolean, default: false },
  breakfast: { type: Boolean, default: false },
  airConditioned: { type: Boolean, default: false },
  petsAllowed: { type: Boolean, default: false },
  roomCleaning: { type: Boolean, default: false },
  ratings: { type: Number, default: 0 },
  numOfReviews: { type: Number, default: 0 },
  images: [
    {
      public_id: { type: String, require: true },
      url: { type: String, required: true },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please enter room category'],
    enum: {
      values: ['King', 'Single', 'Twins'],
      message: 'Please select correct category for room',
    },
  },
  reviews: [
    {
      // A Single Review
      // user_id of a current single review
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id must be provided for a review'],
      },
      // name of a current single review
      name: {
        type: String,
        required: [true, 'A review should name of the user who created it'],
      },
      rating: {
        // like 5 stars, or 4 stars
        type: Number,
        required: [true, 'A review should rating'],
      },
      comment: {
        // Actual review
        type: String,
        require: [true, 'Review should have comment'],
      },
    },
  ],
  createdAt: {
    type: Date,
  },
});

roomSchema.pre('save', function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

type RoomModel = mongoose.Model<RoomDoc>;

const Room =
  (mongoose.models.Room as RoomModel) ||
  mongoose.model<RoomDoc, RoomModel>('Room', roomSchema);

export default Room;
