# Party!

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
