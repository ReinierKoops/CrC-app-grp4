const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const increment = admin.firestore.FieldValue.increment(1);

const fixLimit = 5;
const verifyLimit = 5;

const fixesRequired = 5;
const verifiesRequired = 5;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.requestFix = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    var userId = req.query.uid;
    var user = await admin.firestore().collection('users').doc(userId).get();
    user = user.data();
    var userFixes = user.fixes_done;
    var honey_status = user.honey_status_fix;

    var taskId;
    var newTask = false;

    if (honey_status >= 0) {
        var fixes = await admin.firestore().collection('fixes').where("userId", "==", userId).where("status", "==", 0).get();
        if (!fixes.empty) { // Check if task is open for user
            taskId = fixes.docs[0].data().taskId;
            admin.firestore().collection('fixes').doc(taskId + '-' + userId).update({nr_visits: increment});
        } else if (honey_status == 0) {
            taskId = "honeyfix";
            newTask = true;
        } else if (userFixes < fixLimit) { // Check if user limit is not reached
            var tasks = await admin.firestore().collection('tasks').where("status", "==", 0).get();
            var doc;
            for (doc of tasks.docs) {
                var curTaskId = doc.data().taskId;

                fixes = await admin.firestore().collection('fixes').where("taskId", "==", curTaskId).get();
            
                var users = [];
                if (!fixes.empty) {
                    users = users.concat(fixes.docs.map((doc) => doc.data().userId));
                }
                if (!users.includes(userId)) {
                    taskId = curTaskId;
                    newTask = true;
                    break;
                }
            }
        }
    }   

    if (taskId != null) { // Assign the task
        admin.firestore().collection('tasks').doc(taskId).get().then(async function (doc) {
            let fix = {
                explanation: "",
                fair: false,
                fix: [],
                taskId: taskId,
                userId: userId,
                status: 0
            }
            admin.firestore().collection('fixes').doc(taskId + '-' + userId).set(fix, { merge: true });
            var task = await admin.firestore().collection('tasks').doc(taskId).get();
            res.send(JSON.stringify(task.data()));
        });
        if (newTask) {
            if (taskId != "honeyfix") {
                admin.firestore().collection('users').doc(userId).update({fixes_done: increment});
            }
            admin.firestore().collection('fixes').doc(taskId + '-' + userId).set({nr_visits: 1, time_spent: 0}, { merge: true });
        }
    } else { // No task could be found
        res.status(400).send("No task found!");
    }
});

exports.requestVerify = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    var userId = req.query.uid;
    var user = await admin.firestore().collection('users').doc(userId).get();
    user = user.data();
    var userVerifies = user.verifies_done;
    var honey_status = user.honey_status_verify;

    var taskId;
    var newTask = false;

    if (honey_status >= 0) {
        var verifies = await admin.firestore().collection('verifies').where("userId", "==", userId).where("status", "==", 0).get();
        if (!verifies.empty) { // Check if task is open for user
            taskId = verifies.docs[0].data().taskId;
            admin.firestore().collection('verifies').doc(taskId + '-' + userId).update({nr_visits: increment});
        } else if (honey_status == 0) {
            taskId = "honeyverify";
            newTask = true;
        } else if (userVerifies < verifyLimit) { // Check if user limit is not reached
            var tasks = await admin.firestore().collection('tasks').where("status", "==", 1).get();
            var doc;
            for (doc of tasks.docs) {
                var curTaskId = doc.data().taskId;

                var fixes = await admin.firestore().collection('fixes').where("taskId", "==", curTaskId).get();
                verifies = await admin.firestore().collection('verifies').where("taskId", "==", curTaskId).get();
            
                var users = [];
                if (!fixes.empty) {
                    users = users.concat(fixes.docs.map((doc) => doc.data().userId));
                }
                if (!verifies.empty) {
                    users = users.concat(verifies.docs.map((doc) => doc.data().userId));
                }
                if (!users.includes(userId)) {
                    taskId = curTaskId;
                    newTask = true;
                    break;
                }
            }
        }
    }

    if (taskId == "honeyverify") {
        admin.firestore().collection('tasks').doc(taskId).get().then(async function (doc) {
            let verify = {
                explanation: "",
                fair: false,
                taskId: taskId,
                userId: userId,
                status: 0
            }
            admin.firestore().collection('verifies').doc(taskId + '-' + userId).set(verify, { merge: true });

            var task = await admin.firestore().collection('tasks').doc(taskId).get();
            task = task.data();

            let userTask = {
                taskId: task.taskId,
                userId: userId,
                algorithm: task.algorithm,
                fix: task.fix,
                explanations: task.explanations,
                preferences: [task.song_user_pref_0, task.song_user_pref_1, task.song_user_pref_2]
            }

            res.send(JSON.stringify(userTask));

            if (newTask) {
                admin.firestore().collection('verifies').doc(taskId + '-' + userId).set({nr_visits: 1, time_spent: 0}, { merge: true });
            }
        })
    } else if (taskId != null) { // Assign the task
        admin.firestore().collection('tasks').doc(taskId).get().then(async function (doc) {
            let verify = {
                explanation: "",
                fair: false,
                taskId: taskId,
                userId: userId,
                status: 0,
                time: 0
            }
            admin.firestore().collection('verifies').doc(taskId + '-' + userId).set(verify, { merge: true });
            
            var aggregate = await admin.firestore().collection('aggregate').doc(taskId).get();
            aggregate = aggregate.data();
            var task = await admin.firestore().collection('tasks').doc(taskId).get();
            task = task.data();

            let userTask = {
                taskId: task.taskId,
                userId: userId,
                algorithm: task.algorithm,
                fix: aggregate.user_gen_fix,
                explanations: aggregate.user_gen_expl,
                preferences: [task.song_user_pref_0, task.song_user_pref_1, task.song_user_pref_2]
            }

            res.send(JSON.stringify(userTask));
        });
        if (newTask) {
            admin.firestore().collection('verifies').doc(taskId + '-' + userId).set({nr_visits: 1, time_spent: 0}, { merge: true });
            admin.firestore().collection('users').doc(userId).update({verifies_done: increment});
        }
    } else { // No task could be found
        res.status(400).send("No task found!");
    }
});

exports.incrementTime = functions.https.onRequest(function (req, res) {
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    var data = JSON.parse(req.body);

    admin.firestore().collection(data.type).doc(data.taskId + '-' + data.userId).update({
        time_spent: admin.firestore.FieldValue.increment(data.time)
    });

    res.status(200).send('');
});

exports.onWriteFix = functions.firestore.document('fixes/{id}').onWrite(async (change, context) => {
    const newValue = change.after.data();

    if (newValue != null && newValue.status == 1) {
        if (newValue.taskId == "honeyfix") {
            // The worker must say the list was not fair
            let fair = newValue.fair;
            if (!fair) {
                admin.firestore().collection('users').doc(newValue.userId).set({honey_status_fix: 1}, {merge: true});
            } else { // The worker can't make new tasks
                admin.firestore().collection('users').doc(newValue.userId).set({honey_status_fix: -1}, {merge: true});
            }
        } else {
            var fixes = await admin.firestore().collection('fixes').where("taskId", "==", newValue.taskId).where("status", "==", 1).get();
            var algo_list = await admin.firestore().collection('tasks').doc(newValue.taskId).get();
            algo_list = algo_list.data();
            var allStatus = fixes.docs.map((doc) => doc.data().status);
            var sum = allStatus.reduce(function (a, b) {
                return a + b;
            }, 0);

            if (sum == fixesRequired) {
                // fair count
                var fair_count = 0;
                // dict with just song count (id => count)
                var song_list_count = {}
                // dict with users that chose the song (id => userId)
                var song_with_users = {}
                // dict with all songs (id => info)
                var song_lookup = {}
                // All fixes as json before merged.
                var fixes_jsons = []
                
                // Fill the dicts with data
                fixes.forEach(doc => {
                    // plus casts fair: true = 1, false = 0
                    fair_count = fair_count + +(doc.data().fair)
                    
                    // Append JSON
                    fixes_jsons.push(doc.data());

                    // Iterate over all the song in the list
                    doc.data().fix.forEach(function (song) {
                        // Unique song in the list
                        if (!(song["id"] in song_list_count)) {
                            song_list_count[song["id"]] = 1;
                            song_with_users[song["id"]] = [doc.data().userId];
                            song_lookup[song["id"]] = song;
                        } else {
                            // Not unique song
                            song_list_count[song["id"]] = song_list_count[song["id"]] + 1;
                            song_with_users[song["id"]].push(doc.data().userId);
                        }
                    });
                });
                
                // If fair >= 3 -> put in results
                if (fair_count >= 3) {
                    let json_object = new Object();
                    json_object['taskId'] = fixes_jsons[0].taskId;
                    json_object['algorithm'] = algo_list.algorithm;

                    // Gather the "fair" explanations
                    let fair_expl = {}
                    fixes_jsons.forEach(function (item) {
                        if (item.fair) {
                            fair_expl[item.userId] = item.explanation
                        }
                    });

                    json_object['algorithm_expl'] = fair_expl;
                    json_object['fair'] = true;

                    // Set status of task to 2
                    admin.firestore().collection('tasks').doc(newValue.taskId).update({status: 2});

                    // Adds it to the results table
                    return await admin.firestore()
                    .collection('results')
                    .doc(fixes_jsons[0].taskId)
                    .set(json_object);
                } else {
                    // Its deemed not fair, check if there is concensus.
                    // Create sorted songs based on count array
                    var sorted_count_song = Object.keys(song_list_count).map(function(song_id) {
                        return [song_id, song_list_count[song_id]];
                    });
                    // Sort the array based on the count
                    sorted_count_song.sort(function(first, second) {
                        return second[1] - first[1];
                    });
                    // Now append only songs with count of three or more
                    var consensus_songs = [];

                    sorted_count_song.forEach(function(song_and_count) {
                        if (song_and_count[1] >= 3) {
                            consensus_songs.push(song_and_count[0]);
                        }
                    });

                    // If the list is smaller than 5 songs then no concensus.
                    // Its unchanged but not deemed fair thus rerouted to results.
                    if (consensus_songs.length < 5) {
                        let json_object = new Object();
                        json_object['taskId'] = fixes_jsons[0].taskId;
                        json_object['algorithm'] = algo_list.algorithm;

                        // Gather the "unfair" explanations
                        let unfair_expl = {}
                        fixes_jsons.forEach(function (item) {
                            if (!(item.fair)) {
                                unfair_expl[item.userId] = item.explanation
                            }
                        });

                        json_object['algorithm_expl'] = unfair_expl;
                        // Less than 3 people thought it was fair
                        // But there was no consensus on the solution
                        json_object['fair'] = false;

                        // Set status of task to 2
                        admin.firestore().collection('tasks').doc(newValue.taskId).update({status: 2});

                        // Adds it to the results table
                        return await admin.firestore()
                        .collection('results')
                        .doc(fixes_jsons[0].taskId)
                        .set(json_object);
                    } else {
                        // It is unfair, there is concensus how to change
                        // is put into verify.
                        let json_object = new Object();
                        json_object['taskId'] = fixes_jsons[0].taskId;
                        json_object['algorithm'] = algo_list.algorithm;

                        // create consensus list
                        let user_gen_fix = [];
                        let top_five_songs = consensus_songs.slice(0, 5);

                        top_five_songs.forEach(function(song_id) {
                            user_gen_fix.push(song_lookup[song_id]);
                        });
                        json_object['user_gen_fix'] = user_gen_fix;

                        let last_song = top_five_songs[top_five_songs.length - 1];
                        let user_gen_expl = [];

                        fixes_jsons.forEach(function(fix_json) {
                            if (song_with_users[last_song].includes(fix_json["userId"])) {
                                user_gen_expl.push(fix_json["explanation"]);
                            }
                        });
                        json_object['user_gen_expl'] = user_gen_expl;

                        // Set status of task to 1
                        admin.firestore().collection('tasks').doc(newValue.taskId).update({status: 1});

                        // Adds it to the aggregate table
                        return await admin.firestore()
                        .collection('aggregate')
                        .doc(fixes_jsons[0].taskId)
                        .set(json_object);
                    }
                }
            }
        }
    }
});

exports.onWriteVerify = functions.firestore.document('verifies/{id}').onWrite(async (change, context) => {
    const newValue = change.after.data();

    if (newValue != null && newValue.status == 1) {
        if (newValue.taskId == "honeyverify") {
            // The worker must say the new list is fair
            let fair = newValue.fair;
            if (fair) {
                admin.firestore().collection('users').doc(newValue.userId).set({honey_status_verify: 1}, {merge: true});
            } else { // The worker can't make new tasks
                admin.firestore().collection('users').doc(newValue.userId).set({honey_status_verify: -1}, {merge: true});
            }
        } else {
            var verifies = await admin.firestore().collection('verifies').where("taskId", "==", newValue.taskId).where("status", "==", 1).get()
            var algo_list = await admin.firestore().collection('aggregate').doc(newValue.taskId).get();
            algo_list = algo_list.data();
            var allStatus = verifies.docs.map((doc) => doc.data().status);
            var sum = allStatus.reduce(function (a, b) {
                return a + b;
            }, 0);

            if (sum == verifiesRequired) {
                // fair count
                var fair_count = 0;
                // All fixes as json before merged.
                var verifies_jsons = []
                
                // Fill the dicts with data
                verifies.forEach(doc => {
                    // plus casts fair: true = 1, false = 0
                    fair_count = fair_count + +(doc.data().fair)
                    
                    // Append JSON
                    verifies_jsons.push(doc.data());
                });

                let json_object = new Object();
                json_object['taskId'] = algo_list.taskId;
                json_object['algorithm'] = algo_list.algorithm;
                json_object['algorithm_explain_user'] = algo_list.user_gen_expl;
                json_object['user_verify'] = algo_list.user_gen_fix;
                
                if (fair_count >= 3) {
                    // Gather the "fair" explanations
                    let fair_expl = {}
                    verifies_jsons.forEach(function (item) {
                        if (item.fair) {
                            fair_expl[item.userId] = item.explanation
                        }
                    });
                    json_object['user_verify_explain'] = fair_expl;
                    json_object['fair'] = true;
                } else {
                    // Gather the "unfair" explanations
                    let fair_expl = {}
                    verifies_jsons.forEach(function (item) {
                        if (!(item.fair)) {
                            fair_expl[item.userId] = item.explanation
                        }
                    });
                    json_object['user_verify_explain'] = fair_expl;
                    json_object['fair'] = false;
                }

                admin.firestore().collection('tasks').doc(newValue.taskId).update({status: 2});

                // Adds it to the aggregate table
                return await admin.firestore()
                .collection('results')
                .doc(verifies_jsons[0].taskId)
                .set(json_object);
            }
        }
    }
});
