# Example Backend Server

The ANU CVML Video Annotation Tool (Vidat) works just fine as a browser-based tool where you can
load videos and save annotations to your local machine. Used in this way workers do not need to
install any software and can make use of our existing hosts listed in the project README file.

Vidat can also be integrated with a backend server for submitting user annotations and managing
larger labelling tasks.

In this example we use `nodejs` to build a simple backend server. Other web frameworks can be
used instead of `nodejs`. The backend makes use of the `submitURL` parameter provided to the Vidat
tool. Note that in this example we do not consider security issues such as user authentication, but
these should be carefully considered for any real application since the server will be responding
to user requests and writing files to disk.

## What does the example demonstrate?

When run the example will serve a webpage that shows a list of videos to be annotated. Clicking on
a video will open the Vidat tool and allow the user to submit annotations back to the server. These
annotations will be saved and made available the next time the video is opened for editing. In the
current version the main webpage will need to be refershed after submitting an annotation to reflect
the changes. Newly submitted annotations override any existing annotations for a given video.

## Installation
  
To run the demo, install `nodejs`, `npm` and various modules. And link the static Vidat browser
code to the subdirectory `vidat`.
  
```
sudo apt install nodejs npm
npm install --save express ejs body-parser cors express-session

ln -s ../../src vidat
```

Detailed instructions for installing `express` can be found at https://expressjs.com/en/starter/installing.html.

Now copy any videos you would like annotated to `vidat/dataRoot/video`.
Corresponding annotations will be saved in `vidat/dataRoot/annotation_notConfirmed` or `vidat/dataRoot/annotation_confirmed`.
username으로된 폴더를 만들어야함. (라벨링 데이터 구조 참고)

## Running

1. Open a terminal and run `node server.js`
2. Open a web broswer and navigate to `http://HOST:PORT/`
   (`PORT`와 `HOST`는 `server.js`와 같은 수준에 위치한 `exec_config.json`에 기입)
   
### exec_config
```json
{
	"dataRoot": "data_example",
	"port": 80,
	"host": "localhost",
	"accounts": [
		{
			"username": "admin", 
			"password": "admin",
			"role": "admin"
		},
		{
			"username": "labeler0",
			"password": "labeler0",
			"role": "labeler"
		},
		{
			"username": "labeler1",
			"password": "labeler1",
			"role": "labeler"
		},
		{
			"username": "labeler2",
			"password": "labeler2",
			"role": "labeler"
		}
	]
}
```

## 라벨링 데이터 구조
```
.
    vidat/
        data_example/
            video/
                labeler0/
                    *.mp4
                labeler1/
                labeler2/
                
            annotation_notConfirmed/
                labeler0/
                    *.json
                labeler1/
                labeler2/
                
            annotation_confirmed/
                labeler0/
                    *.json
                labeler1/
                labeler2/
```