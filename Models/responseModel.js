'use strict';

/**
 * Base response model
 * @property {boolean} complete - state of request
 * @property {string} message - error description
 * @property {object} data - response data
 */
class BaseReponseModel {
    complete = true;
    message = "";
    data = {};
};
exports.BaseReponseModel = BaseReponseModel;

/**
 * BaseReponseModel with data-based constructor
 * @property {boolean} complete - state of request
 * @property {string} message - error description
 * @property {object} data - response data
 */
class CompleteModel extends BaseReponseModel {
    complete = true;

    /**
     * @param {object} data - Response data 
     */
    constructor(data) {
        super();
        this.data = data ? data : {};
    }
};
exports.CompleteModel = CompleteModel;

/**
 * BaseReponseModel with error-based constructor
 * @property {boolean} complete - state of request
 * @property {string} message - error description
 * @property {object} data - response data
 */
class ErrorModel extends BaseReponseModel {
    complete = false;

    /**
     * @param {string} msg - Error message
     */
    constructor(msg) {
        super();
        this.message = msg ? msg : "";
    }
};
exports.ErrorModel = ErrorModel;