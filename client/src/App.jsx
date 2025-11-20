import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PostList from './pages/PostList';
import SinglePost from './pages/SinglePost';
import PostForm from './pages/PostForm';
import NotFound from './pages/NotFound';
import Login from './pages/Login';      
import Register from './pages/Register'; 

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow:1 p-4 container mx-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PostList />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/Register" element={<Register/>} />

          {/* Create/Edit Form Routes */}
          <Route path="/create" element={<PostForm />} />
          <Route path="/edit/:id" element={<PostForm />} />
          
{/* ... existing protected and error routes */}       
          <Route path="/create" element={<PostForm />} />
          <Route path="/edit/:id" element={<PostForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;