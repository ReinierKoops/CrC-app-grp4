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

    var taskId;
    var newTask = false;

    var fixes = await admin.firestore().collection('fixes').where("userId", "==", userId).where("status", "==", 0).get();
    if (!fixes.empty) { // Check if task is open for user
        taskId = fixes.docs[0].data().taskId;
    } else if (userFixes < fixLimit) { // Check if user limit is not reached
        var tasks = await admin.firestore().collection('tasks').where("status", "==", 0).get();
        var doc;
        for (doc of tasks.docs) {
            curTaskId = doc.data().taskId;

            var fixes = await admin.firestore().collection('fixes').where("taskId", "==", curTaskId).get();
        
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
            admin.firestore().collection('fixes').doc(taskId + '-' + userId).set(fix);
            var task = await admin.firestore().collection('tasks').doc(taskId).get();
            res.send(JSON.stringify(task.data()));
        });
        if (newTask) {
            admin.firestore().collection('users').doc(userId).update({fixes_done: increment});
        }
    } else { // No task could be found
        res.send("No task found!");
    }
});

exports.requestVerify = functions.https.onRequest(async (req, rest) => {
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    var userId = req.query.uid;
    var user = await admin.firestore().collection('users').doc(userId).get();
    user = user.data();
    var userVerifies = user.verifies_done;

    var taskId;
    var newTask = false;

    var verifies = await admin.firestore().collection('verifies').where("userId", "==", userId).where("status", "==", 0).get();
    if (!verifies.empty) { // Check if task is open for user
        taskId = verifies.docs[0].data().taskId;
    } else if (userVerifies < verifyLimit) { // Check if user limit is not reached
        var tasks = await admin.firestore().collection('tasks').where("status", "==", 0).get();
        var doc;
        for (doc of tasks.docs) {
            curTaskId = doc.data().taskId;

            var fixes = await admin.firestore().collection('fixes').where("taskId", "==", curTaskId).get();
            var verifies = await admin.firestore().collection('verifies').where("taskId", "==", curTaskId).get();
        
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

    if (taskId != null) { // Assign the task
        admin.firestore().collection('tasks').doc(taskId).get().then(async function (doc) {
            let verify = {
                explanation: "",
                fair: false,
                taskId: taskId,
                userId: userId,
                status: 0
            }
            admin.firestore().collection('verifies').doc(taskId + '-' + userId).set(verify);\
            // TODO: Get the aggregate
            var task = await admin.firestore().collection('tasks').doc(taskId).get(); // TODO: Replace by an aggregate
            res.send(JSON.stringify(task.data()));
        });
        if (newTask) {
            admin.firestore().collection('users').doc(userId).update({verifies_done: increment});
        }
    } else { // No task could be found
        res.send("No task found!");
    }
});

exports.onWriteFix = functions.firestore.document('fixes/{id}').onWrite(async (change, context) => {
    const newValue = change.after.data();
    if (newValue != null && newValue.status == 1) {
        var fixes = await admin.firestore().collection('fixes').where("taskId", "==", newValue.taskId).get();
        var allStatus = fixes.docs.map((doc) => doc.data().status);
        var sum = allStatus.reduce(function (a, b) {
            return a + b;
        }, 0);

        if (sum >= fixesRequired) {
            admin.firestore().collection('tasks').doc(newValue.taskId).update({status: 1});

            // TODO: Create aggregation and write to db
        }
    }
});

exports.onWriteVerify = functions.firestore.document('verifies/{id}').onWrite(async (change, context) => {
    const newValue = change.after.data();
    if (newValue != null && newValue.status == 1) {
        var verifies = await admin.firestore().collection('verifies').where("taskId", "==", newValue.taskId).get()
        var allStatus = verifies.docs.map((doc) => doc.data().status);
        var sum = allStatus.reduce(function (a, b) {
            return a + b;
        }, 0);

        if (sum >= verifiesRequired) {
            admin.firestore().collection('tasks').doc(newValue.taskId).update({status: 2});
            
            // TODO: Create result aggregation and write to db
        }
    }
});
