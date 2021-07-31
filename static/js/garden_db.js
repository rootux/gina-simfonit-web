(async () => {
    // Those keys are public
    const firebaseConfig = {
        apiKey: "AIzaSyCE8hFi3KD0UtPcJIkUSejcb4P3CSqky28",
        authDomain: "gina-simfonit.firebaseapp.com",
        projectId: "gina-simfonit",
        storageBucket: "gina-simfonit.appspot.com",
        messagingSenderId: "84563402043",
        appId: "1:84563402043:web:cc08db63a397b85ef0eb1e",
        measurementId: "G-TEHFCJKBDB"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    window.db = db;

    const sensors = await db.collection('garden-mekudeshet').doc('sensors').get()
    console.log(sensors.data())

})()