import React, {useState, useEffect} from 'react'
import './App.css'
import {db, useDB} from './db'
import NamePicker from './namepicker'
import { BrowserRouter, Route } from 'react-router-dom'

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
  const [name, setName] = useState('Brent')
  const messages = useDB()
  

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
          <div className="message">
            <div className="msg-text">{m.text}</div>
          </div>
        </div>
      })}
    </div>

    <TextInput onSend={(text)=> {
      db.send({
        text, name, ts: new Date()
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
      <i className='fas fa-angle-right'></i>
    </button>
  </div>
}

export default App;
