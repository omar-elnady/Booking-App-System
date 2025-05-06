import joi from "joi";

export const validation = (schema, considerHeaders = false) => {
  return (req, res, next) => {
    let inputsData = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files) {
      inputsData.file = req.file || req.files;
    }
    if (req.headers.authorization && considerHeaders) {
      inputsData = { authorization: req.headers.authorization };
    }
    const validationResult = schema.validate(inputsData, { abortEarly: false });
    if (validationResult.error?.details) {
      return res.status(400).json({
        message: "Validation Err",
        validationErr: validationResult.error.details,
      });
    }
    return next();
  };
};
