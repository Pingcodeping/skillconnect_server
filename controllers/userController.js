const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, bio, skills } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, bio, skills });
  res.json(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user });
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password').populate('connections');
  res.json(user);
};
exports.sendConnectionRequest = async (req, res) => {
  const { targetId } = req.body;

  // Prevent self-request
  if (req.user.id === targetId) {
    return res.status(400).json({ message: "You can't connect with yourself" });
  }

  // Find the target user
  const targetUser = await User.findById(targetId);
  if (!targetUser) {
    return res.status(404).json({ message: "Target user not found" });
  }

  // Check if already connected
  if (targetUser.connections.includes(req.user.id)) {
    return res.status(400).json({ message: "You're already connected" });
  }

  // Check if already requested
  if (targetUser.connectionRequests.includes(req.user.id)) {
    return res.status(400).json({ message: 'Connection request already sent' });
  }

  // Add connection request
  targetUser.connectionRequests.push(req.user.id);
  await targetUser.save();

  res.status(200).json({ message: 'Connection request sent' });
};
  
  exports.acceptConnection = async (req, res) => {
    const { requesterId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.connectionRequests.includes(requesterId)) return res.status(400).json({ error: 'No such request' });
  
    user.connections.push(requesterId);
    user.connectionRequests = user.connectionRequests.filter(id => id.toString() !== requesterId);
    await user.save();
  
    const requester = await User.findById(requesterId);
    requester.connections.push(req.user.id);
    await requester.save();
  
    res.json({ message: 'Connection accepted' });
  };
  
  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}, 'name _id email bio'); // Select specific fields
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  

  // GET all connections of the logged-in user
exports.getconnectionsforuser = async (req, res) => {
  try {
    const {userId} = req.query;

    // Fetch the user with populated connections
    const user = await User.findById(userId).populate('connections', 'name email bio skills');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.connections);
  } catch (err) {
    console.error('Error fetching connections:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
