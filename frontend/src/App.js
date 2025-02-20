import React from 'react';
import DataTraceability from './components/DataTraceability'; // Import DataTraceability
import dataFlow from './data/DataTraceabilityExampleData'; // Import example data
import './App.css'; // Assuming you have some global styles

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Application Homepage</h1> {/* Or your desired title */}
      </header>
      <section className="content">
        {/* Render the DataTraceability component, passing in the data */}
        <DataTraceability dataFlow={dataFlow} />
      </section>
    </div>
  );
}

export default App;
