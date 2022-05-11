const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fr = require("firebase-admin/firestore");
admin.initializeApp();

exports.DeleteUrlScheduler = functions.pubsub
  .schedule("every day 00:00")
  .timeZone("Europe/Berlin")
  .onRun(async (context) => {
    // It runs every day at 00:00
    // It deletes links that are older than 2 weeks and not made by authenticated users
    functions.logger.log(`DeleteUrlScheduler called!`);
    const res = await fr
      .getFirestore()
      .collection("links")
      .where("user", "==", null)
      .get();
    res.forEach((doc) => {
      if (1209600000 < new Date().getTime() - doc.data().dateCreated) {
        doc.ref.delete();
      }
    });
  });
