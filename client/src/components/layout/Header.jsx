import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // NEW IMPORT

const Header = () => {
  const { userInfo, logout } = useAuth(); // Get auth state and logout function
  
  // Optional: Handle redirection on logout
  const handleLogout = () => {
    logout();
    // Redirect to home or login page after clearing state
    window.location.href = '/login'; 
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-blue-400">
          MERN Blog 🚀
        </Link>
        <nav>
          <Link to="/" className="mx-2 hover:text-blue-400">Home</Link>
          <Link to="/create" className="mx-2 bg-blue-500 p-2 rounded hover:bg-blue-600">
            Create Post
          </Link>
          
          {/* Conditional Rendering based on Auth State */}
          {userInfo ? (
            <>
              <span className="mx-2 text-green-300">Hello, {userInfo.name}</span>
              <button 
                onClick={handleLogout} 
                className="mx-2 bg-red-500 p-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mx-2 hover:text-blue-400">Login</Link>
              <Link to="/register" className="mx-2 hover:text-blue-400">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;