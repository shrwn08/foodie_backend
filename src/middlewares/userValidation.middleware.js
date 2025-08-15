import userSchema from "../validation/user.validation.js";

const userValidation = (req, res, next) => {
    const {error, value} = userSchema.validate(req.body);

    if(error) return res.status(400).json({error : error.details});
    next();
};

export default userValidation;
