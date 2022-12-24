import React from 'react'

function FileBox(props) {
    console.log("FileBox");
  return (
    <div className="alertBoxColor  w-full h-full absolute inset-0 flex justify-center items-center">
        <div className="opacity-100 rounded-md overflow-hidden bg-white w-1/4 h-80">
            <div className="w-3/3 h-3/5 p-2">
                <img src={props.previewImage} alt="" className="w-full h-full" />
            </div>
            <div className=" flex flex-col">
                <label htmlFor="caption" className="pl-4 text-lg text-green-600">caption</label>
                <input  ref={props.captionText} className="pl-2 w-11/12 mx-auto text-lg outline-none border-b-2 bg-transparent border-green-500" type="text" id="caption" />
            </div>
            <div className=" flex justify-end mt-3 mr-3">
                <button onClick={props.sendFileFunc} className="border-1 text-lg  py-1 w-20 text-white rounded-md bg-green-500 m-1 hover:bg-green-600" >send</button>
                <button onClick={()=>props.showToggle(false)} className="border-1 text-lg  py-1 w-20 text-white rounded-md bg-orange-500 m-1 hover:bg-orange-600">cancel</button>
            </div>
        </div>
    </div>
  )
}

export default FileBox