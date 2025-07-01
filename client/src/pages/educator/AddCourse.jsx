// src/pages/educator/AddCourse.jsx
import React, { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';         // ← switched from uniqid
import 'quill/dist/quill.snow.css';     // ← ensure editor CSS is loaded
import Quill from 'quill';
import { assets } from '../../assets/assets';

const AddCourse = () => {
  const quillRef   = useRef(null);
  const editorRef  = useRef(null);

  const [courseTitle,   setCourseTitle]   = useState('');
  const [coursePrice,   setCoursePrice]   = useState(0);
  const [discount,      setDiscount]      = useState(0);
  const [image,         setImage]         = useState(null);
  const [chapters,      setChapters]      = useState([]);
  const [showPopup,     setShowPopup]     = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle:    '',
    lectureDuration: '',
    lectureUrl:      '',
    isPreviewFree:   false,
  });

  // Initialize Quill once
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (!title) return;

      setChapters(prev => [
        ...prev,
        {
          chapterId:    nanoid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed:    false,
          chapterOrder: prev.length ? prev[prev.length - 1].chapterOrder + 1 : 1,
        }
      ]);
    }

    if (action === 'remove') {
      setChapters(prev => prev.filter(c => c.chapterId !== chapterId));
    }

    if (action === 'toggle') {
      setChapters(prev =>
        prev.map(c =>
          c.chapterId === chapterId
            ? { ...c, collapsed: !c.collapsed }
            : c
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    }

    if (action === 'remove') {
      setChapters(prev =>
        prev.map(c => {
          if (c.chapterId === chapterId) {
            c.chapterContent.splice(lectureIndex, 1);
          }
          return c;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters(prev =>
      prev.map(c => {
        if (c.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: c.chapterContent.length
              ? c.chapterContent[c.chapterContent.length - 1].lectureOrder + 1
              : 1,
            lectureId: nanoid(),
          };
          c.chapterContent.push(newLecture);
        }
        return c;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle:    '',
      lectureDuration: '',
      lectureUrl:      '',
      isPreviewFree:   false,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // TODO: gather Quill HTML via quillRef.current.root.innerHTML
    // and submit { courseTitle, htmlDescription, price, discount, image, chapters } to your backend
  };

  return (
    <div className="h-screen overflow-scroll p-6">
      <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSubmit}>
        {/* Course Title */}
        <div>
          <label className="block mb-1 font-medium">Course Title</label>
          <input
            type="text"
            value={courseTitle}
            onChange={e => setCourseTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Description (Quill) */}
        <div>
          <label className="block mb-1 font-medium">Course Description</label>
          <div
            ref={editorRef}
            className="h-40 border rounded"
          />
        </div>

        {/* Price & Thumbnail */}
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              value={coursePrice}
              onChange={e => setCoursePrice(e.target.value)}
              required
              className="w-28 border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Thumbnail</label>
            <div className="flex items-center gap-2">
              <label className="p-2 bg-blue-600 text-white rounded cursor-pointer">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => setImage(e.target.files[0])}
                />
              </label>
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  className="h-12 rounded"
                />
              )}
            </div>
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="block mb-1 font-medium">Discount %</label>
          <input
            type="number"
            min={0}
            max={100}
            value={discount}
            onChange={e => setDiscount(e.target.value)}
            required
            className="w-24 border rounded px-2 py-1"
          />
        </div>

        {/* Chapters & Lectures */}
        <div>
          <h3 className="font-medium mb-2">Chapters</h3>
          {chapters.map((chapter, i) => (
            <div key={chapter.chapterId} className="mb-4 border rounded">
              <div className="flex justify-between items-center p-3 bg-gray-100">
                <button
                  type="button"
                  onClick={() => handleChapter('toggle', chapter.chapterId)}
                  className="font-semibold"
                >
                  {i + 1}. {chapter.chapterTitle}
                </button>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={() => handleLecture('add', chapter.chapterId)}
                    className="text-blue-600"
                  >
                    + Lecture
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChapter('remove', chapter.chapterId)}
                    className="text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              {!chapter.collapsed && (
                <ul className="p-3 space-y-2">
                  {chapter.chapterContent.map((lec, idx) => (
                    <li key={lec.lectureId} className="flex justify-between">
                      <span>
                        {idx + 1}. {lec.lectureTitle} – {lec.lectureDuration}m
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleLecture('remove', chapter.chapterId, idx)
                        }
                        className="text-red-600"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => handleChapter('add')}
            className="px-4 py-2 bg-blue-100 rounded"
          >
            + Add Chapter
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded"
        >
          Create Course
        </button>
      </form>

      {/* Lecture Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded max-w-sm w-full space-y-4">
            <h4 className="text-lg font-semibold">Add Lecture</h4>

            <input
              type="text"
              placeholder="Title"
              value={lectureDetails.lectureTitle}
              onChange={e =>
                setLectureDetails(d => ({ ...d, lectureTitle: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="Duration (min)"
              value={lectureDetails.lectureDuration}
              onChange={e =>
                setLectureDetails(d => ({ ...d, lectureDuration: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
            />
            <input
              type="url"
              placeholder="Video URL"
              value={lectureDetails.lectureUrl}
              onChange={e =>
                setLectureDetails(d => ({ ...d, lectureUrl: e.target.value }))
              }
              className="w-full border rounded px-2 py-1"
            />
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={lectureDetails.isPreviewFree}
                onChange={e =>
                  setLectureDetails(d => ({ ...d, isPreviewFree: e.target.checked }))
                }
              />
              Free Preview?
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addLecture}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
