import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isEducator } = useContext(AppContext);
  const [user, setUser] = useState(null);

  const isCourseListPage = location.pathname.includes('/course-list');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div
      className={
        `flex justify-between items-center px-4 sm:px-10 md:px-14 lg:px-36
         border-b border-gray-500 py-4
         ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`
      }
    >
      <img
        src={assets.logo}
        alt="Edemy logo"
        className="w-28 lg:w-32 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {/* desktop */}
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        {user ? (
          <>
            <button onClick={() => navigate('/educator')}>
              {isEducator ? 'Educator Dashboard' : 'Become Educator'}
            </button>
            | <Link to="/my-enrollments">My Enrollments</Link>
            | <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
            onClick={() => navigate('/register')}
          >
            Create Account
          </button>
        )}
      </div>

      {/* mobile */}
      <div className="md:hidden flex items-center gap-2 text-gray-500">
        {user ? (
          <>
            <button onClick={() => navigate('/educator')}>
              {isEducator ? 'Educator Dashboard' : 'Become Educator'}
            </button>
            | <Link to="/my-enrollments">My Enrollments</Link>
            | <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => navigate('/register')}>
            <img src={assets.user_icon} alt="Sign Up" />
          </button>
        )}
      </div>
    </div>
  );
}
