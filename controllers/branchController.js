const Branch = require('../models/Branch');
const User = require('../models/User'); // Import the User model

// Get list of branches with pagination and user information
const getBranches = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Find branches and join with User table to get user details
    const branches = await Branch.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      include: [
        {
          model: User,
          as: 'user', // Alias for the relationship
          attributes: ['first_name', 'last_name', 'email', 'role'], // Select the user details to include
        },
      ],
    });

    const totalPages = Math.ceil(branches.count / limit);

    // Map branches to include user information
    const branchesWithUserInfo = branches.rows.map((branch) => ({
      ...branch.toJSON(),
      user: branch.user, // Include the associated user information
    }));

    return res.json({
      branches: branchesWithUserInfo,
      totalPages,
      currentPage: page,
      totalBranches: branches.count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve branches' });
  }
};

// Get a specific branch by ID
const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user', // Alias for the relationship
          attributes: ['first_name', 'last_name', 'email', 'role'], // Select user details to include
        },
      ],
    });

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    return res.json(branch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve branch' });
  }
};

// Create a new branch
const createBranch = async (req, res) => {
  try {
    const { name, year, make, model, employee_id } = req.body;

    // Validate input
    if (!name || !year || !make || !model || !employee_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBranch = await Branch.create({
      name,
      year,
      make,
      model,
      employee_id,
    });

    return res.status(201).json({ message: 'Branch created successfully', branch: newBranch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create branch' });
  }
};

// Update a branch
const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year, make, model, employee_id } = req.body;

    // Ensure only Super Admin can update branches (if needed)
    if (req.user.role !== 'Super Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Update branch details
    await branch.update({
      name,
      year,
      make,
      model,
      employee_id,
    });

    return res.json({ message: 'Branch updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update branch' });
  }
};

// Delete a branch
const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure only Super Admin can delete branches (if needed)
    if (req.user.role !== 'Super Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Delete the branch
    await branch.destroy();

    return res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete branch' });
  }
};

module.exports = {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
