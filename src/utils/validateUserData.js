import Joi from 'joi';

function validateRegistrationData(userData) {
  const schema = Joi.object({
    firstname: Joi.string()
      .trim()
      .required()
      .max(50)
      .pattern(/^[a-zA-Z\s-']+$/)
      .messages({
        'string.empty': 'First name is required',
        'string.max': 'First name cannot exceed 50 characters',
        'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes',
      }),
    lastname: Joi.string()
      .trim()
      .required()
      .max(50)
      .pattern(/^[a-zA-Z\s-']+$/)
      .messages({
        'string.empty': 'Last name is required',
        'string.max': 'Last name cannot exceed 50 characters',
        'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes',
      }),
    username: Joi.string()
      .trim()
      .required()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_-]+$/)
      .messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'string.pattern.base': 'Username can only contain letters, numbers, underscores, and hyphens',
      }),
    email: Joi.string()
      .trim()
      .required()
      .email()
      .max(255)
      .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"email")
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
        'string.max': 'Email is too long',
      }),
    password: Joi.string()
      .required()
      .min(8)
      .max(128)
      .pattern(/(?=.*[a-z])/, 'lowercase')
      .pattern(/(?=.*[A-Z])/, 'uppercase')
      .pattern(/(?=.*\d)/, 'number')
      .pattern(/(?=.*[!@#$%^&*])/, 'special character')
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'string.pattern.name': 'Password must contain at least one {#name}',
      }),
    role: Joi.string()
      .valid('student', 'teacher')
      .required()
      .messages({
        'string.empty': 'Role is required',
        'any.only': 'Role must be either student or teacher',
      }),
  });

  const { error, value } = schema.validate(userData, { abortEarly: false });

  if (error) {
    const errors = error.details.reduce((acc, detail) => {
      acc[detail.context.key] = detail.message;
      return acc;
    }, {});

    return { errors, sanitizedData: null };
  }

  return { errors: null, sanitizedData: value };
};

function validateLoginData(userData){
  const schema = Joi.object({
    username: Joi.string()
      .trim()
      .required()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z0-9_-]+$/)
      .messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'string.pattern.base': 'Username can only contain letters, numbers, underscores, and hyphens',
      }),
      password: Joi.string()
      .required()
      .min(8)
      .max(128)
      .pattern(/(?=.*[a-z])/, 'lowercase')
      .pattern(/(?=.*[A-Z])/, 'uppercase')
      .pattern(/(?=.*\d)/, 'number')
      .pattern(/(?=.*[!@#$%^&*])/, 'special character')
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'string.pattern.name': 'Password must contain at least one {#name}',
      }),
      rememberMe: Joi.boolean().optional()
  });
  const { error, value } = schema.validate(userData, { abortEarly: false });

  if (error) {
    const errors = error.details.reduce((acc, detail) => {
      acc[detail.context.key] = detail.message;
      return acc;
    }, {});
    return { errors, sanitizedData: null };
  }
  console.log("validate login data: ", value);
  return { errors: null, sanitizedData: value };
}

function checkEmailFormat(email) {
  const schema = Joi.string()
    .trim()
    .email({ tlds: { allow: true } })
    .required()
    .max(255)
    .pattern(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "email"
    )
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
      "string.pattern.name": "Email must be a valid format (e.g., example@domain.com)",
    });

  const { error, value } = schema.validate(email, { abortEarly: false });

  if (error) {
    throw new Error(error.details[0].message);
  }

  return value;
}



export { 
  validateRegistrationData, 
  validateLoginData, 
  checkEmailFormat
};
