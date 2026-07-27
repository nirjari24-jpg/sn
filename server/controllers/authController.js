import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { UserProfile } from '../models/schemas.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { email, password, full_name } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      full_name,
    });

    if (user) {
      res.status(201).json({
        id: user._id,
        email: user.email,
        name: user.full_name,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id,
        email: user.email,
        name: user.full_name,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (user) {
      res.json({
        id: user._id,
        email: user.email,
        name: user.full_name,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


export const getUserState = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userProfile = await UserProfile.findOne({ email: user.email });
    res.json({ state: userProfile?.state || {} });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get state' });
  }
};

export const updateUserState = async (req, res) => {
  try {
    const { state } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await UserProfile.findOneAndUpdate(
      { email: user.email },
      { state, last_active: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update state' });
  }
};
