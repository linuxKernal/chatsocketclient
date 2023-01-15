import React, { useEffect } from 'react'
import Chat from './Chat';
import Login from './Login';
import { useState } from 'react'
import { io } from 'socket.io-client'

const socket = io("https://chatsocketserver-production.up.railway.app")

function App() {
  useEffect(() => {

    socket.on("connect",()=>{
      console.log(socket.id);
    })

  }, [])
  
  const [userLogin,setUserLogin] = useState("")

  return userLogin === ""?<Login setUserLogin = {setUserLogin} socket_io = {socket} />:<Chat socket_io = {socket} loginStatus ={setUserLogin} />
}

export default App;
