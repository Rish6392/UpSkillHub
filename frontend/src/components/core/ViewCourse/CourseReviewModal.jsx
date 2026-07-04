import React, { useState } from "react"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { FaStar } from "react-icons/fa"
import { IoClose } from "react-icons/io5"

import { createRating } from "../../../services/operations/courseDetailsAPI"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)
  
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  const handleClose = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setReviewModal(false)
  }

  const handleFormSubmit = async () => {
    if (rating === 0 || !reviewText.trim()) {
      toast.error("Please provide a rating and a review.")
      return
    }

    try {
      const reviewData = {
        courseId: courseEntireData._id,
        rating: rating,
        review: reviewText,
      }

      const result = await createRating(reviewData, token)
      
      if (result) {
        toast.success("Thank you for your review!")
        setReviewModal(false)
      }
    } catch (error) {
      console.error("Review submission error:", error)
      setReviewModal(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div 
        className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">Add Review</p>
          <button onClick={handleClose} className="text-richblack-5 hover:text-richblack-25 transition-colors">
            <IoClose className="text-2xl" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-x-4 mb-6">
            <img
              src={user?.image}
              alt={user?.firstName + " profile"}
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-300">Posting Publicly</p>
            </div>
          </div>
          
          {/* Star Rating */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1
                return (
                  <FaStar
                    key={index}
                    className="cursor-pointer transition-colors duration-200"
                    color={ratingValue <= (hoverRating || rating) ? "#FFD60A" : "#374151"}
                    size={30}
                    onMouseEnter={() => setHoverRating(ratingValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(ratingValue)}
                  />
                )
              })}
            </div>
          </div>
          
          {/* Review Text */}
          <div className="mb-6">
            <label className="text-sm text-richblack-5 mb-2 block" htmlFor="courseExperience">
              Add Your Experience <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="courseExperience"
              placeholder="Share details of your own experience for this course"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="form-style resize-none min-h-[130px] w-full bg-richblack-700 border border-richblack-600 rounded-md p-3 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50"
              rows={5}
            />
            {rating === 0 || !reviewText.trim() ? (
              <span className="ml-2 text-xs tracking-wide text-pink-200 mt-1 block">
                Please provide both rating and review
              </span>
            ) : null}
          </div>
          
          {/* Modal Footer */}
          <div className="flex justify-end gap-x-3">
            <button
              onClick={handleClose}
              className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-richblack-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleFormSubmit}
              className="flex cursor-pointer items-center gap-x-2 rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-yellow-25 transition-colors"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}