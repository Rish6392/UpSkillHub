import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { RxCross2 } from "react-icons/rx";
import Upload from "../Upload";
import IconBtn from "../../../../common/IconBtn";
import useOnClickOutside from "../../../../../hooks/useOnClickOutside";

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const ref = useRef(null);
  useEffect(() => {
    console.log("inside subsection modal");
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("description", modalData.description);
      setValue("lectureVideo", modalData.video || modalData.videoUrl);
    }
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.description !== modalData.description ||
      currentValues.lectureVideo !== (modalData.video || modalData.videoUrl)
    ) {
      return true;
    } else {
      return false;
    }
  };

  //Edit subsection 
  const handleEditSubSection = async () => {
    const currentValues = getValues();
    const formData = new FormData();

    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id); // Changed from "subsectionId" to "subSectionId"

    // Backend requires ALL fields, so send current or updated values
    formData.append("title", currentValues.lectureTitle || modalData.title);
    formData.append("description", currentValues.description || modalData.description);
    formData.append("timeDuartion", "00:05:00"); // Backend expects this field (note the typo)

    // Video update is commented out in backend, so skip for now
    // if (currentValues.lectureVideo !== modalData.videoUrl) {
    //   formData.append("videoFile", currentValues.lectureVideo);
    // }

    setLoading(true);
    const result = await updateSubSection(formData, token);

    if (result) {
      // Update the specific subsection within the correct section
      const updatedCourseContent = course.courseContent.map((section) => {
        if (section._id === modalData.sectionId) {
          const updatedSubSections = section.subSection.map((subSection) =>
            subSection._id === modalData._id ? result : subSection
          );
          return { ...section, subSection: updatedSubSections };
        }
        return section;
      });
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }

    setModalData(null);
    setLoading(false);

  };

  const onSubmit = async (data) => {
    console.log("Form submission data:", data);
    
    if (view) {
      return;
    }

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No Changes made to the form ");
      } else {
        handleEditSubSection();
      }
      return;
    }

    if (add) {
      // Validate required fields
      if (!data.lectureTitle || !data.description) {
        toast.error("Please fill all required fields");
        return;
      }

      // Validate video upload
      if (!data.lectureVideo) {
        toast.error("Please upload a lecture video");
        return;
      }

      if (!(data.lectureVideo instanceof File)) {
        toast.error("Invalid video file. Please upload a valid video.");
        return;
      }

      // Check video file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
      if (!allowedTypes.includes(data.lectureVideo.type)) {
        toast.error("Please upload a valid video file (MP4, AVI, MOV, WMV)");
        return;
      }

      // Check file size (100MB limit)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (data.lectureVideo.size > maxSize) {
        toast.error("Video file size should be less than 100MB");
        return;
      }

      const formData = new FormData();
      formData.append("sectionId", modalData);
      formData.append("title", data.lectureTitle);
      formData.append("description", data.description);
      formData.append("timeDuration", "00:05:00");
      formData.append("videoFile", data.lectureVideo);
      
      console.log("=== FRONTEND DEBUG ===");
      console.log("Modal data (sectionId):", modalData);
      console.log("Form data object:", data);
      console.log("Video file details:", {
        name: data.lectureVideo.name,
        size: data.lectureVideo.size,
        type: data.lectureVideo.type,
        lastModified: data.lectureVideo.lastModified
      });
      
      // Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      setLoading(true);

      const result = await createSubSection(formData, token);
      if (result) {
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData ? result : section
        );
        const updatedCourse = {
          ...course,
          courseContent: updatedCourseContent,
        };
        dispatch(setCourse(updatedCourse));
        toast.success("Lecture added successfully!");
      } else {
        toast.error("Failed to add lecture. Please try again.");
      }

      setModalData(null);
      setLoading(false);
    }
  };



  useOnClickOutside(ref,() => setModalData(null));
  return (
    <div onClick={(e) => {e.stopPropagation()}} >
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[90vw] z-50 bg-richblack-600 p-4 rounded-lg max-h-[80vh] scrollbar-hide"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      
      ref={ref}>
        <div className="h-full overflow-y-auto">
        <div className="bg-richblack-800 w-full py-3 px-4 rounded-lg flex justify-between mb-4">
          <p className="text-lg font-medium">
            {view && "Viewing"}
            {add && "Adding"}
            {edit && "Editing"} Lecture
          </p>
          <button onClick={() => {
            !loading && setModalData(null)
          }}
          className="bg-richblack-700 hover:bg-richblack-600 rounded-full aspect-square w-8 flex items-center justify-center transition-colors"
          >
            <RxCross2 />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Upload
            title={"Course Video"}
            label={"lectureVideo"}
            name={"lectureVideo"}
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          <div>
            <label htmlFor="lectureTitle" className="text-sm text-richblack-5 mb-1 block">Lecture Title<sup className="text-pink-200">*</sup></label>
            <input
              type="text"
              id="lectureTitle"
              placeholder="Enter lecture Title"
              {...register("lectureTitle", { required: true })}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-3 text-richblack-5 text-sm"
            />
            {errors.lectureTitle && <span className="text-xs text-red-400">Lecture Title is required</span>}
          </div>
          <div>
            <label htmlFor="description" className="text-sm text-richblack-5 mb-1 block">Lecture Description<sup className="text-pink-200">*</sup></label>
            <textarea
              id="description"
              placeholder="Enter Description"
              {...register("description", { required: true })}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-3 text-richblack-5 text-sm h-[100px] resize-none"
            ></textarea>
            {errors.description && (
              <span className="text-xs text-red-400">Lecture description is required</span>
            )}
          </div>
          <div className="flex items-center justify-end pt-2">
          {!view && (
            <IconBtn
              disabled={loading}
              text={loading ? "Loading..." : edit ? "save changes" : "save"}
              customClasses="w-fit bg-yellow-50 border-2 border-yellow-200 text-black font-semibold rounded-lg py-2 px-4 flex items-center justify-center hover:bg-yellow-100 transition duration-300 hover:scale-95 text-sm"

            />
          )}

          </div>
        </form>
      </div>
        </div>
        

      <div className='absolute inset-0 z-10 !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-[3px] over'></div>
    </div>
  );
};

export default SubSectionModal;