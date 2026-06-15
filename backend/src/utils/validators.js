import { body, param, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({ errors: errors.array() });
  };
};

export const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const loginValidation = [
  body('email').isEmail(),
  body('password').notEmpty()
];

export const videoUploadValidation = [
  body('title').notEmpty(),
  body('category').notEmpty()
];

export const commentValidation = [
  body('content').notEmpty().isLength({ max: 500 })
];

export const idParamValidation = [
  param('id').isInt().withMessage('Invalid video ID')
];
