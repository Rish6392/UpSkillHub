import React, { useEffect } from 'react'

const ViewCourse = () => {

    const [reviewModal,setReviewModal] = useState(false);
    const {courseId} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();

    useEffect(()=>{
        const setCourseSpecificDetails = async()=>{
            const courseData = await getFullDetailsCourse(courseId,token);  //course ki api ko call
            dispatch(setCourseDetails(courseData.courseDetails.courseContent));
            dispatch(setEntireCourseData(courseData.courseDetails));
            dispatch(setComplatedlectures(courseData.completedVideos));
            let lectures = 0;
            courseData?.courseDetails?.courseContent?.forEach((sec)=>{
                lectures+=sec.subSection.length();
            })
            dispatch(setTotalNoOfLectures(lectures));

        }
    })

  return (
     <>

     <div>
        <VideoDetailsSidebar setReviewModal={setReviewModal} />

        <div>
            <Outlet />
        </div>
     </div>

     {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
     
     </>
  )
}

export default ViewCourse
