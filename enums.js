'use strict';

exports.errorTypes = {
    // Common API errors
    METHOD_NOT_EXISTS: 'Method \"%M\" does not exist',
    CLASS_NOT_EXISTS: 'Class \"%C\" does not exist',
    ARGUMENT_IS_REQUIRED: 'Argument \"%A\" is required',
    URL_NO_CLASS_OR_METHOD: 'Request url should contain class and method',
    REQUEST_BODY_IS_EMPTY: 'Request body is empty',
    AUTH_WRONG_CREDENTIALS: 'Basic auth credentials is incorrect or not present',

    // Database errors
    DB_CONNECTION_ERROR: 'Database connection failed: \n%E',
    DB_LIST_IS_INVALID: 'Databases list argumend should be an array of strings',
    DB_INSERTION_ERROR: 'Database insert error: \n%E',
    DB_QUERY_ERROR: 'Database query error: \n%E',

    // Github/Gitlab webhooks errors
    GH_SIGNATURE_NOT_MATCH: `Request body digest did not match given X-Hub-Signature (%C)`,
    GL_TOKEN_NOT_MATCH: 'Request X-Gitlab-Token (%T) did not match required secret token',
    GIT_INCORRECT_REF: 'Request branch reference (%B) did not match required (%R)',
    GIT_NO_SECRET: 'No secret header passed in current request'
}