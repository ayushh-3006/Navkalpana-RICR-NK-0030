import { useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext.jsx';

const AutoLogout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); // Assuming your AuthContext has logout functionality too. 
  
  // Timeout in milliseconds (e.g., 15 minutes = 15 * 60 * 1000)
  const IDLE_TIMEOUT = 15 * 60 * 1000; 
  const timeoutId = useRef(null);

  // Function to handle the actual logout
  const handleLogout = () => {
    // Check if user is actually logged in before showing toast
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      toast.error("Session expired due to inactivity. Please login again.", {
        icon: '🔒',
        style: {
          borderRadius: '10px',
          background: '#0a0a0a',
          color: '#fff',
          border: '1px solid #333'
        },
      });
      navigate('/login');
    }
  };

  // Function to reset the timer whenever the user interacts
  const resetTimer = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    // Only set timer if user is on a protected route (dashboard)
    if (location.pathname.includes('/dashboard')) {
       timeoutId.current = setTimeout(handleLogout, IDLE_TIMEOUT);
    }
  };

  useEffect(() => {
    // List of DOM events that count as "activity"
    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart'
    ];

    // Attach event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Start the timer initially
    resetTimer();

    // Cleanup listeners on unmount
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [location.pathname]); // Re-run if path changes

  // This component doesn't render anything visible, it just wraps your app
  return <>{children}</>;
};

export default AutoLogout;