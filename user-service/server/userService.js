const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.RegisterUser = async (call, callback) => {
  try {
    const { firstName, lastName, email, password } = call.request;

    // Check if user with same email already exists
    let user = await User.findOne({ email });
    if (user) {
      return callback({ code: grpc.status.ALREADY_EXISTS, message: 'User already exists' });
    }

    // Hash password before storing in database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    callback(null, { message: 'User registered successfully' });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

exports.LoginUser = async (call, callback) => {
  try {
    const { email, password } = call.request;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return callback({ code: grpc.status.NOT_FOUND, message: 'Invalid email or password' });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return callback({ code: grpc.status.INVALID_ARGUMENT, message: 'Invalid email or password' });
    }

    // Create a JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    callback(null, { message: 'Logged in successfully', token });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

exports.GetUser = async (call, callback) => {
  try {
    const { id } = call.request;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return callback({ code: grpc.status.NOT_FOUND, message: 'User not found' });
    }

    callback(null, user);
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

exports.UpdateUser = async (call, callback) => {
  try {
    const { id, ...updateData } = call.request;
    
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      return callback({ code: grpc.status.NOT_FOUND, message: 'User not found' });
    }

    callback(null, user);
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};
