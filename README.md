# Party!

This is the sourcecode for a website made in VueJS. It is thus written in Javascript & an algorithm part is written in Python (to generate JSON). We also make use of Firebase to handle the login and to persist data. Personal information stored such as Firebase credentials have been included however, they are disabled. Also write access as well as login access has been disabled to prevent abuse.

the website can be found on https://crc-party-grp4.web.app/ 


![Imgur](https://i.imgur.com/JF4KLRL.png)

- In the Python folder the fairness algorithm is included. We make use of the Spotify API, retrieve the information and output it in JSON format.
- The aggregation algorithm (based on majority voting) can be found in the functions index.js file. This was used to aggregated recommendation lists of multiple crowd-workers into one when consensus was found.
- The content of the website is all the rest; found in the SRC folder.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```


## Deployment on Firebase
``` bash
# login Firebase
firebase login

# init Firebase
firebase init

# Use an existing project
# crc-party (crc-party)
# firestore.rules
# firestore.indexes.json
# JavaScript
# No
# Yes

# run build to create small build file for deploy
npm run build

# deploy to firebase
firebase deploy
```
