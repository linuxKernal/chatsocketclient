import React from 'react'

function ChatText({data,type}) {
  let messageBox = ""
  let messageStyle = ""

  if(type === "info") 
  {
    messageBox = "flex items-center"
    messageStyle = "bg-gray-100 text-white rounded-md text-gray-500"
  }
  else if(type === "user") {
    messageBox = "flex items-end"
    messageStyle = "bg-white rounded-t-lg rounded-l-lg"

  }
  else if(type === "friends"){
    messageBox = "flex items-start"
    messageStyle = "bg-white rounded-t-lg rounded-r-lg"

  }

  return (
        <div className={messageBox+" flex-col my-2"}>
          <span className={"p-1 my-2 max-w-lg  inline-block "+messageStyle} >
            {type !== "info" && <h3 className="text-gray-500">{data.username}</h3>}
           { data.message ? <p>{data.message}</p>:
            <img src={"https://chatsocketserver-production.up.railway.app/"+data.image} alt="" className="w-72 h-60" />
           }
           {<p className="pl-1">{data.caption}</p>}
          </span>
          <p className="text-xs text-gray-500">{type !== "info" && data.time}</p>
        </div>
    
  )

}

export default ChatText