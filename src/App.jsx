import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Contact from './pages/contact/Contact';
import Tips from './pages/tips/Tips';
import Gallery from './pages/gallery/Gallery';
import Legal from './pages/legal/Legal';
import News from './pages/news/News';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<News />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
