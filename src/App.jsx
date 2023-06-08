import {useState, useEffect} from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
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
  },[])

  const convertToGif=async()=>{
    ffmpeg.FS('writeFile', 'test.mp4',await fetchFile(video))
  
    await ffmpeg.run('-i','test.mp4','-f','gif','out.gif')

    const data=ffmpeg.FS('readFile','out.gif')

    const url=URL.createObjectURL(new Blob([data.buffer],{type:'image/gif'}))
    setGif(url)
  }

  return ready?(<>
  <div>
    <input type='file' accept='video/*' onChange={(e)=>setVideo(e.target.files?.item(0))}/>
    {video &&
    <div>
        <video controls width="250" src={URL.createObjectURL(video)}/>
        <button className="bg-slate-400 mt-10 outline-1 hover:bg-slate-600" onClick={convertToGif}>Convert</button>
    </div>
   
    }
    {gif && <img src={gif} width="250" />}
  </div>
  
  </>):(<>Loading...</>)
}

export default App
