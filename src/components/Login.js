import React, { useEffect, useState } from 'react'
import logoImage from '../images/logo.png'


function Login({setUserLogin,socket_io}) {
  const [room, setroom] = useState("user_select")
  const [newRoom, setnewRoom] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rooms, setRooms] = useState([])
  const joinRoom  = (data)=> {
    console.log("Join client Room",data);
    sessionStorage.setItem("userInfo", JSON.stringify(data));
    setUserLogin("success")
  }

  const checkAuth = async ()=>{
    if(room === "create_room")
      socket_io.emit("newroom",{"username":username,"password":password,"room":newRoom})
    else if(room !== "user_select")
      socket_io.emit("joinRoom",{"username":username,"password":password,"room":room})
    
  }
  useEffect(() => {

    socket_io.on("joinRoomSuccess",(data)=>joinRoom(data))
    fetch("https://socketchat.azurewebsites.net/")
    .then(res=> res.json())
    .then(text=>setRooms(text.rooms))
    // eslint-disable-next-line
  }, [])
  
  console.log("Login Mounted")
    return (
      <>
        <div className="header bg-green-400 p-1 flex justify-between items-center">
            <div className="LogoDiv flex items-center w-1/3 pl-10 md:pl-0 ">
              <img src={logoImage} className="w-14" alt="weblogo" /> 
              <h2 className="text-3xl text-white">Socket.io</h2>
            </div>
            <div className="flex md:hidden justify-evenly text-white text-xl items-center grow">
                <span className="navbutn">Home</span>
                <span className="navbutn">Docs</span>
                <span className="navbutn">Products</span>
                <span className="navbutn">About us</span>
            </div>
            <div className="">
                <button className="butn block md:hidden">Get Started</button>
                <div className="hidden md:flex flex-col">
                  <span className="p-0.5 rounded-sm w-10 m-0.5 bg-white"></span>
                  <span className="p-0.5 rounded-sm w-10 m-0.5 bg-white"></span>
                  <span className="p-0.5 rounded-sm w-10 m-0.5 bg-white"></span>
                </div>
            </div>
        </div>
        <div className="relative top-40 w-96 sm:w-80 mx-auto bg-white p-5 rounded-md shadow-xl">
              <div className="loginTitle">
                    <h2 className="text-3xl text-center text-green-700">chat room</h2>
              </div>
              <div className="loginWapper mt-5">
                  <div className="flex bg-gray-100 items-center border-gray-700 mb-3 my-4 rounded-md">
                    <img src="https://img.icons8.com/ios/344/user--v1.png" alt="username" className="w-6 h-6 m-1.5" />
                    <input type="text" id="username" placeholder="Username" value={username} onChange={event=> setUsername(event.target.value)} className="w-full p-2 outline-none bg-transparent" />
                  </div>
                  
                  <div className="flex bg-gray-100 border-gray-700 mb-3  items-center my-4 rounded-md">
                    <img src="https://cdn-icons-png.flaticon.com/512/876/876221.png" alt="username" className="w-5 h-5 m-2" />
                    {room.split("_")[1]==="room"?
                    <input type="text" id="room" placeholder="Room" onChange={(event) => setnewRoom(event.target.value)} value={newRoom} className="w-full p-2 outline-none bg-transparent" />:
                    <select className="w-full p-2 outline-none bg-transparent" onChange={(event) => setroom(event.target.value)} value={room}>
                      <option value="user_select">select room</option>
                      {
                        rooms.map((roomName,index)=>{
                          const roomType = roomName.split('_')[0];
                          const roomText = roomName.split('_')[1];
                          return <option key={index} value={roomName}>{roomType ==="private"?roomText+"🔒":roomText }</option>
                        })
                      }
                      <option value="create_room">create room</option>
                    </select>
                      }
                  </div>
                  { (room.split("_")[0]==="private" || room.split("_")[1]==="room" ) && <div className="flex bg-gray-100 border-gray-700 mb-3 my-4 items-center rounded-md">
                    <img src="https://img.icons8.com/windows/344/lock.png" alt="username" className="w-6 h-6 m-1.5" />
                    <input type="password" id="password" placeholder={room.split("_")[1]==="room"?"Password (optional)":"Password"} value={password} onChange={event=> setPassword(event.target.value)} className="w-full p-2 outline-none bg-transparent" />
                  </div> }
                  <div className="flex justify-center my-4">
                    <button onClick={checkAuth} className="butn w-full p-1.5 text-xl bg-green-500 mx-auto">Join</button>
                  </div>
              </div>
        </div>
      </>
    )
}


export default Login;