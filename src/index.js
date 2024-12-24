import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './Redux/store';

import { BrowserRouter as Router } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>

 
  <React.StrictMode>
  <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
  </Router>
);