import React, {useState} from 'react';
import './App.css';

function App() {
  return <main>
  <header> 
    <img className="logo" src="http://pngimg.com/uploads/nike/nike_PNG11.png"/>
    Chatter 
  </header>

  <TextInput onSend={t=> console.log(t)}/>

  </main>
}

function TextInput(props){
  var [text, setText] = useState('')

  return <div className="text-input">
    <input value={text} 
      placeholder="Message..."
      onChange={e=> setText(e.target.value)}
    />
    <button onClick={()=> {
      props.onSend(text)
      setText('')
    }}>
      <i class='fas fa-angle-right'></i>
    </button>
  </div>
}

export default App;
