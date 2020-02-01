import React from 'react';
import './App.css';
import TableContainer from  './components/TableContainer';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { TableProvider } from './components/TableContext'

function App() {
  return (
    <div className="App">
      <TableProvider>
        <TableContainer></TableContainer>
      </TableProvider>
    </div>
  );
}

export default App;
