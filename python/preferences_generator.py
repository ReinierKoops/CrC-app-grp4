import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import random


def generate_preferences(playlist_id, members, n_preferences):
    '''
    :param playlist_id: playlist id from retrieve tracks
    :param members: number of group members
    :param n_preferences: number of preferences given from a single member
    :return: for each member a list of preference spotify ids (preferences) and a list with preferences information (info)
    '''
    tracks = get_tracks_from_playlist(playlist_id, n_preferences)
    preferences = []
    info = []
    for m in range(members):
        member_tracks = []
        member_info = []

        # TODO: implement a probabilistic model to generate different intersections within members' tracks.
        indices = random.sample(range(len(tracks)), n_preferences)

        for i in indices:
            title_artist = {}
            member_tracks.append(tracks[i]["track"]["id"])
            title_artist["title"] = tracks[i]["track"]["name"]
            title_artist["artist"] = tracks[i]["track"]["artists"][0]["name"]
            member_info.append(title_artist)
        info.append(member_info)
        preferences.append(member_tracks)
    return preferences, info


def get_tracks_from_playlist(playlist_id, n_preferences, client_id='4bb002302a2c4054986bfba74a6f74a3',
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
    return playlist_tracks[:n_preferences]


def print_preferences(preferences, info):
    '''
    :param preferences: preferences ids
    :param info: preferences info
    :return:
    '''
    for m, info in enumerate(info):
        print("MEMBER " + str(m + 1))
        id_list = preferences[m]
        for pos, i in enumerate(info):
            print(str(pos + 1) + ". " + i["title"] + " - " + i["artist"])
            print("   id: " + str(id_list[pos]))
        print()


if __name__ == "__main__":
    # Netherlands Top 50
    # To get playlist ID: Spotify --> Share --> Copy Spotify URI
    nl_top_50 = '37i9dQZEVXbKCF6dqVpDkS'
    # generate preferences
    members_preferences, members_info = generate_preferences(nl_top_50, 2, 10)
    # print results
    print_preferences(members_preferences, members_info)