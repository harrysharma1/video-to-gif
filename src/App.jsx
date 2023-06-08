import {useState, useEffect} from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import Skeleton from '@mui/material/Skeleton';

function App() {
  const ffmpeg=createFFmpeg({log:true})
  const [ready, setReady]=useState(false)
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const load= async()=>{
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(()=>{
    load();
  },[video])

  const convertToGif=async()=>{
    ffmpeg.FS('writeFile', 'test.mp4',await fetchFile(video))
  
    await ffmpeg.run('-i','test.mp4','-f','gif','out.gif')

    const data=ffmpeg.FS('readFile','out.gif')

    const url=URL.createObjectURL(new Blob([data.buffer],{type:'image/gif'}))
    setGif(url)
  }

  return (
    <div className="bg-slate-500  w-full h-full absolute items-center justify-center">
      <div className="flex flex-col">
         {
        ready ? (<>
        <div className="flex flex-row space-x-5">
             <div className="flex flex-col">
                <h1 className="text-white">Video:</h1>
               {video && <video controls width="250" src={URL.createObjectURL(video)}></video>}
              </div> 
              <div className="flex flex-col">
                <h1 className="text-white">GIF:</h1>
               {gif && <img src={gif} width="250" />}
              </div> 
             
        </div>
     
        <input type="file" className="mt-5" onChange={(e)=>setVideo(e.target.files?.item(0))}/>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 w-32 h-12" onClick={convertToGif}>Convert</button>
      
        
        </>):(<>Loading...</>)

      }
      </div>
     

    </div>
  )
}

export default App
