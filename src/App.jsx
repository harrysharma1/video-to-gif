import {useState, useEffect} from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import * as AiIcons from 'react-icons/ai'
function App() {
  const ffmpeg=createFFmpeg({log:true})
  const [ready, setReady]=useState(false)
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [mp3,setMp3]=useState();

  const load= async()=>{
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(()=>{
    load();
  },[video,gif,mp3])

  const deleteVideo=()=>{
    setVideo(null);
    window.location.reload();
  }

  const deleteGif=()=>{
    setGif(null);
  }

  const deleteMp3=()=>{
    setMp3(null);
  }

  const convertToGif=async()=>{
    if (!video){
      alert("Please upload a video");
      return;
    }
    ffmpeg.FS('writeFile', 'test.mp4',await fetchFile(video))
    
    await ffmpeg.run('-i','test.mp4','-f','gif','out.gif')

    const data=ffmpeg.FS('readFile','out.gif')

    const url=URL.createObjectURL(new Blob([data.buffer],{type:'image/gif'}))
    setGif(url)
  }

  const convertToMp3=async()=>{
    if (!video){
      alert("Please upload a video");
      return;
    }
    ffmpeg.FS('writeFile', 'test.mp4',await fetchFile(video))
  
    await ffmpeg.run('-i','test.mp4','-f','mp3','out.mp3')

    const data=ffmpeg.FS('readFile','out.mp3')

    const url=URL.createObjectURL(new Blob([data.buffer],{type:'audio/mp3'}))
    setMp3(url)
  }

  return (
    <div className="bg-slate-500  w-full h-full absolute">
      <div className="flex flex-col  items-center justify-center">
         {
        ready ? (<>
        <div className="flex flex-row space-x-5">
             <div className="flex flex-col">
                <h1 className="text-white">Video:</h1>
                {video&&<AiIcons.AiTwotoneDelete size={25} className="text-white cursor-pointer hover:text-red-600 ml-[230px]" onClick={deleteVideo}/>}
                {video && <video controls width="250" src={URL.createObjectURL(video)}/>}
              </div> 
              <div className="flex flex-col">
                <h1 className="text-white">GIF:</h1>
                {gif&&<AiIcons.AiTwotoneDelete size={25}className="text-white cursor-pointer hover:text-red-600" onClick={deleteGif}/>}
               {gif && <img src={gif} width="250" />}
              </div> 
              <div className="flex flex-col">
                <h1 className="text-white">Mp3:</h1>
                {mp3&&<AiIcons.AiTwotoneDelete size={25} className="text-white cursor-pointer hover:text-red-600" onClick={deleteMp3}/>}
                {mp3 && <audio controls src={mp3} width="250" />}
              </div>
             
        </div>
     
        <input type="file" className="mt-5" onChange={(e)=>setVideo(e.target.files?.item(0))}/>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded mt-5 w-32 h-12" onClick={convertToGif}>Convert to GIF</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded mt-5 w-32 h-12" onClick={convertToMp3}>Convert to Mp3</button>
       
        </>):(<>Loading...</>)

      }
      </div>
     

    </div>
  )
}

export default App
