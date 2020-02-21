import React, { useEffect, useState } from 'react';
import './App.css';
import TableContainer2 from  './components/TableContainer2';
import { TableProvider } from './components/TableContext'
import KeyPad from './components/KeyPad';
import Idle from 'react-idle';
import Warehouse from './components/Warehouse'
import Test from './components/Test'
import WarehouseStatistics from './components/WarehouseStatistics'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import New from './components/New';

function App() {

  const [locked, setLocked] = useState(false);
  const [isLogged, setIsLogged] = useState(false)

  const isUserLogged = (value) => {
    setIsLogged(value)
    setLocked(false)
  }
  

  return (
    <div className="App">
      <BrowserRouter>
              <Switch>
                <Switch>
                  <Route exact path="/" render={props => 
                  <>
                    <Idle
                    timeout = {100000}
                    onChange={({ idle }) => setLocked(true)}/>

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
                  </>
                  }
                   
                  />
                  <Route
                    exact
                    path="/warehouse"
                    render={props => <Warehouse {...props} />}
                  />
                  <Route path="/warehouse/statistics" render={props => <WarehouseStatistics {...props} />} />
                  <Route path="/test" render={props => <Test {...props} />} />
                  <Route
                    exact
                    path="/add"
                    render={props => <New {...props} />}
                  />
                  <Redirect to="/" />
                </Switch>
              </Switch>
            </BrowserRouter> 
    </div>
  );
}

export default App;
