import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import DataTraceability from './components/DataTraceability'; // Import DataTraceability component
import dataFlow from './data/DataTraceabilityExampleData'; // Import example DataFlow data

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/manual">Onboarding Manual</Link></li>
            <li><Link to="/ebook">Index Page</Link></li>
          </ul>
        </nav>

        <Route path="/manual" exact component={() => { 
          window.location.href = "/ThinkAlike_Onboarding_Manual_Public.html"; 
          return null;
        }}/>
        <Route path="/ebook" exact component={() => { 
          window.location.href = "/index.html"; 
          return null;
        }}/>

        <div>
          <h1>UI Validation Revolution - DataTraceability ETHICAL DATA VALIDATION SHOWCASE</h1>
          {/* DataTraceability Component Instance - ETHICAL DATA VALIDATION SHOWCASE - ZENITH OF EXCELLENCE EDITION! */}
          <DataTraceability dataFlow={dataFlow} />
        </div>
      </div>
    </Router>
  );
}

export default App;
