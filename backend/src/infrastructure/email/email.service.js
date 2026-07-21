import nodemailer from 'nodemailer';
import { config } from '../../config/env.js';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import escape from 'escape-html';
import { logger } from '../../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if we are in development mode
const isDev = config.env === 'development';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure, // false for 587, true for 465
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  // Allow self-signed certificates in development only
  tls: {
    rejectUnauthorized: !isDev, // true in production, false in development
  },
});

// Compile email templates
const templatesDir = path.join(__dirname, 'templates');
let notificationTemplate, autoReplyTemplate;

try {
  notificationTemplate = Handlebars.compile(
    fs.readFileSync(path.join(templatesDir, 'contactNotification.hbs'), 'utf8')
  );
  autoReplyTemplate = Handlebars.compile(
    fs.readFileSync(path.join(templatesDir, 'autoReply.hbs'), 'utf8')
  );
} catch (err) {
  logger.error({ err }, 'Failed to load email templates');
  // Fallback: use simple templates
  notificationTemplate = Handlebars.compile('<h2>New message</h2><p>{{name}} ({{email}})</p><p>{{{messageHtml}}}</p>');
  autoReplyTemplate = Handlebars.compile('<h2>Thank you</h2><p>We received your message.</p><p>{{{messageHtml}}}</p>');
}

const escapeData = (data) => {
  const escaped = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      escaped[key] = escape(value);
    } else {
      escaped[key] = value;
    }
  }
  return escaped;
};

export const emailService = {
  async sendRaw(to, subject, html, from = config.email.from) {
    if (!to) {
      throw new Error('Recipient email address is required');
    }
    if (!html) {
      throw new Error('Email HTML body is required');
    }
    try {
      const info = await transporter.sendMail({ from, to, subject, html });
      logger.info({ to, subject, messageId: info.messageId }, 'Email sent successfully');
      return info;
    } catch (err) {
      logger.error({ err, to, subject }, 'Failed to send email');
      throw err; // rethrow to let caller handle
    }
  },

  async sendContactNotification(toEmail, tenantName, formData) {
    if (!toEmail) {
      logger.warn({ tenantName }, 'No contact email provided for tenant; skipping notification');
      return;
    }
    const escaped = escapeData({ ...formData, tenantName });
    const messageHtml = escaped.message.replace(/\n/g, '<br>');
    const html = notificationTemplate({
      tenantName: escaped.tenantName,
      name: escaped.name,
      email: escaped.email,
      messageHtml,
    });
    await this.sendRaw(toEmail, `New contact message from ${escaped.tenantName}`, html);
  },

  async sendAutoReply(userEmail, userName, tenantName, userMessage) {
    if (!userEmail) {
      logger.warn('No user email provided for auto-reply');
      return;
    }
    const escaped = escapeData({ name: userName, tenantName, message: userMessage });
    const messageHtml = escaped.message.replace(/\n/g, '<br>');
    const html = autoReplyTemplate({
      name: escaped.name,
      tenantName: escaped.tenantName,
      messageHtml,
    });
    await this.sendRaw(userEmail, `Thank you for contacting ${escaped.tenantName}`, html);
  },
};
/*import nodemailer from 'nodemailer';
import { config } from '../../config/env.js';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import escape from 'escape-html';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const templatesDir = path.join(__dirname, 'templates');
const notificationTemplate = Handlebars.compile(
  fs.readFileSync(path.join(templatesDir, 'contactNotification.hbs'), 'utf8')
);
const autoReplyTemplate = Handlebars.compile(
  fs.readFileSync(path.join(templatesDir, 'autoReply.hbs'), 'utf8')
);

const escapeData = (data) => {
  const escaped = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      escaped[key] = escape(value);
    } else {
      escaped[key] = value;
    }
  }
  return escaped;
};

export const emailService = {
  async sendRaw(to, subject, html, from = config.email.from) {
    await transporter.sendMail({ from, to, subject, html });
  },

  async sendContactNotification(toEmail, tenantName, formData) {
    const escaped = escapeData({ ...formData, tenantName });
    const messageHtml = escaped.message.replace(/\n/g, '<br>');
    const html = notificationTemplate({
      tenantName: escaped.tenantName,
      name: escaped.name,
      email: escaped.email,
      messageHtml,
    });
    await this.sendRaw(toEmail, `New contact message from ${escaped.tenantName}`, html);
  },

  async sendAutoReply(userEmail, userName, tenantName, userMessage) {
    const escaped = escapeData({ name: userName, tenantName, message: userMessage });
    const messageHtml = escaped.message.replace(/\n/g, '<br>');
    const html = autoReplyTemplate({
      name: escaped.name,
      tenantName: escaped.tenantName,
      messageHtml,
    });
    await this.sendRaw(userEmail, `Thank you for contacting ${escaped.tenantName}`, html);
  },
};*/
/*// src/infrastructure/email/email.service.js
import nodemailer from 'nodemailer';
import { config } from '../../config/env.js';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import escape from 'escape-html';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// Load and compile templates
const templatesDir = path.join(__dirname, 'templates');
const notificationTemplate = Handlebars.compile(
  fs.readFileSync(path.join(templatesDir, 'contactNotification.hbs'), 'utf8')
);
const autoReplyTemplate = Handlebars.compile(
  fs.readFileSync(path.join(templatesDir, 'autoReply.hbs'), 'utf8')
);

// Helper to escape all user‑provided data
const escapeData = (data) => {
  const escaped = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      escaped[key] = escape(value);
    } else {
      escaped[key] = value;
    }
  }
  return escaped;
};

export const emailService = {
  async sendRaw(to, subject, html, from = config.email.from) {
    await transporter.sendMail({ from, to, subject, html });
  },

  async sendContactNotification(toEmail, tenantName, formData) {
    const escaped = escapeData({ ...formData, tenantName });
    // Convert newlines to <br> for message
    const messageHtml = escaped.message.replace(/\n/g, '<br>');
    const html = notificationTemplate({
      tenantName: escaped.tenantName,
      name: escaped.name,
      email: escaped.email,
      messageHtml,
    });
    await this.sendRaw(toEmail, `New contact message from ${escaped.tenantName}`, html);
  },

  async sendAutoReply(userEmail, userName, tenantName, userMessage) {
    const escaped = escapeData({ name: userName, tenantName, message: userMessage });
    const messageHtml = escaped.message.replace(/\n/g, '<br>');
    const html = autoReplyTemplate({
      name: escaped.name,
      tenantName: escaped.tenantName,
      messageHtml,
    });
    await this.sendRaw(userEmail, `Thank you for contacting ${escaped.tenantName}`, html);
  },
};*/


/*import nodemailer from 'nodemailer';
import { config } from '../../config/env.js';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  // Removed insecure rejectUnauthorized: false
});

export const emailService = {
  async sendRaw(to, subject, html, from = config.email.from) {
    await transporter.sendMail({ from, to, subject, html });
  },

  async sendContactNotification(toEmail, tenantName, formData) {
    const subject = `New contact message from ${tenantName}`;
    const html = `
      <h2>New contact form submission</h2>
      <p><strong>Tenant:</strong> ${tenantName}</p>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.message.replace(/\n/g, '<br>')}</p>
    `;
    await this.sendRaw(toEmail, subject, html);
  },

  async sendAutoReply(userEmail, userName, tenantName, userMessage) {
    const subject = `Thank you for contacting ${tenantName}`;
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Hello ${userName},</h2>
        <p>Thank you for reaching out to <strong>${tenantName}</strong>. We will get back to you soon.</p>
        <p>Your message:</p>
        <blockquote>${userMessage.replace(/\n/g, '<br>')}</blockquote>
        <p>Best regards,<br>${tenantName} Team</p>
      </div>
    `;
    await this.sendRaw(userEmail, subject, html);
  },
};*/