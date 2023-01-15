import {React,useEffect, useState,useRef} from 'react'
import ChatText from './ChatText';
import ProfileBar from './ProfileBar';
import SecureImage from '../images/icons8-protect-48.png'
import SecureLock from "../images/lockIcon.png"
import fileclip from "../images/fileclip.png"
import FileBox from '../components/FileBox'

function Chat({loginStatus,socket_io}) {
    console.log("Chat Mounted");
    const currentUser = JSON.parse(sessionStorage.getItem("userInfo"))
    const [userMessage,setUsermessage] = useState([])
    const [typeMessage,setTypeMessage] = useState("")
    const [roomUsers,setRoomUsers] = useState([])
    const [showFileBox,setShowFileBox] = useState(false)
    const [userImage ,setUserImage] = useState("")
    const [search, setsearch] = useState("")
    const file = useRef()
    const captionRef = useRef()

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [userMessage]);

    const getTime = ()=>{
        var time = new Date();
        return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
    const getFile = ()=>{
        file.current.click();
    }
    const sendFile = ()=>{
        socket_io.emit("upload", {
            "name":file.current.value.split('\\').pop(),
            "username":currentUser.username,
            "caption": captionRef.current.value.trim(),
            "room":currentUser.room,
            "buffer":file.current.files[0]
        }, (status) => {
            console.log(status);
            if(status.message){
                setUsermessage((prev)=>[...prev,{
                    "username":currentUser.username,
                    "image":status.imageUrl,
                    "caption": captionRef.current.value.trim(),
                    "type":"user",
                    "time":getTime()
                }])
                
            }
            setShowFileBox(false)
        });
    }

    const showFile = () => {
        const objectUrl = URL.createObjectURL(file.current.files[0])

        setUserImage(objectUrl)
        setShowFileBox(true)
     }
    useEffect(() => {
        console.log("Chat useEffect")

        socket_io.on("receiveMsg",(msg)=>{
             console.log("new Message",msg);
             msg["time"] = getTime()
             setUsermessage((prev)=>[...prev,msg])
             scrollToBottom()
        })
        socket_io.emit("getRoomUsers","",(data)=>setRoomUsers(data.users))

        socket_io.on("usersNewJoin",(data=>{
            console.log("UserList",data);
            setRoomUsers(data.users)
        }))

        return ()=>{
            socket_io.emit("clientLeft")
        }
        // eslint-disable-next-line
     }, [])

    // sending message
    const sendMessage = ()=>{
        if(typeMessage.trim()==="") return
        socket_io.emit("sendMsg",{"username":currentUser.username,"room":currentUser.room,"message":typeMessage})

        // adding current user message to display area right
        setUsermessage((prev)=>[...prev,{"username":currentUser.username,"message":typeMessage,"type":"user","time":getTime()}])
        console.log("Message Sent",typeMessage);
        setTypeMessage("");
    }

    

    
    return (
        <>
        { showFileBox && <FileBox showToggle={setShowFileBox} previewImage={userImage} sendFileFunc={sendFile} captionText ={captionRef} /> }
        <div className="2xl:w-4/6 md:w-full chatUI mx-auto mt-20 flex">
            <div className="bg-green-600 w-1/3 rounded-l-md">
                <div className="text-2xl text-white pl-3 pt-3">
                    {currentUser.username}
                </div>
                <div className="w-11/12 mx-auto mt-3">
                    <input type="text" placeholder="Search" value={search} onChange={e=>setsearch(e.target.value)} className="rounded-md text-lg w-full p-1 focus:outline focus:outline-green-600" />
                </div>
                <div className="p-1">
                    {
                        // eslint-disable-next-line
                        roomUsers.map((user,index)=>{
                            if(search.trim()==="" || user.includes(search))
                            return <ProfileBar key={user} socket_io={socket_io} username={user} privilege={!index?"admin":"user"} superPrivilege={ currentUser.privilege === "admin" } />
                        })
                    }
                </div>
            </div>
            <div className="w-full bg-green-500 rounded-r-md flex flex-col">
                <div className="p-2  grid grid-cols-2">
                    <h2 className="text-white text-2xl">{currentUser.room.split("_")[1]} Room</h2>
                    <div className="flex justify-end items-center row-span-2">
                        <button onClick={()=>loginStatus("")} className="bg-green-600 border w-20 hover:bg-white hover:text-green-800 border-white text-white px-2 py-1 rounded-md text-lg">Logout</button>
                    </div>
                    <p className="text-sm text-white flex gap-1 mt-1">
                        {
                            currentUser.room.split("_")[0] === "public"?
                        <img className="w-5" src={SecureImage} alt="" />:
                        <img className="w-5" src={SecureLock} alt="" />
                        }
                    {currentUser.room.split("_")[0]} chat</p>
                </div>
                
                <div className="bg-gray-200 p-3 overflow-y-auto h-5/6">
                    {
                        userMessage.map((msg,index)=>{
                            return <ChatText key={(msg.message || msg.caption)+index } data={msg} type={msg.type || "friends"}/>
                        })
                    }
                      <div ref={messagesEndRef} />
                </div>
                <div className="p-1 m-1 h-1/8 w-11/12 border-2 bg-white flex items-center rounded-md mx-auto">
                    <button onClick={getFile} className="p-0 px-4 hover:scale-105"> 
                            <img className="w-8 h-8" src={fileclip} alt="" />
                            <input type="file" ref={file} onChange={showFile}  name="file" style={{"display":"none"}} />
                    </button>
                    <input type="text" placeholder="write something..."  onChange={(e)=>setTypeMessage(e.target.value)} value={ typeMessage } className="w-full text-xl p-1 outline-none" />
                    <button onClick={sendMessage} className="p-0 px-4 hover:scale-105"> 
                        <img className="w-8 h-8" src="https://cdn-icons-png.flaticon.com/512/3318/3318406.png" alt="" />
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}

export default Chat;