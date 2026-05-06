const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    console.log('LOGIN attempt:', req.body.username);
    try {
        const { username, password } = req.body;

        const User = req.models.User;
        const ActivityLog = req.models.ActivityLog;

        const user = await User.findOne({
            $or: [{ username }, { email: username }],
            active: true
        }).select('+password');

        if (!user) {
            console.warn(' User not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await user.comparePassword(password);

        if (!isValid) {
            console.warn(' Invalid password');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log(' Login success:', user.username);

        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });

        // Updated action and added label
        await ActivityLog.create({
            action: 'user_login',
            label: `User ${user.username} logged in`,
            user: user.username,
            userId: user._id
        });

        res.json({ user });
    } catch (error) {
        console.error('LOGIN ERROR:', error.stack);
        res.status(500).json({ error: error.message });
    }
};

/*
// Also update logout if implemented
exports.logout = async (req, res) => {
    try {
        const ActivityLog = req.models.ActivityLog;
        if (req.user) {
            await ActivityLog.create({
                action: 'user_logout',
                label: `User ${req.user.username} logged out`,
                user: req.user.username,
                userId: req.user.id
            });
        }
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error.stack);
        res.status(500).json({ error: error.message });
    }
};*/
exports.logout = async (req, res) => {
    try {
        // Safely attempt to log the logout event only if models exist and user is not superadmin
        if (req.models && req.models.ActivityLog && req.user && req.user.role !== 'superadmin') {
            try {
                const User = req.models.User;
                if (User && req.user.id) {
                    const user = await User.findById(req.user.id).select('username');
                    if (user) {
                        await req.models.ActivityLog.create({
                            action: 'user_logout',
                            label: `User ${user.username} logged out`,
                            user: user.username,
                            userId: req.user.id
                        });
                    }
                }
            } catch (logErr) {
                console.error('Failed to log logout action:', logErr);
                // Non‑critical, continue clearing cookie
            }
        }
        // Clear the JWT cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        res.clearCookie('switched_from_master'); // Clear the master switch flag cookie if it exists
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error.stack);
        // Even on error, attempt to clear cookie
        res.clearCookie('token');
        res.status(500).json({ error: error.message });
    }
};

/*
exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.models || !req.models.User) {
            return res.status(500).json({ error: 'Models not attached' });
        }
        const user = await req.models.User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};*/
exports.getCurrentUser = async (req, res) => {
    try {
        // Superadmin: fetch from MasterUser model (master DB)
        if (req.user.role === 'superadmin') {
            const MasterUser = require('../models/MasterUser');
            const master = await MasterUser.findById(req.user.id);
            if (!master) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Return a consistent shape expected by the frontend
            return res.json({
                _id: master._id,
                username: master.email.split('@')[0],
                email: master.email,
                role: 'superadmin',
                name: master.name,
                avatar: master.avatar
            });
        }

        // Normal tenant user
        if (!req.models || !req.models.User) {
            return res.status(500).json({ error: 'Models not attached' });
        }
        const user = await req.models.User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.switchToMaster = async (req, res) => {
  try {
    const masterToken = req.cookies.master_token;
    if (!masterToken) {
      return res.status(401).json({ error: 'No master session found' });
    }
    const decoded = jwt.verify(masterToken, process.env.JWT_SECRET);
    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ error: 'Not a master session' });
    }
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role, tenantId: null },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    // 👇 Clear the flag cookie
    res.clearCookie('switched_from_master', { path: '/' });
    res.json({ success: true });
  } catch (error) {
    console.error('Switch to master error:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await req.models.User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isValid = await user.comparePassword(currentPassword);
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/*const jwt = require('jsonwebtoken');

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const User = req.models.User;
    const ActivityLog = req.models.ActivityLog;
    
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }],
      active: true 
    }).select('+password'); // ✅ include password field
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await ActivityLog.create({
      action: 'user_login',
      label: 'User logged in',
      detail: `User ${user.username} logged in`,
      user: user.username,
      userId: user._id,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const ActivityLog = req.models.ActivityLog;
    if (req.user) {
      await ActivityLog.create({
        action: 'user_logout',
        label: 'User logged out',
        detail: `User ${req.user.username} logged out`,
        user: req.user.username,
        userId: req.user.id
      });
    }
    
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const User = req.models.User;
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const User = req.models.User;
    const user = await User.findById(req.user.id).select('+password'); // include password for compare
    
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/
/*const jwt = require('jsonwebtoken');

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Use models from req (attached by tenant middleware)
    const User = req.models.User;
    const ActivityLog = req.models.ActivityLog;
    
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }],
      active: true 
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Log activity
    await ActivityLog.create({
      action: 'user_login',
      label: 'User logged in',
      detail: `User ${user.username} logged in`,
      user: user.username,
      userId: user._id,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const ActivityLog = req.models.ActivityLog;
    if (req.user) {
      await ActivityLog.create({
        action: 'user_logout',
        label: 'User logged out',
        detail: `User ${req.user.username} logged out`,
        user: req.user.username,
        userId: req.user.id
      });
    }
    
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const User = req.models.User;
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const User = req.models.User;
    const user = await User.findById(req.user.id);
    
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/
/*const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const jwt = require('jsonwebtoken');

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }],
      active: true 
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { 
        id: user._id,
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Log activity
    await ActivityLog.create({
      action: 'user_login',
      label: 'User logged in',
      detail: `User ${user.username} logged in`,
      user: user.username,
      userId: user._id,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    if (req.user) {
      await ActivityLog.create({
        action: 'user_logout',
        label: 'User logged out',
        detail: `User ${req.user.username} logged out`,
        user: req.user.username,
        userId: req.user.id
      });
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/