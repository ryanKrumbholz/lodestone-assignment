import React from 'react';
import './App.css';
import DataTable from './components/DataTable'
import 'bootstrap/dist/css/bootstrap.min.css';
import Calculations from './components/Calculations'

function App() {
  return (
    <div>
      <div class="table-wrapper-scroll-y my-custom-scrollbar">
        <DataTable/>
      </div>
        <Calculations/>
    </div>
  );
}

export default App;
