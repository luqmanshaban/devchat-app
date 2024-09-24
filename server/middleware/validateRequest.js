import Joi from "joi";

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.json({ error: error.details[0].message }).status(400);
    }
    next();
  };
};

const userSchema = Joi.object({
  firstname: Joi.string()
    // .pattern(new RegExp("^[a-zA-Z]+$"))
    .min(1)
    .max(30)
    .required(),
  lastname: Joi.string()
    // .pattern(new RegExp("^[a-zA-Z]+$"))
    .min(1)
    .max(30)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().min(3).required(),
  plan: Joi.string().valid("basic", "premium").default("basic"),
  role: Joi.string(),
});

export { validateRequest, userSchema };
