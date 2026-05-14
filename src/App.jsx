import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Reach from './pages/Reach';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', onLocationChange);
    
    // Clean up
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  // Determine which component to show based on path
  const showReach = currentPath === '/reach' || currentPath === '/Reach.html';
  
  return showReach ? <Reach /> : <Home />;
}

export default App;