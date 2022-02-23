const router = require('express').Router();
const { Post, User } = require('../../models');

// get all users
router.get('/', (req, res) => {
    console.log('================');
    Post.findAll({
        // Query configuration
        // Remember back in the Post model, we defined the column names
        // to have an underscore naming convention by using the uderscored: true, assigment.
        // In Sequelize, columns are camelcase by default
        // next we include the JOIN to the User table
        // inclue property is expressed as an array of Objects. To define this object, we need a reference
        // to the model and attributes. It is an array because if we need more than one table join we can just add-on to it
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]

    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if(!dbPostData){
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

/*
Can you reason why this is the case? In the SQL shell when we made our first seed, 
we were making a query directly to the MySQL database. Therefore if any constraints 
on any field are not fulfilled, an error will occur. Remember, the created_at and 
updated_at constraints stated that these fields cannot be empty or NOT NULL. 
Then why does this constraint error not occur in the request made through Insomnia?

This is because of what Sequelize does for our application under the hood. The values 
for these fields are assigned automatically with CURRENT_TIMESTAMP values, which allows 
us to not include it on the request.

*/

router.post('/', (req, res) => {
    //expect {title: 'Taskmaster goes public'}, post_url: 'https://taskmaster.com/press', user_id: 1 }
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
    

router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )   
        .then(dbPostData => {
            if(!dbPostData){
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

Post.findAll({
    attributes: ['id', 'post_url', 'title', 'created_at'],
    order: [['created_at', 'DESC']],
    include: [
        {
            model: User,
            attributes: ['username']
        }
    ]
})


// the response will show the number of rows affected by
router.delete('/:id', (req, res) => {
    Post.destroy( {
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if(!dbPostData){
                res.status(404).json({ message: 'No post found with this id' });
                return ;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// in order to test this route, we need to expose the changes to the router by
// export it
module.exports = router;