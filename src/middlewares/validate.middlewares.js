import { validateRegistrationData, validateLoginData, checkEmailFormat, checkPasswordFormat } from "../utils/validateUserData.js";

function validateRegistration (req, res, next) {  
  const { errors, sanitizedData } = validateRegistrationData(req.body);
  
  if (errors) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  req.sanitizedData = sanitizedData;
  next();
};

function validateLogin (req, res, next) {
  const { errors, sanitizedData } = validateLoginData(req.body);

  if (errors) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  req.sanitizedData = sanitizedData;
  next();
}

function validateEmail(req, res, next) {
  try {
    const userEmail = checkEmailFormat(req.body.email);
    req.body.email = userEmail;
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

function validatePassword(req, res, next) {
  try {
    const newPassword = checkPasswordFormat(req.body.newPassword);
    req.body.newPassword = newPassword;
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export { 
  validateRegistration, 
  validateLogin, 
  validateEmail,
  validatePassword
};
