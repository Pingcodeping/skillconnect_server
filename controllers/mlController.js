const User = require('../models/User');
const cosineSimilarity = require('compute-cosine-similarity');

const recommendConnections = async (req, res) => {
  const userId = req.body.userId;

  const currentUser = await User.findById(userId).populate('connections');

  if (!currentUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const allUsers = await User.find({ _id: { $ne: userId } });

  const currentSkills = currentUser.skills || [];
  const currentConnections = currentUser.connections.map(conn => conn._id.toString());

  const skillSet = [...new Set(allUsers.flatMap(u => u.skills).concat(currentSkills))];

  const vectorize = (userSkills) =>
    skillSet.map(skill => userSkills.includes(skill) ? 1 : 0);

  const currentVector = vectorize(currentSkills);

  const similarities = allUsers
    .map(user => {
      const userVector = vectorize(user.skills || []);
      const similarity = cosineSimilarity(currentVector, userVector);
      return {
        _id: user._id,
        name: user.name,
        skills:user.skills,
        bio: user.bio,
        email: user.email,
        similarity
      };
    })
    .filter(u => !currentConnections.includes(u._id.toString())) // remove existing connections
    .sort((a, b) => b.similarity - a.similarity) // sort by similarity
    .slice(0,3); // return top 5

  res.json({ suggestedUsers: similarities });
};

module.exports = { recommendConnections };
