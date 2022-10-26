import User from '../models/user';
import { catchAsync } from '../utils/catch-async';
import cd from 'cloudinary';
import { CustomError } from '../utils/custom-error';

// Setting up cloudinary config
const cloudinary = cd.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});
const DEFAULT_IMAGE_URL = '/images/default_avatar.jpg';

export const signup = catchAsync(async (req, res) => {
  const randomId = Math.random().toString(36).substr(2, 15);
  let result = {
    public_id: randomId,
    secure_url: DEFAULT_IMAGE_URL,
  };

  if (req.body.avatar) {
    result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: 'bookit/avatar',
      transformation: {
        width: '150',
        crop: 'scale',
      },
    });
  }

  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
    avatar: { public_id: result.public_id, url: result.secure_url },
  });

  res.status(200).json({
    success: true,
    message: 'User registered successfully',
  });
});

// requireAuth middleware runs before this
export const getCurrentUser = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  res.status(200).json({ success: true, user });
});

export const deleteAllUsers = catchAsync(async (req, res) => {
  await User.deleteMany({});
  res.status(200).json({ success: true, message: 'All users deleted' });
});

// THESE ROUTES REQUIRES "ID"
// requireAuth middleware runs before this
// /api/me/update
export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });

  if (!user) {
    return next(new CustomError('User currently does not exist', 400));
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.password) user.password = req.body.password;
  if (req.body.role) user.role = req.body.role;

  if (req.body.avatar) {
    // this will only happen if user provided an avatar
    const previousImageId = user.avatar.public_id;
    const previousImageUrl = user.avatar.url;

    // destroy the user's previous image, and replace that with user's new image
    if (previousImageUrl !== DEFAULT_IMAGE_URL) {
      await cloudinary.uploader.destroy(previousImageId);
    }

    const result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: 'bookit/avatar',
      transformation: {
        width: '150',
        crop: 'scale',
      },
    });

    user.avatar.public_id = result.public_id;
    user.avatar.url = result.secure_url;
  }

  await user.save();
  res.status(200).json({ success: true, message: 'User updated successfully' });
});