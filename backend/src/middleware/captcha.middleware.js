import axios from 'axios';
import { config } from '../config/env.js';
import { ValidationError } from '../shared/errors/ValidationError.js';
import { logger } from '../config/logger.js';

const { enabled, secretKey } = config.recaptcha;

export const verifyRecaptcha = async (token, ip) => {
  if (!enabled) {
    logger.debug('reCAPTCHA disabled, skipping verification');
    return true;
  }
  if (!token) {
    throw new ValidationError('reCAPTCHA token missing');
  }
  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token,
          remoteip: ip,
        },
      }
    );
    const { success, score, action } = response.data;
    if (!success || score < 0.5) {
      logger.warn({ token, score, action, ip }, 'reCAPTCHA verification failed');
      return false;
    }
    return true;
  } catch (error) {
    logger.error({ error, token }, 'reCAPTCHA verification error');
    throw new ValidationError('reCAPTCHA verification failed');
  }
};

export const recaptchaValidator = (field = 'recaptchaToken') => {
  return async (value, { req }) => {
    const token = req.body[field];
    const ip = req.ip || req.connection.remoteAddress;
    const valid = await verifyRecaptcha(token, ip);
    if (!valid) {
      throw new Error('reCAPTCHA validation failed');
    }
    return true;
  };
};