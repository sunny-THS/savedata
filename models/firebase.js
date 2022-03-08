const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

var serviceAccount = require(process.env.SUNNY_DRIVE_FIREBASE_SERVICE_ACCOUNT_KEY);

const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.SUNNY_DRIVE_FIREBASE_STORAGE_BUCKET
});

const storage = getStorage(app);

module.exports = {
    storage
}