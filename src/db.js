import {useState, useEffect} from 'react'
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

let store
const coll = 'messages'

function useDB(room) {
    const [messages, setMessages] = useState([])
    function add(m) {
        setMessages(current => {
            const msgs = [m, ...current]
            msgs.sort((a,b)=> b.ts.seconds - a.ts.seconds)
            return msgs
        })
    }
    function remove(id) {
        setMessages(current=> current.filter(m=> m.id!==id))
    }
    useEffect(() => {
        store.collection(coll)
        .where('room','==',room)
        .onSnapshot(snap=> snap.docChanges().forEach(c=> {
            const {doc, type} = c
            if (type==='added') add({...doc.data(),id:doc.id})
            if (type==='removed') remove(doc.id)
        }))
    }, [])
    return messages
}

const db = {}
db.send = function(msg) {
    return store.collection(coll).add(msg)
}
db.delete = function(id) {
    return store.collection(coll).doc(id).delete()
}

export { db, useDB }

const firebaseConfig = {
    apiKey: "AIzaSyAItEo7BzVRCLTbdNVR3x2jqlAcEkVsubk",
    authDomain: "chatter2020-c42f8.firebaseapp.com",
    databaseURL: "https://chatter2020-c42f8.firebaseio.com",
    projectId: "chatter2020-c42f8",
    storageBucket: "chatter2020-c42f8.appspot.com",
    messagingSenderId: "62378909127",
    appId: "1:62378909127:web:8094c17dc1b1fbd50acde2",
    measurementId: "G-PWHVFM55VB"
}

firebase.initializeApp(firebaseConfig)
store = firebase.firestore()