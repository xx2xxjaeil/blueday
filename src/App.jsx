import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Home } from './views/Home';

const App = () => {
  return (
    <Router>
      {/* <CommonLayout> */}
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/home" element={<Home />} /> */}
        {/* <Route path="/live" element={<Live />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/temperature-chart" element={<TemperatureChart />} /> */}
      </Routes>
      {/* </CommonLayout> */}
    </Router>
  );
};

export default App;
