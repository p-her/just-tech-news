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

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers/'));



// turn on connection to db and server
// sequelize.sync() method establish the connection to the database
// sync means this is Sequelize taking the models and connecting them to 
// associated database tables. if it doesnt find a table, it'll create one
// force: false --> it doesnt have to be included, but if it were set to true, it would
// drop and re-create all of the database tables on startup
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
