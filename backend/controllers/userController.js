// controllers/userController.js
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  console.log('👥 [Users] GET all');

  try {
    const User = req.models.User;
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('❌ Users error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  console.log('👥 [Users] CREATE');

  try {
    const User = req.models.User;
    const ActivityLog = req.models.ActivityLog;
    const { username, email, password, role, active = true } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      active
    });

    // Log activity
    await ActivityLog.create({
      action: 'user_create',
      label: `Created user ${username}`,
      user: req.user?.username
    });

    // Return user without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Create user error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  console.log(`👥 [Users] UPDATE: ${req.params.id}`);

  try {
    const User = req.models.User;
    const ActivityLog = req.models.ActivityLog;
    const { id } = req.params;
    const { username, email, role, active, password } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (active !== undefined) user.active = active;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Log activity
    await ActivityLog.create({
      action: 'user_update',
      label: `Updated user ${user.username}`,
      user: req.user?.username
    });

    // Return user without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Update user error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  console.log(`👥 [Users] DELETE: ${req.params.id}`);

  try {
    const User = req.models.User;
    const ActivityLog = req.models.ActivityLog;
    const { id } = req.params;

    // Prevent deleting yourself
    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Log activity
    await ActivityLog.create({
      action: 'user_delete',
      label: `Deleted user ${user.username}`,
      user: req.user?.username
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Delete user error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  console.log(`👥 [Users] TOGGLE STATUS: ${req.params.id}`);

  try {
    const User = req.models.User;
    const ActivityLog = req.models.ActivityLog;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent disabling yourself
    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'Cannot change your own status' });
    }

    user.active = !user.active;
    await user.save();

    // Log activity
    await ActivityLog.create({
      action: 'user_toggle_status',
      label: `${user.active ? 'Enabled' : 'Disabled'} user ${user.username}`,
      user: req.user?.username,
      userId: req.user?.id
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Toggle user status error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};
/*exports.getAllUsers = async (req, res) => {
  console.log('👥 [Users] GET');

  try {
    const User = req.models.User;

    const users = await User.find().select('-password');

    res.json(users);

  } catch (error) {
    console.error('❌ Users error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};*/
/*const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }
    
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'viewer',
      active: true
    });

    await ActivityLog.create({
      action: 'user_create',
      label: 'New user created',
      detail: `User ${username} created with role ${role}`,
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.status(201).json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Don't allow password update through this endpoint
    delete updates.password;
    
    const user = await User.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await ActivityLog.create({
      action: 'user_update',
      label: 'User updated',
      detail: `User ${user.username} updated`,
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await ActivityLog.create({
      action: 'user_delete',
      label: 'User deleted',
      detail: `User ${user.username} deleted`,
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle user active status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.active = !user.active;
    await user.save();

    await ActivityLog.create({
      action: 'user_update',
      label: `User ${user.active ? 'activated' : 'deactivated'}`,
      detail: `User ${user.username} ${user.active ? 'activated' : 'deactivated'}`,
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/