import React, { useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import ai from "../assets/ai.png"
import { RiMicAiFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../App';
import axios from 'axios';
import start from "../assets/start.mp3"
function SearchwithAi() {
    const startSound=new Audio(start)
    const navigate=useNavigate()
    const [input,setInput]=useState("")
    const [recommendations,setRecommendations]=useState([])
    
    function speak(message){
        let utterance=new SpeechSynthesisUtterance(message)
        window.speechSynthesis.speak(utterance)
    }
    const SpeechRecognition=window.SpeechRecognition || window.webkitSpeecRecognition
    const recognition=new SpeechRecognition()
    if(!recognition){
        toast.error("Speech recognition not supported")
    }
   
    const handleSearch=async()=>{
        if(!recognition)
             return ;
        recognition.start()
        start.play()
        recognition.onresult=async(e)=>{
           const transcript=e.results[0][0].transcript.trim()
           setInput(transcript)
           await handleRecommendation(transcript)
        }
    }

    const handleRecommendation=async(query)=>{
       try{
         const result=await axios.post(serverUrl+"/course/search",{input:query},{withCredentials:true})
         console.log(result.data)
         setRecommendations(result.data)
         if(result.data.length>0){
            speak("These are the top courses I found for you")
         }
         else{
            speak("No courses found")
         }
       } catch(error){
          console.log(error)
       }
    }
  return (
    <div className='min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-16'>
        {/*search container */}
        <div className='bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative'>
          <FaArrowLeftLong className='text-[black] w-[22px] h-[22px] cursor-pointer absolute'/>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2'><img src={ai} alt="" className='w-8 h-8 sm:w-[30px] sm:h-[30px]'/>Search with <span className='text-[#CB99C7'>AI</span></h1>

          <div className='flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full'>
            <input type="text" className='flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base'
            placeholder='what do you want to learn? (e.g.AI,MERN,Cloud...)' onChange={(e)=>setInput(e.target.value)} value={input}/>

            {input && <button className='absolute right-14 sm:right-16 bg-white rounded-full'><img src={ai} alt="" className='w-10 h-10 p-2 rounded-full' onClick={()=>handleRecommendation(input)}/></button>}
            <button className='absolute  right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center' onClick={handleSearch}>
             <RiMicAiFill className='w-5 h-5 text-[#cb87c5]'/>
            </button>
          </div>

        </div>
         {recommendations.length>0?(
            <div></div>

         ):(
            
         )}
    </div>
  )
}

export default SearchwithAi