const passport = require('passport');
const jwt = require('jsonwebtoken');
const MasterUser = require('../models/MasterUser');
const connectDB = require('../config/db');

/*
const setTokenCookie = (res, userId, role, tenantId = null) => {
  const token = jwt.sign(
    { id: userId, role, tenantId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};*/
const setTokenCookie = (res, userId, role, tenantId = null, isMaster = false) => {
  const token = jwt.sign(
    { id: userId, role, tenantId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };
  res.cookie('token', token, cookieOptions);
  if (isMaster) {
    // Store a separate master token that never gets overwritten by tenant switching
    res.cookie('master_token', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
};

// Tenant user OAuth – initial redirect (uses 'google' strategy)
exports.googleAuth = (req, res, next) => {
  const state = req.tenant.dbName;
  const authenticator = passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state
  });
  authenticator(req, res, next);
};

// Tenant user OAuth – callback
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      const tenantId = req.query.state;
      if (!tenantId) throw new Error('Missing tenant');

      const tenantConn = await connectDB(tenantId);
      const User = tenantConn.model('User', require('../models/User'));

      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          user.authProvider = 'google';
          await user.save();
        } else {
          user = new User({
            username: profile.displayName.replace(/\s/g, '').toLowerCase(),
            email: profile.emails[0].value,
            googleId: profile.id,
            authProvider: 'google',
            role: 'editor',
            active: true
          });
          await user.save();
        }
      }

      setTokenCookie(res, user._id, user.role, tenantId);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
};

// ========== MASTER OAUTH – USE 'google-master' STRATEGY ==========
exports.masterGoogleAuth = passport.authenticate('google-master', {   // ✅ fixed
  scope: ['profile', 'email']
});

exports.masterGoogleCallback = (req, res, next) => {
  passport.authenticate('google-master', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      let master = await MasterUser.findOne({ googleId: profile.id });
      if (!master) {
        const allowedEmails = (process.env.MASTER_EMAILS || '').split(',');
        if (!allowedEmails.includes(profile.emails[0].value)) {
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=not_authorized`);
        }
        master = new MasterUser({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id
        });
        await master.save();
      }

      setTokenCookie(res, master._id, 'superadmin', null, true);
      return res.redirect(`${process.env.FRONTEND_URL}/master/tenants`);
    } catch (error) {
      console.error('Master OAuth error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
};

/*const passport = require('passport');
const jwt = require('jsonwebtoken');
const MasterUser = require('../models/MasterUser');
const connectDB = require('../config/db');  // ✅ fixed path

const setTokenCookie = (res, userId, role, tenantId = null) => {
  const token = jwt.sign(
    { id: userId, role, tenantId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};

// Tenant user OAuth – initial redirect
exports.googleAuth = (req, res, next) => {
  const state = req.tenant.dbName;   // tenant dbName as state
  const authenticator = passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state
  });
  authenticator(req, res, next);
};

// Tenant user OAuth – callback
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      const tenantId = req.query.state;
      if (!tenantId) throw new Error('Missing tenant');

      const tenantConn = await connectDB(tenantId);
      const User = tenantConn.model('User', require('../models/User'));

      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          user.authProvider = 'google';
          await user.save();
        } else {
          user = new User({
            username: profile.displayName.replace(/\s/g, '').toLowerCase(),
            email: profile.emails[0].value,
            googleId: profile.id,
            authProvider: 'google',
            role: 'editor',
            active: true
          });
          await user.save();
        }
      }

      setTokenCookie(res, user._id, user.role, tenantId);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      // Log the full error stack and message
      console.error(error.stack);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
};

// Master OAuth – initial redirect
exports.masterGoogleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// Master OAuth – callback
exports.masterGoogleCallback = async (req, res, next) => {
  passport.authenticate('google-master', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      let master = await MasterUser.findOne({ googleId: profile.id });
      if (!master) {
        const allowedEmails = (process.env.MASTER_EMAILS || '').split(',');
        if (!allowedEmails.includes(profile.emails[0].value)) {
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=not_authorized`);
        }
        master = new MasterUser({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id
        });
        await master.save();
      }

      setTokenCookie(res, master._id, 'superadmin', null);
      return res.redirect(`${process.env.FRONTEND_URL}/master/tenants`);

    } catch (error) {
      console.error('Master OAuth error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
};*/
// Master OAuth – callback
/*exports.masterGoogleCallback = async (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, profile, info) => {
    if (err || !profile) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      let master = await MasterUser.findOne({ googleId: profile.id });
      if (!master) {
        const allowedEmails = (process.env.MASTER_EMAILS || '').split(',');
        if (!allowedEmails.includes(profile.emails[0].value)) {
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=not_authorized`);
        }
        master = new MasterUser({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id
        });
        await master.save();
      }

      setTokenCookie(res, master._id, 'superadmin', null);
      return res.redirect(`${process.env.FRONTEND_URL}/master/tenants`);
    } catch (error) {
      console.error('Master OAuth error:', error);
      // Log the full error stack and message
      console.error(error.stack);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  })(req, res, next);
};*/