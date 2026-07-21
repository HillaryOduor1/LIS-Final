import { body } from 'express-validator';
import { recaptchaValidator } from '../../../middleware/captcha.middleware.js';
import { config } from '../../../config/env.js';

export const submitContactValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters')
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .custom((value) => {
      if (/[\r\n]/.test(value)) {
        throw new Error('Invalid email format');
      }
      return true;
    }),
  body('message')
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Message must be 5-2000 characters')
    .escape(),
  body('hp')
    .optional()
    .custom((value) => {
      if (value && value.length > 0) {
        throw new Error('Spam detected');
      }
      return true;
    }),
  body('recaptchaToken')
    .optional()
    .custom(recaptchaValidator('recaptchaToken'))
    .withMessage('reCAPTCHA verification failed'),
];
/*import { body } from 'express-validator';

export const submitContactValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters')
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('message')
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Message must be 5-2000 characters')
    .escape(),
];*/