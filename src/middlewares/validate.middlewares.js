import validateUserData from "../utils/validateUserData.js";

const validateRegistration = (req, res, next) => {
  const { errors, sanitizedData } = validateUserData(req.body);
  
  if (errors) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Attach sanitized data to request object
  req.sanitizedData = sanitizedData;
  next();
};

export default validateRegistration;
