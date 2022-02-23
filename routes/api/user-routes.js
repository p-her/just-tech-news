const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    //Access our User model and run .findAll() method
    User.findAll({
        // PROTECT THE PASSWORD
        // we've provided an attributes key and instructed the query to exclude the password column.
        // it's in an array because if we want to exclude more than one, we can just add more.
        attributes: {exclude: ['password']}
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
// Protect the Passwords
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            // find id where it equals req.params.id
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// POST /api/users
router.post('/', (req, res) => {
    // expect {username: 'Lernantino', email:'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// localhost:3001/api/users/login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if(!dbUserData){
            res.status(400).json({ message: 'No user with that email address' });
            return ;
        }
        // add comment syntax in front of this line in the .then()
        // res.json({ user: dbUserData })

        // Verifty user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if(!validPassword){
            res.status(400).json({ message: 'Incorrect password! '});
            return;
        }

        res.json({ user: dbUserData, message: 'You are now logged in! '});
    })
})

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead

    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData[0]){
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});


module.exports = router;