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
