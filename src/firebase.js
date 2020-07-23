const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyDzaaWvEJhbJpYICgqn9xPG_N6dglVbkxY",
  authDomain: "ghazibot-30bf6.firebaseapp.com",
  databaseURL: "https://ghazibot-30bf6.firebaseio.com",
  projectId: "ghazibot-30bf6",
  storageBucket: "ghazibot-30bf6.appspot.com",
  messagingSenderId: "227819053594",
  appId: "1:227819053594:web:eaa9cc5e7dfffbfc7827a3",
  measurementId: "G-KP3ZN49X3T",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

module.exports = db;
