import React, {useState, useEffect} from 'react'
import './App.css'
import './media.css'
import {db, useDB} from './db'
import NamePicker from './namepicker'
import { BrowserRouter, Route } from 'react-router-dom'
import { IoIosSend } from 'react-icons/io';
import Camera from 'react-snap-pic'
import { FiCamera } from 'react-icons/fi'
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

function App(){
  useEffect(()=>{
    const {pathname} = window.location
    if(pathname.length<2) window.location.pathname='home'
  }, [])
  return <BrowserRouter>
    <Route path="/:room" component={Room}/>
  </BrowserRouter>
}

function Room(props) {
  const {room} = props.match.params
  // const [messages, setMessages]= useState([])
  const [name, setName] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const messages = useDB(room)

  async function takePicture(img) {
    setShowCamera(false)
    const imgID = Math.random().toString(36).substring(7)
    var storageRef = firebase.storage().ref()
    var ref = storageRef.child(imgID + '.jpg')
    await ref.putString(img, 'data_url')
    db.send({ img: imgID, name, ts: new Date(), room })
  }
  
  return <main>

    {showCamera && <Camera takePicture={takePicture} />}

    <header>  
      <div style={{display: 'flex', alignItems: 'center'}}>
        <img className="logo" alt="logo" src="http://pngimg.com/uploads/nike/nike_PNG11.png"/>
        Chatter 
      </div>
      <NamePicker onSave={setName} />
    </header>

    <div className="messages">
      {messages.map((m, i)=> <Message key={i} m={m} name={name} />)}
    </div>

    <TextInput 
      showCamera = {()=>setShowCamera(true)}
      onSend={(text)=> {
        db.send({
          text, name, ts: new Date(), room
        })
    }}/>

  </main>
}

const bucket = 'https://firebasestorage.googleapis.com/v0/b/chatter2020-c42f8.appspot.com/o/'
const suffix = '.jpg?alt=media'

function Message({m, name}){
  return <div className="message-wrap"
    from={m.name===name?'me':'you'}>
    <div className="msg-name">{m.name}</div>
    <div className="message" from={m.name===name?'me':'you'}>
      <div className="msg-text" from={m.name===name?'me':'you'}>{m.text}</div>
      {m.img && <img src={bucket+m.img+suffix} /> }
    </div>
  </div>
}

function TextInput(props){
  var [text, setText] = useState('')

  return <div className="text-input">
    <div className="camera-wrapper">
      <button className="camera" onClick={props.showCamera}>
          <FiCamera style={{height:15, width:15}}></FiCamera>
      </button>
      <input className="special"value={text} 
        placeholder="Message..."
        onChange={e=> setText(e.target.value)}
        onKeyPress={e=> {
          if(e.key==='Enter') {
            if(text) props.onSend(text)
            setText('')
          }
        }}/>
      <button onClick={()=> {
        if(text) {
          props.onSend(text)
        }
        setText('')
      }} className = "button"
        disabled={!text}>
        <i className='send'><IoIosSend/></i>
      </button>
    </div>
  </div>
}

export default App;
