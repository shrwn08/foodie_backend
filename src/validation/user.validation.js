const joi = require('joi');

const userSchama = joi.object({
    name : joi.string().min(2).max(17).required(),
    username : joi.string().min(3).max(17).required(),
    email: joi.string().email({minDomainSegments: 2 }).required(),
    password: joi.string().min(8).max(20).required(),
})

module.exports = userSchama;