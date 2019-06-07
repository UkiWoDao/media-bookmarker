const express = require('express'),
      exphbs = require('express-handlebars'),
      bodyParser = require('body-parser'), // middleware to process POST requests
      mongoose = require('mongoose'),
      methodOverr = require('method-override'), // to override GET and POST methods
   // path = require('path');

// initialize app
      app = express();

// map global promise
mongoose.Promise = global.Promise;

// connect to mongoose
mongoose.connect('mongodb://localhost:27017/watchlistdb', {
    useNewUrlParser: true
})
    //catch promise
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// 
mongoose.set('useFindAndModify', false);

// load media model
require('./models/Media');
const Media = mongoose.model('media');

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// methodOverride middleware
app.use(methodOverr('_method'));

// enable custom css/js
app.use(express.static('public'));

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

// remove list entries from db
app.delete('/list/:id', (req, res) => {
    Media.deleteOne({_id: req.params.id})
        .then(() => {
            res.redirect('/list');
        });
});

// star/update list entry
app.put('/list/:id', (req, res) => {
    Media.findOne({
        _id: req.params.id
    })
        .then (media => {
            if(media.favourite == false){
                media.favourite = true;
            }else{
                media.favourite = false;
            }
        media.save()
            .then(() => {
                res.redirect('/list');
            })
        });
});

// process form
app.post('/list', (req, res) => {
    console.log(req.body);
    // server side validation
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
        new Media(req.body).save();
        // load index / clear form
        res.render('index');

    // for later user authentication
    //     const newUser = {
    //         title: req.body.title,
    //         type: req.body.type
    //     }
    //     new Media(newUser)
    //         .save()
    }
});

// about page
app.get('/about', (req, res) => {
    res.render('about');
});

// port on localhost
const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});