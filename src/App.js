import React, { useEffect, useState } from 'react';
import './App.css';
import TableContainer from  './components/TableContainer';
import { TableProvider } from './components/TableContext'
import KeyPad from './components/KeyPad';
import Idle from 'react-idle';

function App() {

  const [locked, setLocked] = useState(false);



  return (
    <div className="App">
   
      <Idle
      timeout = {100000}
      onChange={({ idle }) => setLocked(true)}
     
      />


        {locked
          ? 
          <>
            <h1>You have been inactive for 10 secs</h1>
            <KeyPad/>
          </>
          : 
          <TableProvider>
            <TableContainer></TableContainer>
          </TableProvider>
        } 

    
    </div>
  );
}

export default App;
