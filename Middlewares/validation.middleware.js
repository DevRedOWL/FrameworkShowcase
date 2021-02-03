const { body, query, params, headers, validationResult } = require('express-validator');
const resModel = require('../Models/responseModel');

let validate = (validations) =>
  async (req, res, next) => {
    try {
      if (validations && validations.length)
        await Promise.all(validations.map(validation => validation.run(req)));

      const result = validationResult(req);
      if (result.isEmpty()) {
        return next();
      }

      let err = result.errors[0];
      res.status(400).send(new resModel.ErrorModel(`Argument "${err.param}" is incorrect: ${err.msg}`));
    }
    catch (ex) {
      res.status(400).send(new resModel.ErrorModel(`Validation parameters error`));
    }
  };

module.exports = {
  body: body,
  query: query,
  params: params,
  headers: headers,
  validate: validate
};