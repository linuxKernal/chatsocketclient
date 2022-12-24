import { React, useState } from 'react'

function ProfileBar({username,privilege,superPrivilege,socket_io}) {
  const [isHover,setIshover] = useState(true)
  
  let butnView  = "bg-orange-500 rounded-sm  2xl:w-20 sm:w-1/2 p-1 text-white opacity-0"
  if(isHover && privilege!=="admin" && superPrivilege) butnView+="opacity-1"
  const pushTheUser = (user)=>{
    socket_io.emit("clientPush",{"username":user})
  }

  return (
    <div className="p-1 mx-1 my-1 grid grid-cols-2 bg-white rounded-md" onMouseOver={ ()=> setIshover(true) } onMouseLeave = { ()=>setIshover(false) } >
        <h2 className="text-md font-medium text-gray-700">{ username }</h2>
        <div className="row-span-2 flex items-center justify-end">
            <button onClick={()=>pushTheUser(username)} className={butnView}>Left</button>
        </div>
        <p className="text-sm text-gray-400">{ privilege }</p>
    </div>
  )
}


export default ProfileBar;