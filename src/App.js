import React, { useEffect, useState } from 'react';
import './App.css';
import TableContainer2 from  './components/TableContainer2';
import { TableProvider } from './components/TableContext'
import KeyPad from './components/KeyPad';
import Idle from 'react-idle';

function App() {

  const [locked, setLocked] = useState(false);
  const [isLogged, setIsLogged] = useState(false)

  const isUserLogged = (value) => {
    setIsLogged(value)
    setLocked(false)
  }
  

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
            <KeyPad isUserLogged={isUserLogged} />
          </>
          : 
          <TableProvider>
            <TableContainer2></TableContainer2>
          </TableProvider>
        } 

    
    </div>
  );
}

export default App;
