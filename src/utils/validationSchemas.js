const yup = require('yup');

module.exports.BOOK_VALIDATION_SCHEMA = yup.object().shape({
    title: yup.string().trim().min(2).max(255).required(),
    description: yup.string().trim().nullable(),
    image: yup.string().trim().nullable(),
});

module.exports.AUTHOR_VALIDATION_SCHEMA = yup.object().shape({
    full_name: yup.string().trim().min(2).max(255).required(),
    email: yup.string().email().required(),
});

module.exports.CUSTOMER_VALIDATION_SCHEMA = yup.object().shape({
    full_name: yup.string().trim().min(2).max(255).required(),
    email: yup.string().email().nullable(),
    phone: yup.string().nullable(),
    password: yup.string().min(2).max(255).required(),
});
