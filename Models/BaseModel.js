`use strict`;

const DataTypes = require('sequelize').DataTypes;
const Model = require('sequelize').Model;
const options = require('../options');

/**
 * @extends Model
 */
class BaseModel extends Model {

    // Prevent sync on battle database
    static sync(params) {
        let newParams = {};
        // Check if needs alter and alter is allowed
        if (params.alter && options.db.sync.allow_alter === true) newParams.alter = true;
        // Check if needs force and force is allowed and we in debug mde
        if (params.force && options.db.sync.allow_force === true && options.state.debug === true) newParams.force = true;
        // Pass updated params
        super.sync(newParams);
    }
}

exports.DataTypes = DataTypes;
exports.BaseModel = BaseModel;