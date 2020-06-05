const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const fixLimit = 5;
const verifyLimit = 5;

const fixesRequired = 5;
const verifiesRequired = 5;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.requestFix = functions.https.onRequest((req, res) => {
    var userId = req.query.uid;

    admin.firestore().collection('users').doc(userId).get().then(function (doc) {
        var user = doc.data();
        var userFixes = user.fixes_done;

        admin.firestore().collection('fixes').where("userId", "==", userId).where("status", "==", 0).then(function (qSnapshot) {
            var taskId;
            if (qSnapshot.docs.length > 0) { // Check if task is open for user
                taskId = qSnapshot.docs[0].data().taskId;
            } else if (userFixes < fixLimit) { // Check if user limit not reached
                admin.firestore().collection('tasks').where("status", "==", 0).then(function (qSnapshot) {
                    qSnapshot.docs.some(function (doc) {
                        var curTaskId = doc.data().taskId;

                        admin.firestore().collection('fixes').where("taskId", "==", curTaskId).then(function (qSnapshot) {
                            var users = qSnapshot.map(function (doc) {
                                return doc.data().userId;
                            })
                            if (!users.includes(userId)) {
                                taskId = curTaskId;
                            }
                        })

                        return taskId != null;
                    })
                })
            }

            if (taskId != null) { // Assign the task
                admin.firestore().collection('tasks').doc(taskId).then(function (doc) {
                    let fix = {
                        explanation: "",
                        fair: false,
                        fix: [],
                        taskId: taskId,
                        userId: userId,
                        status: 0
                    }
                    admin.firestore.collection('fixes').doc(taskId + '-' + userId).set(fix);

                    res.send(admin.firestore().collection('tasks').doc(taskId));
                })
            } else { // No task could be found
                res.send("We could not find a task for you!");
            }
        });
    });
});

exports.requestVerify = functions.https.onRequest((req, rest) => {
    var userId = req.query.uid;

    admin.firestore().collection('users').doc(userId).get().then(function (doc) {
        var user = doc.data();
        var userVerifies = user.verifies_done;

        admin.firestore().collection('verifies').where("userId", "==", userId).where("status", "==", 0).then(function (qSnapshot) {
            var taskId;
            if (qSnapshot.docs.length > 0) { // Check if task is open for user
                taskId = qSnapshot.docs[0].data().taskId;
            } else if (userVerifies < verifyLimit) { // Check if user limit not reached
                admin.firestore().collection('tasks').where("status", "==", 1).then(function (qSnapshot) {
                    qSnapshot.docs.some(function (doc) {
                        var curTaskId = doc.data().taskId;

                        admin.firestore().collection('fixes').where("taskId", "==", curTaskId).then(function (qSnapshot) {
                            var users = qSnapshot.map(function (doc) {
                                doc.data().userId;
                            })
                            if (!users.includes(userId)) {
                                admin.firestore('verifies').where("taskId", "==", curTaskId).then(function (qSnapshot) {
                                    var users = qSnapshot.map(function (doc) {
                                        doc.data().userId;
                                    })
                                    if (!users.includes(userId)) {
                                        taskId = curTaskId;
                                    }
                                })
                            }
                        })

                        return taskId != null;
                    })
                })
            }

            if (taskId != null) { // Assign the task
                admin.firestore().collection('tasks').doc(taskId).then(function (doc) {
                    let verify = {
                        explanation: "",
                        fair: false,
                        taskId: taskId,
                        userId: userId,
                        status: 0
                    }
                    admin.firestore.collection('fixes').doc(taskId + '-' + userId).set(verify);

                    res.send(admin.firestore().collection('tasks').doc(taskId));
                })
            } else { // No task could be found
                res.send("We could not find a task for you!");
            }
        });
    });
});

exports.onWriteFix = functions.firestore.document('fixes/{doc-id}').onWrite((change, context) => {
    const newValue = change.after.data();
    if (newValue != null && newValue.status == 1) {
        admin.firestore().collection('fixes').where("taskId", "==", newValue.taskId).then(function (qSnapshot) {
            var allStatus = qSnapshot.map(function (doc) {
                return doc.data().status;
            });
            var sum = allStatus(function (a, b) {
                return a + b;
            }, 0);

            if (sum >= fixesRequired) {
                admin.firestore().collection('tasks').doc(newValue.taskId).update({status: 1});

                // Create aggregation
            }
        });
    }
});

exports.onWriteVerify = functions.firestore.document('verifies/{doc-id}').onWrite((change, context) => {
    const newValue = change.after.data();
    if (newValue != null && newValue.status == 1) {
        admin.firestore().collection('verifies').where("taskId", "==", newValue.taskId).then(function (qSnapshot) {
            var allStatus = qSnapshot.map(function (doc) {
                return doc.data().status;
            });
            var sum = allStatus(function (a, b) {
                return a + b;
            }, 0);

            if (sum == verifiesRequired) {
                admin.firestore().collection('tasks').doc(newValue.taskId).update({status: 2});
                
                // Process result
            }
        });
    }
});
