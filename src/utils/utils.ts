import Joi from 'joi';

export const registerUserSchema = Joi.object().keys({
    fullName: Joi.string().required(), 
    email: Joi.string().trim().lowercase().required(),
    gender: Joi.string().required(),
    phone: Joi.string().required().pattern(/^\d{11}$/),
    address: Joi.string().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({'any.only': '{{#label}} does not match'})
});

export const loginUserSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});

export const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
}

export const updateNoteSchema = Joi.object().keys({
    Title:Joi.string().required(),
    Description:Joi.string().required(),
    DueDate:Joi.date().required(),
    Status:Joi.string().valid('pending', 'in-progres', 'completed').required()
});

export const createNoteSchema = Joi.object().keys({
    Title:Joi.string().required(),
    Description:Joi.string().required(),
    DueDate:Joi.date().required(),
    Status:Joi.string().valid('pending', 'in-progres', 'completed').required()
});