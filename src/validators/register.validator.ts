import { checkSchema } from "express-validator";

export default checkSchema({
    // firstName: {
    //     errorMessage: "Invalid username",
    //     isEmail: true,
    // },
    // lastName: {
    //     isLength: {
    //         options: { min: 8 },
    //         errorMessage: "Password should be at least 8 chars",
    //     },
    // },
    email: {
        errorMessage: "Email is invalid",
        notEmpty: true,
    },
    // password: {
    //     isLength: {
    //         options: { min: 8 },
    //         errorMessage: "Password should be at least 8 chars",
    //     },
    // },
});
