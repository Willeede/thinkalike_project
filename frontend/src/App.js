import React from 'react';
import DataTraceability from './components/DataTraceability'; // Import DataTraceability component
import dataFlow from './data/DataTraceabilityExampleData'; // Import *empty* data

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Replace this with your desired title */}
        <h1>My Application Homepage</h1> 
      </header>
      <section className="content">
        {/* DataTraceability Component with *empty* data */}
        <DataTraceability dataFlow={dataFlow} />
      </section>
    </div>
  );
}

export default App;
