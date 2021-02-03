`use strict`;

const { BaseModel, DataTypes } = require('./BaseModel');
const db = require('../options').db.sequelize;
const User = require('./User');

class EmailConfirmation extends BaseModel {
    confirmEmail(callback) {
        // Get assotiated object with getModelname()
        this.getUser().then((user) => {
            // Set confirm is user exists
            if (user) { user.emailConfirmed = true; user.save(); callback(null, { id: user.id }); }
            else callback('Wrong confirmation code', null);
            // Remove this entity from db anyway
            this.destroy();
        });
    }
}

EmailConfirmation.init(
    // Attributes
    {
        confirmationCode: { type: DataTypes.STRING } // Unique
    },
    // Options
    {
        indexes: [{ name: 'confirmationCode', fields: ['confirmationCode'], unique: true }],
        // Other model options go here
        sequelize: db, // We need to pass the connection instance
        tableName: 'EmailConfirmations', // Pluralized by default
        modelName: 'EmailConfirmation', // We need to choose the model name
        timestamps: true // Inherits from init of db
    }
);

// Associations
EmailConfirmation.belongsTo(User, {
    onDelete: 'SET NULL', // Behaviour on delete user
    onUpdate: 'CASCADE', // Behaviour on update user
    foreignKey: 'userEmail', // Name of field in this table
    targetKey: 'email' // Name of field in foreign table
});

module.exports = EmailConfirmation;