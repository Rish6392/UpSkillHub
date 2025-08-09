import React, { useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../../common/IconBtn";
// import MdAddCircleOutline from ""
import { MdAddCircleOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";
import NestedView from "./NestedView";

const CourseBuilderForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [editSectionName, setEditSectionName] = useState(null);
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  const goToNext = () => {
    if (!course?.courseContent || course.courseContent.length === 0) {
      toast.error("Please add atleast one section");
      return;
    }

    // Check each section for subsections
    const sectionsWithoutLectures = course.courseContent.filter(
      (section) => !section.subSection || section.subSection.length === 0
    );
    
    if (sectionsWithoutLectures.length > 0) {
      toast.error("Please add atleast one lecture in each section");
      return;
    }

    dispatch(setStep(3));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    } else {
      // console.log(course._id);
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }

    if (result) {
      // The API returns the updated course in result.updatedCourseDetails
      const updatedCourse = result.updatedCourseDetails || result;
      dispatch(setCourse(updatedCourse));
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    setLoading(false);
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }

    // if(editSectionName !== sectionId)
    setEditSectionName(sectionId);

    setValue("sectionName", sectionName);
  };
  return (
    <div className="w-full h-full  text-richblack-5">
      <p className="text-richblack-5 text-2xl mb-4 font-semibold">
        Course Builder
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="sectionName" className="text-md text-richblack-100">
            Section Name<sup className="text-pink-200">*</sup>
          </label>
          <input
            type="text"
            id="sectionName"
            placeholder="Add section Name"
            {...register("sectionName", {
              required: true,
            })}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
          {errors.sectionName && (
            <p className="text-red-500">{errors.sectionName.message}</p>
          )}
        </div>

        <div className="flex mt-10">
          <IconBtn
            type="submit"
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={false}
            customClasses="w-fit h-fit bg-yellow-50 border-2 border-yellow-200 text-richblack-900 font-semibold text-sm rounded-lg py-2 px-4 flex items-center justify-center hover:bg-yellow-100 transition duration-300 gap-2"
          >
            <MdAddCircleOutline className="text-richblack-900 text-sm" size={20} />
          </IconBtn>

          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline ml-5"
            >
              cancel
            </button>
          )}
        </div>
      </form>

      {course.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          text="Back"
          className="w-fit fit bg-richblack-900 border-2 border-richblack-700 text-richblack-5 rounded-lg py-2 px-4 flex items-center justify-center hover:bg-richblack-800 transition duration-300 gap-1 "
        >
          <FaAngleLeft className="text-sm" />
          <span className="text-sm">Back</span>
        </button>
        <button
          onClick={goToNext}
          className="w-fit h-fit bg-yellow-50 border-2 border-yellow-200 text-black rounded-lg py-2 px-4 flex items-center justify-center hover:bg-yellow-100 transition duration-300 gap-1 text-sm"
        >
          <span>Next</span>
          <FaAngleRight className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default CourseBuilderForm;