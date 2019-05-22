const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser'); // middleware to process POST requests
const mongoose = require('mongoose');

// initialize app
const app = express();

// map global promise
mongoose.Promise = global.Promise;

// connect to mongoose
mongoose.connect('mongodb://localhost:27017/watchlistdb', {
    useNewUrlParser: true
})
    //catch promise
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// load movie model
require('./models/Media');
const Media = mongoose.model('media');

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// index page
app.get('/', (req, res) => {
    res.render('index');
});

// list page
app.get('/list', (req, res) => {
    Media.find({})
        .sort({favourite: 'desc'})
        .then(media => {
            res.render('list', {
                media: media
            });
        });
});

// about page
app.get('/about', (req, res) => {
    res.render('about');
});

// proces form
app.post('/list', (req, res) => {
    console.log(req.body);
    let errors = [];

    if(!req.body.title){
        errors.push({text:'Add a title'});
    }
    if(!req.body.type){
        errors.push({text:'Select a type'});
    }

    if(errors.length > 0){
        res.render('/', {
            errors: errors,
            title: req.body.title,
            type: req.body.type
        });
    } else {
        const newUser = {
            title: req.body.title,
            type: req.body.type
        }
        new Media(newUser)
            .save()
    }
});

// port on localhost
const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});