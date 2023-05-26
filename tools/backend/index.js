// index.js
// Copyright (C) 2021, ANU CVML

// --- setup ----------------------------------------------------------------------

const fs         = require('fs')
const express    = require('express')
const bodyParser = require('body-parser')
const path       = require('path')
const cors       = require('cors')

const app = express()
const port = process.env.PORT || 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// public assets
app.use(express.static(path.join(__dirname, 'public')))

// handling posts
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// static serving of vidat
app.use('/vidat', express.static('vidat'))
const vidat = 'http://localhost:' + port + '/vidat'
const submit = 'http://localhost:' + port + '/'

// --- helper functions -----------------------------------------------------------

function get_videos(base)
{
    videos = {}

    // read video directory
    fs.readdirSync(path.join(base, '230525_action_confirm_poc', 'video')).forEach(name_folder => {
        fs.readdirSync(path.join(base, '230525_action_confirm_poc', 'video', name_folder)).forEach(file => {
        ext = file.split('.').pop()
        if ((ext == 'avi') || (ext == 'mp4')) {
            video_root = path.join('230525_action_confirm_poc', 'video', name_folder)
            name = path.join(name_folder, file.substr(0, file.length - ext.length - 1))
            videos[name] = {video: path.join(video_root,file), annotation: null, confirmAnnotation: null}
        }
    })})

    // read annotation directory
    fs.readdirSync(path.join(base, '230525_action_confirm_poc', 'annotation_notConfirmed')).forEach(name_folder => {
        fs.readdirSync(path.join(base, '230525_action_confirm_poc', 'annotation_notConfirmed', name_folder)).forEach(file => {
        ext = file.split('.').pop()
        if (ext == 'json') {
            anno_root = path.join('230525_action_confirm_poc', 'annotation_notConfirmed', name_folder)
            name = path.join(name_folder, file.substr(0, file.length - ext.length - 1))
            if (name in videos) {
                videos[name].annotation = path.join(anno_root,file)
            }
        }
    })})

    // read confirmed annotation directory
    fs.readdirSync(path.join(base, '230525_action_confirm_poc', 'annotation_confirmed')).forEach(name_folder => {
        fs.readdirSync(path.join(base, '230525_action_confirm_poc', 'annotation_confirmed', name_folder)).forEach(file => {
        ext = file.split('.').pop()
        if (ext == 'json') {
            anno_root = path.join('230525_action_confirm_poc', 'annotation_confirmed', name_folder)
            name = path.join(name_folder, file.substr(0, file.length - ext.length - 1))
            if (name in videos) {
                videos[name].confirmAnnotation = path.join(anno_root, file)
            }
        }
    })})
    
    return videos
}

// --- routes ---------------------------------------------------------------------

app.get('/', (req, res) => {
    console.log('get')
    videos = get_videos(path.join(__dirname, 'vidat'))
    res.render('index.ejs', { videos: videos, vidaturl: vidat, submission: submit })
})

app.post('/', (req, res) => {
    const name = req.query.token
    const json = JSON.stringify(req.body)

    if (name == null) {
        return res.status(500).send('Invalid token')
    }
    
    const base = path.join(path.join(__dirname, 'vidat'), '230525_action_confirm_poc', 'annotation_confirmed')
    fs.writeFile(path.join(base, name + '.json'), json, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Server error!')
        }
        res.send('Annotation saved!')
    })
})

// --- launch application ---------------------------------------------------------

console.log("Server listening on port " + port)
app.listen(port)
