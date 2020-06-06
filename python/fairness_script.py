import os
import argparse
import uuid
import json
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from google.cloud import firestore
import random as rand
from copy import deepcopy


def generate_preferences(playlist_id, members, n_playlist, n_preferences):
    '''
    :param n_playlist: number of tracks in the retrieved playlist (TOP50[:n_playlist])
    :param playlist_id: playlist id from retrieve tracks
    :param members: number of group members
    :param n_preferences: number of preferences given from a single member
    :return: retrieved playlist and for each member a list of preference spotify preferences
             as dictionaries id, title, author
    '''
    tracks = get_tracks_from_playlist(playlist_id)
    rand.shuffle(tracks)
    tracks = tracks[:n_playlist]
    preferences = {}
    playlist = []
    for t in tracks:
        song_info = {"id": t["track"]["id"], "title": t["track"]["name"], "artist": t["track"]["artists"][0]["name"]}
        playlist.append(song_info)
    # print(playlist)
    for m in range(members):
        member_tracks = []
        # TODO: implement a probabilistic model to generate different intersections within members' tracks.
        indices = rand.sample(range(len(tracks)), n_preferences)
        for i in indices:
            # print(playlist[i])
            member_tracks.append(playlist[i])
        # print()
        preferences[m] = member_tracks
    return playlist, preferences


def get_tracks_from_playlist(playlist_id, client_id='4bb002302a2c4054986bfba74a6f74a3',
                             client_secret='3ca218a4a49040adb2adb9c17dbd23fa'):
    '''
    :param playlist_id: spotify playlist from pick tracks
    :param client_id: client id web application (https://developer.spotify.com/dashboard)
    :param client_secret: client id secret
    :return: list of tracks contained in a playlist
    WARNING: sp.playlist returns a dict. The tracks are contained in dict["items"]
    '''
    # generate the credentials_manager
    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    # initialize spotipy with credential manager
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    # get track with spotipy playlist_tracks function
    playlist_tracks = sp.playlist_tracks(playlist_id, fields=None, limit=50, offset=0, additional_types=('track',))[
        "items"]
    return playlist_tracks


def fairness_algorithm(pref, max_recommended):
    """
    In this strategy, one person chooses first,
    then another, until everyone has made one choice. The next rounds
    usually begin with the one who had to choose last in the previous
    round. However, if the user’s top two preferences have already been
    selected in that round we go on to the next person. It continues
    until all items are consumed.

    :param pref: list of users preferences
    :param max_recommended: number of songs in the recommended fair playlist
    :return: reccomended playlist
    """
    p = deepcopy(pref)
    playlist = []
    algo_order = []
    order = [i for i, _ in enumerate(p)]
    rand.shuffle(order)
    while len(playlist) < max_recommended:
        for o in order:
            algo_order.append(o)
            value = p[o]
            # print("USER", o, value)
            # print()
            for t in range(0, 3):
                track_id = value[0]["id"]
                if t == 2:
                    break
                elif not any(d['id'] == track_id for d in playlist):
                    playlist.append(value[0])
                    value.pop(0)
                    if len(playlist) == max_recommended:
                        return playlist, algo_order
                    break
                else:
                    value.pop(0)
        rand.shuffle(order)
        # print("PLAYLIST", playlist)
        # print()
    return playlist, algo_order


def task_to_JSON(source_playlist, pref, fair_playilist, users_order):
    UUID = uuid.uuid4()
    data = {"taskId": str(UUID), "song_list": source_playlist}
    for key, values in pref.items():
        # print(key, values)
        data["song_user_pref_" + str(key)] = values
    data["algorithm"] = fair_playilist
    data["users_order"] = users_order
    data["status"] = 0
    with open("tasks/" + str(UUID) + ".json", 'w') as fp:
        json.dump(data, fp)
    return str(UUID)


def generate_tasks(n_tasks, playlist_id, n_playlist, members, n_preferences, max_recommended):
    generated_tasks = []
    for n in range(n_tasks):
        original_playlist, user_pref = generate_preferences(playlist_id=playlist_id, members=members,
                                                            n_playlist=n_playlist,
                                                            n_preferences=n_preferences)
        fair_recommended_playlist, u_order = fairness_algorithm(pref=user_pref, max_recommended=max_recommended)
        UUID = task_to_JSON(original_playlist, user_pref, fair_recommended_playlist, u_order)
        generated_tasks.append(UUID)
    return generated_tasks


def load_task_Firestore_Cloud(tasks_list, auth_file="auth.json"):
    # download your auth file from Settings->Service Account->Generate New Key
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = auth_file
    os.system("echo $GOOGLE_APPLICATION_CREDENTIALS")
    db = firestore.Client()
    for file_id in tasks_list:
        with open("tasks/"+str(file_id)+'.json') as json_file:
            data = json.load(json_file)
            db.collection(u'tasks').document(file_id).set(data)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Parameters to run Fairness Algorithm over synthetic Spotify preferences')
    parser.add_argument("-nt", "--ntasks", type=int,
                        help="number of tasks to generate", default=1)
    parser.add_argument("-pid", "--playlist", type=str,
                        help="spotify source playlist id for synthetic data", default='37i9dQZEVXbKCF6dqVpDkS')
    parser.add_argument("-n", "--ntracks", type=int,
                        help="spotify playlist cardinality", default=10)
    parser.add_argument("-m", "--members", type=int,
                        help="members in a group", default=3)
    parser.add_argument("-np", "--preferences", type=int,
                        help="number of preferences for each member", default=5)
    parser.add_argument("-r", "--recommended", type=int,
                        help="number of recommended songs by fair algorithm", default=5)
    args = parser.parse_args()
    tasks = generate_tasks(args.ntasks, args.playlist, args.ntracks, args.members, args.preferences, args.recommended)
    load_task_Firestore_Cloud(tasks)
