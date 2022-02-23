// import Model and DataTypes object from Sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');


// create our User model: User class
class User extends Model {
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw){
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// .init() method initialize the model's data and configuration, pasing in two objects as arguments
// define table columns and configuration
User.init(
    {
        // TABLE COLUMN DEFINITIONS GO HERE
        // define an id column
        id: {
            // use the special Sequelize DataTyes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,

            // turn on auto increment
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            // beforeCreate(userData){
            //     return bcrypt.hash(userData.password, 10).then(newUserData => {
            //         return newUserData;
            //     })
            // }


            // same as above code, but with async/await
            async beforeCreate(newUserData){
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData){
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }

        },
        // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))
        sequelize,

        // pass in our imported sequelize connection (the direct connection to our database)
        timestamps: false,

    // don't pluralize name of database table
    freezeTableName: true,

    // use underscores instad of camel-casing (i.e `comment_text`)
    underscored: true,

    // make it so our model name stays lowercase in the database
    modelName: 'user'

    }
);

module.exports = User;