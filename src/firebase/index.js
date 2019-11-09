import * as firebase from 'firebase';

const firebaseInit = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCILRTZzVD1YvdQjG0HbxHFScbwwd2U04Y",
        authDomain: "product-administrator-dev.firebaseapp.com",
        databaseURL: "https://product-administrator-dev.firebaseio.com",
        projectId: "product-administrator-dev",
        storageBucket: "product-administrator-dev.appspot.com",
        messagingSenderId: "1087762570554",
        appId: "1:1087762570554:web:58e248ec80d5f4977dc403",
        measurementId: "G-K4D4EVFQCS"
    };
    
    firebase.initializeApp(firebaseConfig);
}

export default firebaseInit

