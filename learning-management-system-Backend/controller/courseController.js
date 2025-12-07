
import uploadOnCloudinary from "../config/cloudinary.js";
import Course from "../model/courseModel.js";

export const createCourse = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and Category are required" });
    }

    const course = await Course.create({
      title,
      category,
      creator: req.userId
    });

    return res.status(201).json(course);

  } catch (error) {
    return res.status(500).json({ message: `CreateCourse error: ${error.message}` });
  }
};



export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true });

    return res.status(200).json(courses);

  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch published courses: ${error.message}` });
  }
};



export const getCreaterCourses = async (req, res) => {
  try {
    const userId = req.userId;

    const courses = await Course.find({ creator: userId });

    return res.status(200).json(courses);

  } catch (error) {
    return res.status(500).json({ message: `Failed to fetch creator courses: ${error.message}` });
  }
};



export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, subTitle, description, category, level, isPublished, price } = req.body;

    let thumbnail;
    if (req.file) {
      thumbnail = await uploadOnCloudinary(req.file.path);
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }

    const updateData = {
      title,
      subTitle,
      description,
      category,
      level,
      isPublished,
      price,
      ...(thumbnail && { thumbnail })
    };

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );

    return res.status(200).json(updatedCourse);

  } catch (error) {
    return res.status(500).json({ message: `Failed to edit course: ${error.message}` });
  }
};



export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }

    return res.status(200).json(course);

  } catch (error) {
    return res.status(500).json({ message: `Failed to get course: ${error.message}` });
  }
};



export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({ message: "Course removed" });

  } catch (error) {
    return res.status(500).json({ message: `Failed to delete course: ${error.message}` });
  }
};
