import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Login from './auth/login';
import Register from './auth/register';
import Userdashboard from './dashboard/userdashboard';
import FindRides from './dashboard/FindRides';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userdashboard" element={<Userdashboard />} />
         <Route path="/find-rides" element={<FindRides />} />
      </Routes>
    </Router>
  );
}

export default App;