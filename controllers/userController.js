const User = require('../models/User');
const { Op } = require('sequelize');

// Get list of users with pagination
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
    });

    const totalPages = Math.ceil(users.count / limit);

    return res.json({
      users: users.rows,
      totalPages,
      currentPage: page,
      totalUsers: users.count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

// Get a specific user by id
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve user' });
  }
};

// Update user information (only for Super Admin role)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role } = req.body;

    // Ensure only Super Admin can update users
    if (req.user.role !== 'Super Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('user', first_name, last_name, email, role)

    // Update user details
    await user.update({
      first_name,
      last_name,
      email,
      role,
    });

    return res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Delete a user (only for Super Admin role)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure only Super Admin can delete users
    if (req.user.role !== 'Super Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('dd')
    // Delete the user
    await user.destroy();
    console.log('22')


    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'User has active branch' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
