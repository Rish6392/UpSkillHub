# UpSkillHub



## 📝 Description

UpSkillHub is a dynamic Ed-Tech platform designed to revolutionize the way individuals acquire and enhance their skills. This web-based application offers a comprehensive learning experience, connecting users with a vast array of educational resources and opportunities. Whether you're looking to advance your career, explore new interests, or simply expand your knowledge, UpSkillHub provides the tools and support you need to achieve your goals. Explore interactive courses, connect with expert instructors, and track your progress, all within a user-friendly and engaging environment. UpSkillHub empowers you to take control of your learning journey and unlock your full potential.

## ✨ Features

- 🕸️ Web


## 🚀 Run Commands

- **dev**: `npm run dev`
- **build**: `npm run build`
- **lint**: `npm run lint`
- **preview**: `npm run preview`


## 📁 Project Structure

```
.
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── Assets
│   │   │   ├── Images
│   │   │   │   ├── Compare_with_others.png
│   │   │   │   ├── Compare_with_others.svg
│   │   │   │   ├── FoundingStory.png
│   │   │   │   ├── Instructor.png
│   │   │   │   ├── Know_your_progress.png
│   │   │   │   ├── Know_your_progress.svg
│   │   │   │   ├── Plan_your_lessons.png
│   │   │   │   ├── Plan_your_lessons.svg
│   │   │   │   ├── TimelineImage.png
│   │   │   │   ├── aboutus1.webp
│   │   │   │   ├── aboutus2.webp
│   │   │   │   ├── aboutus3.webp
│   │   │   │   ├── banner.mp4
│   │   │   │   ├── bghome.svg
│   │   │   │   ├── boxoffice.png
│   │   │   │   ├── frame.png
│   │   │   │   ├── login.webp
│   │   │   │   ├── rzp.png
│   │   │   │   └── signup.webp
│   │   │   ├── Logo
│   │   │   │   ├── LearnHub-Logo.jpeg
│   │   │   │   ├── Logo-Full-Dark.png
│   │   │   │   ├── Logo-Full-Light.png
│   │   │   │   ├── Logo-Small-Dark.png
│   │   │   │   ├── Logo-Small-Light.png
│   │   │   │   └── upskillhub-logo.svg
│   │   │   └── TimeLineLogo
│   │   │       ├── Logo1.svg
│   │   │       ├── Logo2.svg
│   │   │       ├── Logo3.svg
│   │   │       └── Logo4.svg
│   │   ├── components
│   │   │   ├── ContactPage
│   │   │   │   ├── ContactDetails.jsx
│   │   │   │   ├── ContactForm.jsx
│   │   │   │   └── ContactUsForm.jsx
│   │   │   ├── common
│   │   │   │   ├── ConfirmationModal.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── IconBtn.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── RatingStars.jsx
│   │   │   │   ├── ReviewSlider.jsx
│   │   │   │   ├── Tab.jsx
│   │   │   │   └── VideoPlayer.jsx
│   │   │   └── core
│   │   │       ├── AboutPage
│   │   │       │   ├── ContactFormSection.jsx
│   │   │       │   ├── LearningGrid.jsx
│   │   │       │   ├── Quote.jsx
│   │   │       │   ├── Stats.jsx
│   │   │       │   └── useIntersectionObserver.jsx
│   │   │       ├── Auth
│   │   │       │   ├── LoginForm.jsx
│   │   │       │   ├── OpenRoute.jsx
│   │   │       │   ├── PrivateRoute.jsx
│   │   │       │   ├── ProfileDropDown.jsx
│   │   │       │   ├── SignupForm.jsx
│   │   │       │   └── Template.jsx
│   │   │       ├── Catalog
│   │   │       │   ├── CourseSlider.jsx
│   │   │       │   └── Course_Card.jsx
│   │   │       ├── Course
│   │   │       │   ├── CourseAccordionBar.jsx
│   │   │       │   ├── CourseDetailsCard.jsx
│   │   │       │   └── CourseSubSectionAccordion.jsx
│   │   │       ├── Dashboard
│   │   │       │   ├── AddCourse
│   │   │       │   │   ├── CourseBuilder
│   │   │       │   │   │   ├── CourseBuilderForm.jsx
│   │   │       │   │   │   ├── NestedView.jsx
│   │   │       │   │   │   └── SubSectionModal.jsx
│   │   │       │   │   ├── CourseInformation
│   │   │       │   │   │   ├── ChipInput.jsx
│   │   │       │   │   │   ├── CourseInformationForm.jsx
│   │   │       │   │   │   └── RequirementsField.jsx
│   │   │       │   │   ├── PublishCourse
│   │   │       │   │   │   └── index.jsx
│   │   │       │   │   ├── RenderSteps.jsx
│   │   │       │   │   ├── TestUpload.jsx
│   │   │       │   │   ├── Upload.jsx
│   │   │       │   │   └── index.jsx
│   │   │       │   ├── Cart
│   │   │       │   │   ├── RenderCartCourses.jsx
│   │   │       │   │   ├── RenderTotalAmount.jsx
│   │   │       │   │   └── index.jsx
│   │   │       │   ├── EditCourse
│   │   │       │   │   ├── index.js
│   │   │       │   │   └── index.jsx
│   │   │       │   ├── EnrolledCourses.jsx
│   │   │       │   ├── InstructorCourses
│   │   │       │   │   └── CoursesTable.jsx
│   │   │       │   ├── InstructorDashboard
│   │   │       │   │   ├── Instructor.jsx
│   │   │       │   │   └── InstructorChart.jsx
│   │   │       │   ├── MyCourses.jsx
│   │   │       │   ├── MyProfile.jsx
│   │   │       │   ├── Settings
│   │   │       │   │   ├── ChangeProfilePicture.jsx
│   │   │       │   │   ├── DeleteAccount.jsx
│   │   │       │   │   ├── EditProfile.jsx
│   │   │       │   │   ├── UpdatePassword.jsx
│   │   │       │   │   └── index.jsx
│   │   │       │   ├── Sidebar.jsx
│   │   │       │   └── SidebarLink.jsx
│   │   │       ├── HomePage
│   │   │       │   ├── CTAButton.jsx
│   │   │       │   ├── CodeBlocks.jsx
│   │   │       │   ├── CourseCard.jsx
│   │   │       │   ├── ExploreMore.jsx
│   │   │       │   ├── HighlightText.jsx
│   │   │       │   ├── InstructorSection.jsx
│   │   │       │   ├── LearningLanguageSection.jsx
│   │   │       │   └── TimelineSection.jsx
│   │   │       └── ViewCourse
│   │   │           ├── CourseReviewModal.jsx
│   │   │           ├── VideoDetails.jsx
│   │   │           └── VideoDetailsSidebar.jsx
│   │   ├── data
│   │   │   ├── countrycode.json
│   │   │   ├── dashboard-links.js
│   │   │   ├── footer-links.js
│   │   │   ├── homepage-explore.js
│   │   │   └── navbar-links.js
│   │   ├── hooks
│   │   │   └── useOnClickOutside.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── About.jsx
│   │   │   ├── Catalog.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── CourseDetails.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Error.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── UpdatePassword.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   └── ViewCourse.jsx
│   │   ├── reducer
│   │   │   └── index.js
│   │   ├── services
│   │   │   ├── apiconnector.js
│   │   │   ├── apis.js
│   │   │   ├── formatDate.js
│   │   │   └── operations
│   │   │       ├── SettingsApi.js
│   │   │       ├── authAPI.js
│   │   │       ├── courseDetailsAPI.js
│   │   │       ├── pageAndComponentData.js
│   │   │       ├── profileAPI.js
│   │   │       └── studentFeaturesAPI.js
│   │   ├── slices
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   ├── courseSlice.js
│   │   │   ├── profileSlice.js
│   │   │   └── viewCourseSlice.js
│   │   └── utils
│   │       ├── avgRating.js
│   │       ├── constants.js
│   │       └── dateFormatter.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json
└── server
    ├── config
    │   ├── cloudinary.js
    │   ├── database.js
    │   └── razorpay.js
    ├── controllers
    │   ├── Auth.js
    │   ├── Category.js
    │   ├── ContactUs.js
    │   ├── Course.js
    │   ├── CourseProgress.js
    │   ├── Payments.js
    │   ├── Profile.js
    │   ├── RatingAndReview.js
    │   ├── ResetPassword.js
    │   ├── Section.js
    │   └── SubSection.js
    ├── env.sample
    ├── index.js
    ├── mail
    │   ├── contactFormRes.js
    │   ├── courseEnrollmentEmail.js
    │   ├── emailVerificationTemplate.js
    │   ├── passwordUpdate.js
    │   └── paymentSuccessEmail.js
    ├── middlewares
    │   └── auth.js
    ├── models
    │   ├── Course.js
    │   ├── OTP.js
    │   ├── Profile.js
    │   ├── RatingAndReview.js
    │   ├── Section.js
    │   ├── SubSection.js
    │   ├── User.js
    │   ├── category.js
    │   └── courseProgress.js
    ├── package.json
    ├── routes
    │   ├── ContactUs.js
    │   ├── Course.js
    │   ├── Payments.js
    │   ├── Profile.js
    │   └── User.js
    └── utils
        ├── deleteImageAndVideos.js
        ├── imageUploader.js
        ├── mailSender.js
        └── secToDuration.js
```

## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/Rish6392/UpSkillHub.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request

Please ensure your code follows the project's style guidelines and includes tests where applicable.

---

