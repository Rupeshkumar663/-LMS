import React, { useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import img from "../../assets/empty.jpg"
function EditCourses(){
    const navigate=useNavigate()
    const thumb=useRef()
    const [isPublished,setIsPublished]=useState(false)
    
    return (
        <div className='max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md'>
       {/*top bar */}
        <div className='flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row mb-6 relative'>
            < FaArrowLeftLong className='top-[-20%] md:top-[20%] absolute left-[0] md:left-[2%] w-[22px] h-[22px] cursor-pointer'onClick={()=>navigate("/courses")}/>
            <h2 className='text-2xl font-semibold md:pl-[60px]'>Add Detail Information regarding the Course</h2>
            <div  className='space-x-2 space-y-2'>
               <button className='bg-black text-white px-4 py-2 rounded-md'>Go to Lecture page</button>
            </div>
        </div>
        {/* form details */}
        <div className='bg-gray-100 p-6 rounded-md '>
          <h2 className="text-lg font-medium mb-4">Basic Course Information</h2>
          <div className="flex gap-2 mt-2">
            {!isPublished?<button className='bg-green-100 text-green-600 px-4 py-2 rounded-md border-1'onClick={()=>setIsPublished(prev=>!!prev)}>Click to Publish</button>:<button className='bg-red-100 text-red-600 px-4 py-2 rounded-md border-1'onClick={()=>setIsPublished(prev=>!!prev)}>Click to UnPublish</button>}
            <button className='bg-red-500 text-white px-4 py-2 rounded-md'>Remove Course</button>
            </div>
           
           <form className="space-y-6">
             <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" id="title" className='w-full border px-4 py-2 rounded-md'placeholder="Course Title"/>
             </div>
             <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">SubTitle</label>
                <input type="text" id="subtitle" className='w-full border px-4 py-2 rounded-md'placeholder="Course Subtitle"/>
             </div>

             <div>
                <label htmlFor="des" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea type="text" id="dis" className='w-full border px-4 py-2 rounded-md h-24 resize-none'placeholder="Course Description"></textarea>
             </div>
             <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0'>
                {/* for category */}
                <div className="flex-1">
                  <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1">Course Category</label>
                    <select name="" id="" className="w-full border px-4 py-2 rounded-md bg-white">
                        <option value="">Select Category</option>
                        <option value="App Development">App Development</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="AI Tools">AI Tools</option>
                        <option value="Data Science"> Data Science</option>
                        <option value="Data Analytics">Data Analytics</option>
                        <option value="Ethical Hacking">Ethical Hacking</option>
                        <option value="UI UX Designing">UI UX Designing</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Others">Others</option>
                    </select>

                </div>
                {/* for Level */}
                <div className="flex-1">
                  <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1">Course Level</label>
                    <select name="" id="" className="w-full border px-4 py-2 rounded-md bg-white">
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                       
                    </select>

                </div>
                {/* for price */}
                <div className="flex-1">
                  <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1">Course Price(INR)</label>
                   <input type="number" name="" id="price" className="w-full border px-4 py-2 rounded-md" placeholder="₹"/>
                </div>
              
             </div>
             <div>
                <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>Course Thumbnail</label>
                <input type="file" hidden ref={thumb} accept='image/*'/>
               </div>
               
            <div className='relative max-w-[300px] h-[170px]'>
                    <img src={img} alt="" className="w-[100%] h-[100%] border-1 border-black rounded-[5px] " onClick={()=>thumb.current.onClick()} />
                </div>
           </form>
        </div>
        </div>
    )
}
export default EditCourses