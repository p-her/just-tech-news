const User = require('./User');
const Post = require('./Post');

// create associations
// a user can has many posts (one to many)
User.hasMany(Post, {
    foreignKey: 'user_id'
});


// defining the relationship of the Post model to the User
// the constraint we impose here is that a post can belong to one
// user, but not many users.
Post.belongsTo(User, {
    foreignKey: 'user_id',
});



module.exports = {User, Post};