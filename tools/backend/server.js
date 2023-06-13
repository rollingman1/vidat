// server.js
// Copyright (C) 2021, ANU CVML

// --- setup ----------------------------------------------------------------------

const fs         = require('fs');
const express    = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path       = require('path');
const date = require('date-utils')

const app = express();
// handling posts
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const execData = JSON.parse(fs.readFileSync(path.join(__dirname, 'exec_config.json')));
const accountData = execData.accounts;
const port = execData.port;
const host = execData.host;
const dataRoot = execData.dataRoot;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// public assets
app.use(express.static(path.join(__dirname, 'public')));

// static serving of vidat
app.use('/vidat', express.static('vidat'));
const vidat = 'http://' + host + ':' + port + '/vidat';
const submit = 'http://' + host + ':' + port + '/';

// Authentication middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

const requireLogin = (req, res, next) => {
  // Check if the user is authenticated
  if (req.session.isAuthenticated) {
    // User is authenticated, allow access to the next route
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect('/login');
  }
};

// --- helper functions -----------------------------------------------------------
function log(message){
    const date = new Date()
    console.log(date.toFormat('YYYY-MM-DD HH24:MI:SS : '), message)
}

function get_videos(base, username, role)
{
    videos = {}
    // read video directory
    fs.readdirSync(path.join(base, dataRoot, 'video')).forEach(name_folder => {
        if (name_folder === username || role === "admin") {
            fs.readdirSync(path.join(base, dataRoot, 'video', name_folder))
                .forEach(file => {
                    ext = file.split('.').pop()
                    if ((ext == 'avi') || (ext == 'mp4')) {
                        video_root = path.join(dataRoot, 'video', name_folder)
                    name = path.join(name_folder, file.substr(0, file.length - ext.length - 1))
                    videos[name] = {video: path.join(video_root,file), annotation: null, confirmAnnotation: null}
                    }
                })
            }
    })

    // read annotation directory
    fs.readdirSync(path.join(base, dataRoot, 'annotation_notConfirmed')).forEach(name_folder => {
        if (name_folder === username || role === "admin") {
            fs.readdirSync(path.join(base, dataRoot, 'annotation_notConfirmed', name_folder))
                .forEach(file => {
                ext = file.split('.').pop()
                if (ext == 'json') {
                    anno_root = path.join(dataRoot, 'annotation_notConfirmed', name_folder)
                    name = path.join(name_folder, file.substr(0, file.length - ext.length - 1))
                    if (name in videos) {
                        videos[name].annotation = path.join(anno_root,file)
                    }
                }
            })
        }
    })

    // read confirmed annotation directory
    fs.readdirSync(path.join(base, dataRoot, 'annotation_confirmed')).forEach(name_folder => {
        if (name_folder === username || role === "admin") {
            fs.readdirSync(path.join(base, dataRoot, 'annotation_confirmed', name_folder))
                .forEach(file => {
                ext = file.split('.').pop()
                if (ext == 'json') {
                    anno_root = path.join(dataRoot, 'annotation_confirmed', name_folder)
                    name = path.join(name_folder, file.substr(0, file.length - ext.length - 1))
                    if (name in videos) {
                        videos[name].confirmAnnotation = path.join(anno_root, file)
                    }
                }
         })
        }
    })
    
    return videos
}

// --- routes ---------------------------------------------------------------------
// Define a route for the login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Define a route for the home page
app.get('/', requireLogin, (req, res) => {
    log('get');
    // Retrieve the data from the session
    const {username, role} = req.session;
    const videos = get_videos(path.join(__dirname, 'vidat'), username, role);
    res.render('home.ejs', { videos, vidaturl: vidat, submission: submit, role, username});
});

// Logout route
app.get('/logout', (req, res) => {
  log('log out: ' + req.session.username);
  req.session.destroy();
  res.redirect('/login');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password match the account data
  const account = accountData.find((acc) => acc.username === username && acc.password === password);
  if (account) {
    req.session.isAuthenticated = true;
    req.session.username = account.username;
    req.session.role = account.role;
    log('log in: ' + req.session.username);
    res.redirect('/');
  } else {
    res.send('Invalid username or password. Please try again.');
  }
});

app.post('/', (req, res) => {
    const name = req.query.token;
    const role = req.query.role;
    const json = JSON.stringify(req.body);

    if (name == null) {
        return res.status(500).send('Invalid token');
    }

    if (role == 'admin') {
        annotationFolder = "annotation_confirmed";
    } else {
        annotationFolder = "annotation_notConfirmed";
    }
    
    const base = path.join(path.join(__dirname, 'vidat'), dataRoot, annotationFolder);
    fs.writeFile(path.join(base, name + '.json'), json, (err, data) => {
        if (err) {  
            console.log(err);
            return res.status(500).send('Server error!');
        }
        res.json({'message': 'Annotation saved!'});
        log('Annotation saved!')
    })
})

// --- launch application ---------------------------------------------------------

console.log("Server listening on port " + port);
app.listen(port);
