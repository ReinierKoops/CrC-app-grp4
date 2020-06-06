# Python scripts
Run this script to generate and load json files to Firestore.

## Requirements
```
google-cloud-firestore, spotipy, uuid, json
```

## Usage
```
python3 fairness_script.py --ntasks 1 --ntracks 10 --members 3 --preferences 5 --recommended 5
# --playlist default '37i9dQZEVXbKCF6dqVpDkS' (NL Top 50)
# all vparameters above are equal to default
```
## Generate Preferences
In account to generate synthetic data:
* *get_tracks_from_playlist(playlist_id)* : using spotipy library, it's possible to retrieve tracks given a playlist id (as parameter). The function need *client_id* and *client_secret* from https://developer.spotify.com/dashboard
* *generate_preferences(playlist_id, members, n_playlist, n_preferences)* : the function filter the tracks of the playlist by **id**, **title** and **author** in a dictionary. A track has this format:
```
{"id": "1sgDyuLooyvEML4oHspNza", "title": "Lose Somebody", "artist": "Kygo"}
```
Given number of users for a group (members), the number of songs in the source playlist and the number of preferences for each member of the group, the function returns the source playlist and a list with *members* preferences of *n_preferences* songs in the above format. The format of a single preference is the following:
```
single_preference = [
    {"id": "14wf185UxfNbSy8dwt4r4q", "title": "MAMACITA", "artist": "Black Eyed Peas"},
    {"id": "4w47S36wQGBhGg073q3nt7", "title": "TKN (feat. Travis Scott)", "artist": "ROSAL\u00cdA"},
    {"id": "7ytR5pFWmSjzHJIeQkgog4", "title": "ROCKSTAR (feat. Roddy Ricch)", "artist": "DaBaby"},
    {"id": "017PF4Q3l4DBUiWoXk4OWT", "title": "Break My Heart", "artist": "Dua Lipa"},
    {"id": "3Dv1eDb0MEgF93GpLXlucZ", "title": "Say So", "artist": "Doja Cat"}
]
```
## Fairness Algorithm
The algorithm takes in input preferences as a list of preferences and the maximum number of recommended songs. Until max number of recommended isn't reach, the algorithm generates ROUNDS: for each round, each members put its first choice in the recommended playlist: if the songs it's already in the playlist, a member can choose its second choice. In case also its second choice it's already in the recommended playlist, the algorithm skip to the next user. The order of user it's rondomize at the beginning and after each round in the algorithm.
The algorithm returns the **Fair Recommended Playlist** as a list of formatted songs and a list of index **algo_order** that represent the order of users that the algorithm use.


## Tasks to JSON
The function *tasks_to_json(source_playlist, pref, fair_playlist, user_order)* takes the original playlist and preferences generated with *generate_preferences* and the fair recommende playlist and the users order retrieved from *fairness_algorithm* function.
Each file has a **uuidv4** as unique id, a **status** (0 to fix, 1 to verify, 2 verfied) and all infromation from parameters.
Following an example of a task as a json:
```
{
  "taskId": "cf40291b-0bf2-428a-8ffa-b15f67acca29",
  "song_list": [
    {"id": "4umIPjkehX1r7uhmGvXiSV", "title": "Intentions (feat. Quavo)", "artist": "Justin Bieber"},
    {"id": "5RqR4ZCCKJDcBLIn4sih9l", "title": "Party Girl", "artist": "StaySolidRocky"}, 
    ...
  ],
  "song_user_pref_0": [
    {"id": "4w47S36wQGBhGg073q3nt7", "title": "TKN (feat. Travis Scott)", "artist": "ROSAL\u00cdA"},
    {"id": "14wf185UxfNbSy8dwt4r4q", "title": "MAMACITA", "artist": "Black Eyed Peas"},
    ...
  ],

  "song_user_pref_1": [
    {"id": "14wf185UxfNbSy8dwt4r4q", "title": "MAMACITA", "artist": "Black Eyed Peas"},
    {"id": "4w47S36wQGBhGg073q3nt7", "title": "TKN (feat. Travis Scott)", "artist": "ROSAL\u00cdA"},
    ...
  ],
  "song_user_pref_2": [
    {"id": "2grAr8pWMuLWn8ZYEE9wDV", "title": "Never Seen the Rain", "artist": "Tones And I"}, 
    {"id": "4HBZA5flZLE435QTztThqH", "title": "Stuck with U (with Justin Bieber)", "artist": "Ariana Grande"}, 
    ...
  ], 
  "algorithm": [
    {"id": "2grAr8pWMuLWn8ZYEE9wDV", "title": "Never Seen the Rain", "artist": "Tones And I"}, 
    {"id": "4w47S36wQGBhGg073q3nt7", "title": "TKN (feat. Travis Scott)", "artist": "ROSAL\u00cdA"}, 
    ...
  ],
  "users_order": [2, 0, 1, 2, 1], 
  "status": 0
}
```

## Firestore connection and loading json
To connect our Firebase Project with Python we use google-cloud-firesore API. The function *load_task_Firestore_Cloud* takes a list of **file_id** with a list of id of task-json-files returned from *generate_task function.

1) Get *auth.json* file from Firebase Console *Settings->Service Account->Generate New Key* (Rename and put in the main folder)
2) Export environment variable with path to *auth.json* file with:
```
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = auth_file
os.system("echo $GOOGLE_APPLICATION_CREDENTIALS")
```
3) Connect to Firestore CLient
```
db = firestore.Client()
```
4) For each **file_id** Read json file from tasks folder and upload to Firestore
```
for file_id in tasks_list:
    with open("tasks/"+str(file_id)+'.json') as json_file:
        data = json.load(json_file)
        db.collection(u'tasks').document(file_id).set(data)
```

