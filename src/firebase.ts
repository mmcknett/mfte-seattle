import firebase from 'firebase/app'
import "firebase/database"

const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DB,
    projectId: process.env.REACT_APP_PID,
    storageBucket: process.env.REACT_APP_SB,
    messagingSenderId: process.env.REACT_APP_SID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MID
};
firebase.initializeApp(firebaseConfig);
// const databaseRef = firebase.database().ref();
// export const buildingsRef = databaseRef.child("buildings")
export default firebase;