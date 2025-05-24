const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    // firstname: Joi.string().required(),
    // lastname: Joi.string().required(),
    name: Joi.string().required(),
    company_role: Joi.string().required(),
  },).unknown(true),
};

const getUsers = {
  query: Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      // password: Joi.string().custom(password),
      name: Joi.string(),
      userId: Joi.string(),
      team: Joi.string(),
      lineManagers: Joi.string(),
      blendedRate: Joi.string(),
      access: Joi.string().valid('General', 'Everything', 'Admin', 'Project Management', 'Directors', 'Operational Director'),
      company_role: Joi.string(),
      company_name: Joi.string(),
    })
    .min(1)
    .unknown(true),
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
