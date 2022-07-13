module.exports = function (app) {
    const passportMiddleware = require('../middleware/passport.middleware');
    const validatorMiddleware = require('../middleware/validator.middleware');
    const { check } = require('express-validator');

    const categories = require('../controllers/category.controller');

    // GET ALL
    app.get('/api/categories', passportMiddleware.applyBearerStrategy, categories.findAll);

    // GET BY ID
    app.get('/api/categories/:_id', passportMiddleware.applyBearerStrategy, categories.findOne);

    // CREATE
    app.post(
        '/api/categories', //
        check('title', 'Must be at least 2 and lesser than 50 chars long')
            .isLength({ min: 2 })
            .withMessage('Must be at least 2 chars long')
            .isLength({ max: 50 })
            .withMessage('Must be lesser than 50 chars long')
            .not()
            .isEmpty()
            .trim(),
        validatorMiddleware.verifyValidations,
        passportMiddleware.applyBearerStrategy,
        categories.create,
    );

    // DELETE
    app.delete('/api/categories/:_id', passportMiddleware.applyBearerStrategy, categories.delete);
};
