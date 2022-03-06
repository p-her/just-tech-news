// the router instance in routes/index.js collected everything for us
// and packaged them up for server.js to use so we don't have to 
// worry about importing multiple files for different endpoints

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');

const hbs = exphbs.create({});

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    //As you may be able to guess, "Super secret secret" should be replaced by an actual secret and stored in the .env file
    // cookies is to set cookie to be {}. If we wanted to set additional options on the cookie, like a maximum age, we would add the options to that object
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
}

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers/'));
app.use(session(sess));



// turn on connection to db and server
// sequelize.sync() method establish the connection to the database
// sync means this is Sequelize taking the models and connecting them to 
// associated database tables. if it doesnt find a table, it'll create one
// force: false --> it doesnt have to be included, but if it were set to true, it would
// drop and re-create all of the database tables on startup
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
