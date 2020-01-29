import React, {useState, useEffect} from 'react'
import './App.css'
import {db, useDB} from './db'
import NamePicker from './namepicker'
import { BrowserRouter, Route } from 'react-router-dom'
import { IoIosSend } from 'react-icons/io';

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
  const messages = useDB(room)
  

  console.log(messages)
  
  return <main>

    <header>  
      <div style={{display: 'flex', alignItems: 'center'}}>
        <img className="logo" alt="logo" src="http://pngimg.com/uploads/nike/nike_PNG11.png"/>
        Chatter 
      </div>
      <NamePicker onSave={setName} />
    </header>

    <div className="messages">
      {messages.map((m, i)=> {
        return <div key={i} className="message-wrap"
          from={m.name===name?'me':'you'}>
          <div className="msg-name">{m.name}</div>
          <div className="message" from={m.name===name?'me':'you'}>
            <div className="msg-text" from={m.name===name?'me':'you'}>{m.text}</div>
          </div>
        </div>
      })}
    </div>

    <TextInput onSend={(text)=> {
      db.send({
        text, name, ts: new Date(), room
      })
    }}/>

  </main>
}

function TextInput(props){
  var [text, setText] = useState('')

  return <div className="text-input">
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
}

export default App;
