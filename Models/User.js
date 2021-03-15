`use strict`;

const { BaseModel, DataTypes } = require('./BaseModel');
const db = require('../options').db.sequelize;
const bcrypt = require('bcrypt');

class User extends BaseModel {
  validatePassword(password) {
    return bcrypt.compareSync(password, this.passwordHash);
  }

  static passportFindOrCreate(profile, done) {
    let whereStatement = {}; whereStatement[profile.provider + 'ID'] = profile.id;
    User.findOrCreate({
      where: whereStatement,
      defaults: {
        firstName: profile.name.givenName ? profile.name.givenName : profile.displayName,
        lastName: (profile.name.givenName && profile.name.familyName) ? profile.name.familyName : null
      }
    }).then((data) => {
      let user = data[0], isCreated = data[1];
      if (user) return done(null, user);
      else return done(`${profile.provider.toUpperCase()} auth error`, false);
    });
  }
}

User.init(
  // Model fields / attributes 
  {
    // General fields
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING }, // allowNull defaults to true
    // User id fields
    email: { type: DataTypes.STRING }, // Unique
    vkontakteID: { type: DataTypes.STRING }, // Unique
    facebookID: { type: DataTypes.STRING }, // Unique
    googleID: { type: DataTypes.STRING }, // Unique
    // Auth things
    emailConfirmed: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    passwordHash: { type: DataTypes.STRING },
    password: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.passwordHash;
      },
      set(value) {
        this.setDataValue('passwordHash', bcrypt.hashSync(`${value}`, 10));
      }
    },
    // Parameters
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: 0 }
  },
  // Model parameters
  {
    indexes: [{ name: 'auth', fields: ['email', 'vkontakteID', 'facebookID', 'googleID'], unique: true }],
    // Other model options go here
    sequelize: db, // We need to pass the connection instance
    tableName: 'Users', // Pluralized by default
    modelName: 'User', // We need to choose the model name
    timestamps: true // Inherits from init of db
  }
);

module.exports = User;