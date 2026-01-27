import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setSelectedCourse } from "../redux/courseSlice";
import img from "../assets/empty.jpg";
import { FaPlayCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import Card from "../component/Card";
import { toast } from "react-toastify";

function ViewCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const {userData}=useSelector(state=>state.user)
  const { courseData, selectedCourse } = useSelector(
    (state) => state.course
  );

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData,setCreatorData]=useState(null)
  const [creatorCourses,setcreatorCourses]=useState(null)
  const [isEnrolled,setIsEnrolled]=useState(false)

  useEffect(()=>{
    

    const handleCreator=async()=>{
       if(selectedCourse?.creator){
         try{
            const result=await axios.post(serverUrl+"/api/course/creator",{userId:selectedCourse?.creator},{withCredentials:true})
            console.log(result.data)
            setCreatorData(result.data)
         } catch(error){
          console.log(error)

         }
      }
    }
    handleCreator()
  },[selectedCourse])

  const checkEnrollment=()=>{
    const verify=userData?.enrolledCourses?.some(c=>
      (typeof c==='string'?c :c._id).toString()===courseId?.toString())
      if(verify){
        setIsEnrolled(true)
      }
    
  }

  useEffect(()=>{
     if(creatorData?._id && courseData.length>0){
      const creatorCourse=courseData.filter((course)=>course.creator===creatorData?._id && course._id!==courseId)
      setcreatorCourses(creatorCourse)
     }
     
  },[creatorData,courseData])


  useEffect(() => {
    if (courseData && courseData.length > 0) {
      const course = courseData.find((c) => c._id === courseId);
      if (course) {
        dispatch(setSelectedCourse(course));
      }
    }
    checkEnrollment()
  }, [courseData, courseId, dispatch,userData]);

  if (!selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleEnroll=async(userId,courseId)=>{
    try{
      const orderData=await axios.post(serverUrl+"/api/order/razorpay-order",{userId,courseId},{withCredentials:true})
      console.log(orderData)

      const options={
        key:import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:orderData.data.amount,
        currency:'INR',
        name:"VIRTUAL COURSES",
        description:"COURSE ENROLLMENT PAYMENT",
        order_id:orderData.data.id,
        handler:async function(response){
          console.log("Razorpay Response",response)
          try{
            const verifypayment=await axios.post(serverUrl+"/api/order/verifypayment",{
              ...response,
              courseId,
              userId
            },{withCredentials:true})
            setIsEnrolled(true)
            toast.success(verifypayment.data.message)
          } catch(error){
                toast.error(error.response.data.message)
          }
        }
        
      }
      const rzp=new window.Razorpay(options)
      rzp.open()
    } catch(error){
          console.log(error)
          toast.error("Something went wrong while enrolling.")
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          <div className="w-full md:w-1/3">
            <FaArrowLeftLong
              className="text-black w-[22px] h-[22px] cursor-pointer mb-3"
              onClick={() => navigate("/")}
            />
            <img
              src={selectedCourse.thumbnail || img}
              alt="course"
              className="rounded-xl w-full object-cover"
            />
          </div>

          {/* Course Info */}
          <div className="flex-1 space-y-2 mt-5">
            <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
            <p className="text-gray-600">{selectedCourse.subTitle}</p>

            <div className="flex flex-col gap-2">
              <div className="text-yellow-500 font-medium flex gap-2">
                <span className="flex items-center gap-1">
                  <FaStar /> 5
                </span>
                <span className="text-gray-400">(1,200 Reviews)</span>
              </div>

              <div>
                <span className="text-lg font-semibold text-black">
                  ₹{selectedCourse.price}
                </span>{" "}
                <span className="line-through text-sm text-gray-400">
                  ₹599
                </span>
              </div>

              <ul className="text-sm text-gray-700 space-y-1 pt-2">
                <li>✅ 10+ hours of video content</li>
                <li>✅ Lifetime access to course materials</li>
              </ul>

              {!isEnrolled?<button className="bg-black text-white px-6 py-2  rounded hover:bg-gray-700 mt-3" onClick={handleEnroll(userData._Id,courseId)}> Enroll Now </button>:<button className="bg-grren-100 text-green-500 px-6 py-2  rounded hover:bg-gray-700 mt-3" >Watch Now </button>}
            </div>
          </div>
        </div>

        {/* WHAT YOU'LL LEARN */}
        <div>
          <h2 className="text-xl font-semibold mb-2">What you'll learn</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Learn {selectedCourse.category} from beginning</li>
          </ul>
        </div>

        {/* WHO THIS COURSE IS FOR */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Who this course is for
          </h2>
          <p className="text-gray-700">
            Beginners, aspiring developers, and professionals looking to upgrade skills.
          </p>
        </div>

        {/* COURSE CURRICULUM */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-1 text-gray-800">
              Course Curriculum
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedCourse.lectures?.length || 0} Lectures
            </p>

            <div className="flex flex-col gap-3">
              {selectedCourse.lectures?.map((lecture, index) => (
                <button
                  key={index}
                  disabled={!lecture.isPreviewFree}
                  onClick={() =>
                    lecture.isPreviewFree && setSelectedLecture(lecture)
                  }
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left
                    ${
                      lecture.isPreviewFree
                        ? "hover:bg-gray-100 cursor-pointer border-gray-300"
                        : "cursor-not-allowed opacity-60 border-gray-200"
                    }
                    ${
                      selectedLecture?.lectureTitle === lecture.lectureTitle
                        ? "bg-gray-400 border-gray-400"
                        : ""
                    }`}>
                      <span className="text-lg text-gray-700">
                        {lecture.isPreviewFree? <FaPlayCircle/>:<FaLock/>}
                      </span>
                      <span className="text-sm font-medium text-gray-800 ">{lecture?.lectureTitle}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
                {selectedLecture?.videoUrl ? <video className="w-full h-full object-cover" src={selectedLecture?.videoUrl} controls/> : 
                <span className="text-white text-sm">
                  Select a preview lecture to watch
                </span>
                }
              </div>
           </div>
        </div>
          <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold mb-2">
                write a Reviews
              </h2>
              <div className="mb-4">
                  <div className="flex  gap-1 mb-2">
                    {
                      [1,2,3,4,5].map((star)=>(
                        <FaStar  key={star} className="fill-gray-300"/>
                      ))
                    }
                  </div>
                  <textarea  className="w-full border border-gray-300 rounded-lg p-2"
                  
                   placeholder="Write your review here..."
                   rows={3}
                  />
                    <button className="bg-black text-white mt-3 px-4 py-3 rounded hover:bg-gray-800">
                      submit Review
                    </button>
                  
              </div>
          </div>

      {/*for creator information ----------------------------------------*/}
          <div className="flex items-center gap-4 pt-4 border-t">
             {creatorData?.photoUrl?  <img src={creatorData?.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border-1 border-gray-200"/>:<img src={img} alt="" className="w-16 h-16 rounded-full object-cover border-1 border-gray-200"/>}
              <div>
                <h2 className="text-lg font-semibold ">{creatorData?.name}</h2>
                <p className="md:text-sm text-gray-600 text-[10px]">{creatorData?.description}</p>
                <p className="md:text-sm text-gray-600 text-[10px]">{creatorData?.email}</p>
             </div>
          </div>

          <div>
            <p className="text-xl font-semibold mb-2">Other Published courses by the Educator</p>
          </div>
          <div  className="w-full transition-all duration-300 py-[20px] flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px]">
             {
               creatorCourses?.map((course,index)=>(
                <Card key={index} thumbnail={course.thumbnail} id={course._id} price={course.price} title={course.title} category={course.category}/>
               ))
             }
          </div>
      </div>
    </div>
  );
}

export default ViewCourse;
