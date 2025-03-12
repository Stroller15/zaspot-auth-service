import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        in: ["body"],
        trim: true,
        errorMessage: "Email is required",
        isEmail: {
            errorMessage: "Email must be a valid email address",
        },
        notEmpty: {
            errorMessage: "Email can't be empty",
        },
        normalizeEmail: true,
    },
    password: {
        in: ["body"],
        trim: true,
        errorMessage: "Password is required",
        isString: {
            errorMessage: "Password must be a valid string",
        },
        notEmpty: {
            errorMessage: "Password can't be empty",
        },
        isLength: {
            options: { min: 8 },
            errorMessage: "Password should be atleast 8 characters",
        },
        matches: {
            options: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
            errorMessage:
                "Password must include one uppercase letter, one lowercase letter, one number, and one special character",
        },
    },
});
