import React, { useState, useEffect } from 'react';
import DataTraceability from './components/DataTraceability';
import './App.css';
import 'react-tooltip/dist/react-tooltip.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Graph from './components/Graph';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [dataFlow, setDataFlow] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Use direct Render backend URL
    const backendUrl = 'https://thinkalike-api.onrender.com';
    fetch(`${backendUrl}/api/v1/graph/graph`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setDataFlow(data);