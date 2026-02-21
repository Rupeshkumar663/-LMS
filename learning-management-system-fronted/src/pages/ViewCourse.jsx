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
  const { userData } = useSelector((state) => state.user);
  const { courseData, selectedCourse } = useSelector(
    (state) => state.course
  );

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourses, setcreatorCourses] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating,setRating]=useState(0)
  const [comment,setComment]=useState("")
  

  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            serverUrl + "/api/course/creator",
            { userId: selectedCourse.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    handleCreator();
  }, [selectedCourse]);

  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some(
      (c) =>
        (typeof c === "string" ? c : c._id).toString() ===
        courseId?.toString()
    );
    if (verify) {
      setIsEnrolled(true);
    }
  };

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const creatorCourse = courseData.filter(
        (course) =>
          course.creator?.toString() === creatorData._id.toString() &&
          course._id !== courseId
      );
      setcreatorCourses(creatorCourse);
    }
  }, [creatorData, courseData, courseId]);

  useEffect(() => {
    if (courseData && courseData.length > 0) {
      const course = courseData.find((c) => c._id === courseId);
      if (course) {
        dispatch(setSelectedCourse(course));
      }
    }
  }, [courseData, courseId, dispatch]);

  useEffect(() => {
    if (userData && courseId) {
      checkEnrollment();
    }
  }, [userData, courseId]);

  if (!selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleEnroll = async (userId, courseId) => {
    try {
      const orderData = await axios.post(
        serverUrl + "/api/order/razorpay-order",
        { userId, courseId },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "VIRTUAL COURSES",
        description: "COURSE ENROLLMENT PAYMENT",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifypayment = await axios.post(
              serverUrl + "/api/order/verifypayment",
              {
                ...response,
                courseId,
                userId,
              },
              { withCredentials: true }
            );
            setIsEnrolled(true);
            toast.success(verifypayment.data.message);
          } catch (error) {
            toast.error(error.response?.data?.message);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while enrolling.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">
        <div className="flex flex-col md:flex-row gap-6">
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

          <div className="flex-1 space-y-2 mt-5">
            <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
            <p className="text-gray-600">{selectedCourse.subTitle}</p>

            {!isEnrolled ? (
              <button
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-700 mt-3"
                onClick={() => handleEnroll(userData?._id, courseId)}
              >
                Enroll Now
              </button>
            ) : (
              <button className="bg-green-100 text-green-500 px-6 py-2 rounded mt-3" onClick={()=>navigate(`/viewlecture/${courseId}`)}> Watch Now </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border">
            {selectedCourse.lectures?.map((lecture, index) => (
              <button
                key={index}
                disabled={!lecture.isPreviewFree}
                onClick={() =>
                  lecture.isPreviewFree && setSelectedLecture(lecture)
                }
                className="flex items-center gap-3 px-4 py-3 rounded-lg border"
              >
                {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                {lecture.lectureTitle}
              </button>
            ))}
          </div>

          <div className="bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border">
            {selectedLecture?.videoUrl ? (
              <video
                className="w-full h-full"
                src={selectedLecture.videoUrl}
                controls
              />
            ) : (
              <span>Select a preview lecture to watch</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <img
            src={creatorData?.photoUrl || img}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">{creatorData?.name}</h2>
            <p className="text-sm">{creatorData?.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {creatorCourses?.map((course, index) => (
            <Card
              key={index}
              thumbnail={course.thumbnail}
              id={course._id}
              price={course.price}
              title={course.title}
              category={course.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewCourse;
