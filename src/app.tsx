import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Test from './pages/Test';
import Report from './pages/Report';
import { useParams, Navigate } from 'react-router-dom';

function DebugReportWrapper() {
  const { maskId } = useParams();

  return <Navigate to="/report" state={{ debugMaskId: maskId }} replace />;
}




function App() {
  return (


    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/test" element={<Test />} />
        <Route path="/report" element={<Report />} />
        <Route path="/state/debug/:maskId" element={<DebugReportWrapper />} />
      </Routes>
    </HashRouter>

  );
}




export default App;