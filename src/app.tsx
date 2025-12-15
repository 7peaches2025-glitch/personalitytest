import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Test from './pages/Test';
import Report from './pages/Report';

function App() {
  return (
    

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/test" element={<Test />} />
        <Route path="/report" element={<Report />} />
        <Route path="/state/debug/:maskId" element={<DebugReportWrapper />} />
      </Routes>
    </BrowserRouter>
    
  );
}

// Wrapper to inject debug state for direct URL access
import { useParams, Navigate } from 'react-router-dom';

function DebugReportWrapper() {
  const { maskId } = useParams();
  // Redirect to /report with the state
  return <Navigate to="/report" state={{ debugMaskId: maskId }} replace />;
}

export default App;