const Course = require("../models/Course");
const Category = require("../models/category");
const User = require("../models/User");
// const SubSection = require("../models/Subsection")
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const courseProgress = require("../models/courseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const { deleteImage, deleteImages } = require("../utils/deleteImageAndVideos");
const Subsection = require("../models/SubSection");
const Section = require("../models/Section");
const RatingAndReview = require("../models/RatingAndReview");
const category = require("../models/category");

const fileUpload = require("express-fileupload");

// createCourse handler function
exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const { courseName, courseDescription, whatYouWillLearn,
            price, tag, category, instructions, status } = req.body;
        console.log("instructions", instructions)


        // get thumbnail (field name must match frontend FormData key: 'thumbnailImage')
        const thumbnail = req.files && req.files.thumbnailImage;
        if (!thumbnail) {
            return res.status(400).json({
                success: false,
                message: "Course thumbnail image is required"
            });
        }

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !category || !price) {
            return res.status(400).json({  // 400 Bad Request
                success: false,
                messge: "All fields are required"
            });
        }

        if (!status || status == undefined) {
            status: "Draft";
        }

        //check for instructor
        // You’re using a JWT-based Auth System where, after login, you store the user's ID in req.user (probably using a middleware like auth that decodes the token and attaches user info to req.user).
        //This makes sure that:
        //Only a logged-in user can create a course.
        //You know who exactly is creating the course.

        const userId = req.user.id; //payload main store hain Auth controller login
        const instructorDetails = await User.findById(userId);
        //console.log("Instructor Details: ", instructorDetails);
        // TODO : Verify that userId and instructorDetails._id are same or diffrent ????????????

        if (!instructorDetails) {
            return res.status(404).json({  // 404 Not Found.
                success: false,
                message: "Instructor Details not found"
            })
        }

        // cheque given category is valid or not 
        //You're ensuring the tag provided exists in your Category collection.
        //  This helps avoid saving invalid category references.
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details not found"
            })
        }

        // Upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME); // env

        // create an entry in db for new course
        const newCourse = await Course.create({
            courseName: courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            tag: tag,
            instructions: instructions,
            status: status,
        });

        //Instructor(User) ko update karna hai
        // add the new course to the user schema of Instructor
        //Updates the instructor’s user document to 
        // add the new course to their list of created courses.
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true },
        );

        //update the Category Schema
        //Finds the Category by its ID.
        //Pushes the new course's _id into the courses array inside the Tag document.
        //{new: true } makes sure the updated tag is returned (if needed).


        const categorydetail = await Category.findByIdAndUpdate(
            {
                _id: categoryDetails._id,
            },
            {
                $push: {
                    course: newCourse._id,
                },
            },
            { new: true }
        );
        console.log(categorydetail);

        // hw

        // return response
        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


//updateCourse
exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const updates = req.body;

        console.log("updates", updates);
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        console.log("req.files", req.files);

        if (req.files) {
            const thumbnail = req.files.thumbnail;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            );

            console.log("thumb", thumbnailImage);
            course.thumbnail = thumbnailImage.secure_url;
        }

        for (key in updates) {
            if (Object.prototype.hasOwnProperty.call(updates, key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key]);
                }
                else {
                    course[key] = updates[key];
                }
            }
        }

        await course.save();

        const newCourse = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "course updated successfully",
            data: newCourse,
        });
    }
    catch (error) {
        console.log("error in update course controller", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//deleteCourse
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        console.log("Deleting course with ID:", courseId);
        console.log("User ID:", userId);

        // First, find the course and verify it belongs to the instructor
        const courseDetails = await Course.findById(courseId);
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if (courseDetails.instructor.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this course",
            });
        }

        // Populate course content to get all sections and subsections
        const populatedCourse = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        });

        console.log("Course found, starting deletion process...");

        // Collect all video URLs for deletion from cloudinary
        let videoUrlArray = [];
        if (populatedCourse.courseContent && populatedCourse.courseContent.length > 0) {
            videoUrlArray = populatedCourse.courseContent.flatMap((section) => 
                section.subSection ? section.subSection.map((subsec) => subsec.videoUrl).filter(url => url) : []
            );
        }

        console.log("Video URLs to delete:", videoUrlArray);

        // Delete videos from cloudinary (if any)
        if (videoUrlArray.length > 0) {
            try {
                await deleteImage(videoUrlArray);
                console.log("Videos deleted from cloudinary");
            } catch (error) {
                console.log("Error deleting videos from cloudinary:", error);
                // Continue with deletion even if cloudinary deletion fails
            }
        }

        // Delete course thumbnail from cloudinary
        if (populatedCourse.thumbnail) {
            try {
                await deleteImages([populatedCourse.thumbnail]);
                console.log("Thumbnail deleted from cloudinary");
            } catch (error) {
                console.log("Error deleting thumbnail from cloudinary:", error);
                // Continue with deletion even if cloudinary deletion fails
            }
        }

        // Delete all subsections
        const allSections = populatedCourse.courseContent || [];
        for (let section of allSections) {
            if (section.subSection && section.subSection.length > 0) {
                const subsectionIds = section.subSection.map(subsec => subsec._id);
                await Subsection.deleteMany({ _id: { $in: subsectionIds } });
                console.log(`Deleted ${subsectionIds.length} subsections from section ${section._id}`);
            }
        }

        // Delete all sections
        if (allSections.length > 0) {
            const sectionIds = allSections.map(section => section._id);
            await Section.deleteMany({ _id: { $in: sectionIds } });
            console.log(`Deleted ${sectionIds.length} sections`);
        }

        // Delete all ratings and reviews of the course
        await RatingAndReview.deleteMany({ course: courseId });
        console.log("Deleted all ratings and reviews");

        // Remove course from instructor's courses array
        await User.findByIdAndUpdate(
            userId,
            { $pull: { courses: courseId } },
            { new: true }
        );
        console.log("Removed course from instructor's courses");

        // Remove course from category
        if (populatedCourse.category) {
            await Category.findByIdAndUpdate(
                populatedCourse.category,
                { $pull: { course: courseId } },
                { new: true }
            );
            console.log("Removed course from category");
        }

        // Delete course progress records
        await courseProgress.deleteMany({ courseId: courseId });
        console.log("Deleted course progress records");

        // Finally, delete the course itself
        await Course.findByIdAndDelete(courseId);
        console.log("Course deleted successfully");

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });

    } catch (error) {
        console.log("Error in deleteCourse:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete course",
            error: error.message,
        });
    }
}

// getAllCourses handler function

exports.showAllCourses = async (req, res) => {
    try {
        // TODO: change te below statement incrementally
        const allCourses = await Course.find(
            {},
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentEnrolled: true,
            }
        )
            .populate("instructor")
            .exec();

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfuly",
            data: allCourses,
        })

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Cannot fetch course data",
            error: error.message
        })
    }
}

//getCourseDetails

exports.getCourseDetails = async (req, res) => {
    try {
        //get courseId
        const { courseId } = req.body;
        const userId = req.user.id;
        //find course details
        const courseDetails = await Course.findById(
            { _id: courseId })
            .populate(
                {
                    path: "instructor",
                    populate: {
                        path: "additionalDetails",
                    }
                }
            )
            .populate("category")
           // .populate("ratingAndreview")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        let courseProgressCount = await courseProgress.findOne({
            courseId: courseId,
            userId: userId,
        });

        console.log("courseProgressCount: ", courseProgressCount);

        //validation
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`,
            })
        }
        console.log(courseDetails);

        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationInSeconds;
            });
        });

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos
                    ? courseProgressCount?.completedVideos
                    : ["none"],
            },
        }); 
       


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.fetchInstructorCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    let allCourses = await Course.find({ instructor: userId })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

      // allCourses = allCourses.toObject();
      allCourses = allCourses.map(course => course.toObject());

      // console.log("all courses",allCourses);
      for(var i = 0; i < allCourses.length; i++){
        let totalDurationInSeconds = 0;
        // let SubsectionLength = 0;
        for(var j = 0; j < allCourses[i].courseContent.length; j++){
          totalDurationInSeconds += allCourses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);

          allCourses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
          // console.log(allCourses[i].totalDuration);

        }
      }
      console.log("all courses",allCourses);
    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Courses",
      error: error.message,
    });
  }
};

exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      // const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
      select:"about"
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
      select:"title"
          },
        })
        .exec()

        
      // let courseProgressCount = await courseProgress.findOne({
        // courseID: courseId,
        // userID: userId,
      // })
  
      // console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds;
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

