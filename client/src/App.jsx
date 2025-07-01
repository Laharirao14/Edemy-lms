import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppContext } from "./context/AppContext.jsx";

// Auth
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";

// Student
import Home          from "./pages/student/Home.jsx";
import CoursesList   from "./pages/student/CoursesList.jsx";
import CourseDetails from "./pages/student/CourseDetails.jsx";
import MyEnrollments from "./pages/student/MyEnrollments.jsx";
import Player        from "./pages/student/Player.jsx";
import Loading       from "./components/student/Loading.jsx";

// Educator
import Educator        from "./pages/educator/Educator.jsx";
import Dashboard       from "./pages/educator/Dashboard.jsx";
import AddCourse       from "./pages/educator/AddCourse.jsx";
import MyCourses       from "./pages/educator/MyCourses.jsx";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled.jsx";

import Navbar from "./components/student/Navbar.jsx";

export default function App() {
  const { user } = useContext(AppContext);

  // if not logged in → only auth routes
  if (!user) {
    return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login"  element={<Login />} />
        <Route path="*"       element={<Navigate to="/signup" replace />} />
      </Routes>
    );
  }

  // logged in → full Edemy UI
  return (
    <>
      <Navbar />
      <Routes>
        {/* Student */}
        <Route path="/"                    element={<Home />} />
        <Route path="/course-list"        element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id"         element={<CourseDetails />} />
        <Route path="/my-enrollments"     element={<MyEnrollments />} />
        <Route path="/player/:courseId"   element={<Player />} />
        <Route path="/loading/:path"      element={<Loading />} />

        {/* Educator */}
        <Route path="/educator" element={<Educator />}>
          <Route index                   element={<Dashboard />} />
          <Route path="add-course"       element={<AddCourse />} />
          <Route path="my-courses"       element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
