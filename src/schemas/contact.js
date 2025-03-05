import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),

  phoneNumber: Joi.string().min(3).max(20).required(),

  email: Joi.string().email().min(3).max(20).optional(),

  isFavourite: Joi.boolean().optional(),

  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .optional(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),

  phoneNumber: Joi.string().min(3).max(20).optional(),

  email: Joi.string().email().min(3).max(20).optional(),

  isFavourite: Joi.boolean().optional(),

  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
});
