import React, { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const navigate = useNavigate();

  // ─── AUTH ─────────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [isEducator, setIsEducator] = useState(false);

  // fresh start on reload
  useEffect(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    // if userData.role === "educator": setIsEducator(true)
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsEducator(false);
    navigate("/login");
  };

  // ─── COURSES ───────────────────────────────────────────────────────────────────
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    setAllCourses(dummyCourses);
    setEnrolledCourses(dummyCourses);
  }, []);

  // ─── HELPERS ───────────────────────────────────────────────────────────────────
  const calculateRating = (c) =>
    c.courseRatings.length
      ? c.courseRatings.reduce((sum, r) => sum + r.rating, 0) /
        c.courseRatings.length
      : 0;

  const calculateChapterTime = (ch) => {
    const mins = ch.chapterContent.reduce((sum, l) => sum + l.lectureDuration, 0);
    return humanizeDuration(mins * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (c) => {
    const mins = c.courseContent
      .flatMap((ch) => ch.chapterContent)
      .reduce((sum, l) => sum + l.lectureDuration, 0);
    return humanizeDuration(mins * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNoOfLectures = (c) =>
    c.courseContent.reduce((sum, ch) => sum + ch.chapterContent.length, 0);

  // ─── CONTEXT VALUE ─────────────────────────────────────────────────────────────
  return (
    <AppContext.Provider
      value={{
        // auth
        user,
        isEducator,
        login,
        logout,
        setIsEducator,

        // courses
        allCourses,
        enrolledCourses,

        // helpers
        calculateRating,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNoOfLectures,

        // navigation
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
