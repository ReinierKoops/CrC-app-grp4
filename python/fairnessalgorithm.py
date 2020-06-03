import preferences_generator as pg


def fairness_algorithm_v2(preferences, max_recommended):
    """
    In this strategy, one person chooses first,
    then another, until everyone has made one choice. The next rounds
    usually begin with the one who had to choose last in the previous
    round. However, if the user’s top two preferences have already been
    selected in that round we go on to the next person. It continues
    until all items are consumed.

    :param preferences: list of users preferences
    :param max_recommended: number of songs in the recommended fair playlist
    :return: reccomended playlist
    """
    playlist = []
    reverse = False
    while len(playlist) < max_recommended:
        for user, user_preference in enumerate(preferences):
            for t in range(0, 3):
                # print(t)
                # print(reverse)
                # print("PLAYLIST", playlist)
                # print()
                track = preferences[user][0]
                if t == 2:
                    # print("next user")
                    break
                elif track not in playlist:
                    playlist.append(track)
                    preferences[user].pop(t)
                    break
                # else if it's he second chance, break
                else:
                    preferences[user].pop(0)
            if user == len(preferences) - 1:
                preferences.reverse()
                reverse = not reverse
                # print("REVERSE")
    return playlist


def generate_playlist(preferences, max_recommended):
    # for num, mem in enumerate(preferences):
    #     print("MEMBER " + str(num) + ": " + str(mem))
    playlist = []
    user_index = 0
    playlist_index = 0
    preference_index = 0
    forward = True
    while playlist_index < max_recommended:
        # print(preferences[user_index][preference_index])
        number = preferences[user_index][preference_index]
        if number in playlist:
            preference_index += 1
        # if not (number in playlist):
        else:
            playlist.append(preferences[user_index][0])
            playlist_index += 1
            user_index, forward = next_member(user_index, forward)
            # print("The new user_index " + str(user_index))
            preference_index = 0
    return playlist

def next_member(member_index, forward):
    if member_index >= 4:
        member_index -= 1
        # print("The new member_index " + str(member_index))
        return member_index, not forward
    elif member_index == 0 and not forward:
        member_index += 1
        # print("The new member_index " + str(member_index))
        return member_index, not forward
    elif forward:
        member_index += 1
        # print("The new member_index " + str(member_index))
        return member_index, forward
    else:
        member_index -= 1
        # print("The new member_index " + str(member_index))
        return member_index, forward


if __name__ == "__main__":
    nl_top_50 = '37i9dQZEVXbKCF6dqVpDkS'
    pref, _ = pg.generate_preferences(playlist_id=nl_top_50, members=5, n_preferences=5)
    for i, p in enumerate(pref):
        print("USER ", i+1, ":", p)
    # Version 1
    V1_fair_recommended_playlist = generate_playlist(preferences=pref, max_recommended=5)
    # Version 2
    V2_fair_recommended_playlist = fairness_algorithm_v2(preferences=pref, max_recommended=5)
    print("Version 1:", V1_fair_recommended_playlist)
    print("Version 2:", V2_fair_recommended_playlist)

# FAIRNESS Aggregation takes each group member in turn and add to the group recommendation list the candidate item
# (from those which have not yet been inserted into the group recommendation list) for which the rating of the user is
# highest. Then, for each group member, it chooses a second item, starting with the group member who chose the last item
# in the previous round. It repeats this until it has chosen N (e.g., 5) items.
