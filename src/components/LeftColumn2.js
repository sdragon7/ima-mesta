import React, {  useState, useEffect, useContext } from 'react';
import { Input, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, Button, Table as TableBsr } from 'reactstrap'
import BottomScrollListener from 'react-bottom-scroll-listener'
import classnames from "classnames";
import {TableConsumer} from './TableContext';
import { TableContext } from "./TableContext.js"


import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function LeftColumn(props) {


  const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }))(TableRow);

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  
  const useStyles = makeStyles({
    table: {
      minWidth: 700,
    },
  });
  const classes = useStyles();
const context = useContext(TableContext);
const activeTable = context.activeTable;
  
const style = {
    height : 'calc(100vh - 100px)',
    backgroundColor : 'transparent',
    borderRadius : '0',
    boxShadow : 'none'
}

useEffect(() => {
  let ts = 0;
    let t = 0;
    if(activeTable.orders.length > 0) {
        activeTable.orders.forEach((o) => {
        if(o.checked && (o.myTab + "" === activeTable.activeTab + "")) {
          ts += o.quantity * o.product.price
        }
        t += o.quantity * o.product.price;
      })
    }
    context.setTotalSelected(ts);
},[activeTable.orders, activeTable.activeTab]);

    return(
      <TableConsumer>
        {
        context => {
          return(
          <Col lg={4} md={4} style={style} className="p-0">
          <Nav pills style={{cursor : 'pointer'}} className="p-2" id="bill-pills">
              {
                activeTable.tabsToRender.map(
                  (ttRender, index) => {
                    return (
                      <NavItem key={index}>
                      <NavLink
                        className={classnames({ active: activeTable.activeTab === ttRender.tabNumber })}
                        onClick={() => { context.setTableActiveTab(activeTable, ttRender.tabNumber + ""); }}
                      >
                        Racun {' '} {ttRender.tabNumber}
                      </NavLink>
                    </NavItem>
                    )
                  }
                )
              }
             
            <NavItem className="p-2">
            <i id="addBillBtn" className="fas fa-plus" onClick={() => {
                    context.addNewTab() }}></i>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTable.activeTab}>
            {
              activeTable.tabsToRender.map(
                (ttRender, index) => {
                  return (
                    <>
                    <TabPane key={index}  tabId= {ttRender.tabNumber } >
                      {/* <BottomScrollListener debounce = "0" onBottom = {() => {}}>
                        { scrollRef => (
                      <div  ref = {scrollRef} style = {{height :"100px" ,overflowY : "scroll"}}> </div>
                        )}
                </BottomScrollListener>  */}
                
              
              </TabPane>
              
              </>
                  )

                }

              )
                
            }     
            </TabContent>

            <TableBsr striped>
                          <thead>
                            <tr>
                              <th>Proizvod</th>
                             
                              <th>Kolicina</th>
                              <th>Ukupno</th>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeTable.orders.filter(o => (o.myTab + "" === activeTable.activeTab)).map((order, index) => {
                              return (
                                <tr key={index}>
                                
                                  <td>{order.product.name}</td>
                            
                                  <td>{order.quantity}</td>
                                  <td>{order.quantity * order.product.price}</td>
                                  <td>
                                    <Button
                                      color="success"
                                      onClick={() => {
                                        context.increaseQuantity(order);
                                      
                                      }}
                                    >
                                      +
                                    </Button>
                                  </td>
                                  <td>
                                    <Button
                                      color="danger"
                                      onClick={() => {
                                        context.decreaseQuantity(order);
                                      }}
                                    >
                                      -
                                    </Button>
                                  </td>
                                  <td >
                                  <input  type="checkbox" 
                                          id= {order.product.id} 
                                          name={order.product.id}
                                          value ={order.product.id}  
                                          defaultChecked = {order.checked}
                                          onClick={() => {
                                            context.setTableOrders(order)
                                          }}
                                  />
                                    <label htmlFor= {order.product.id}></label>                                    
                                  </td>

                                </tr>
                              );
                            })}
                         
                          </tbody>
                        </TableBsr>
    <h3>Pojedinacno : {context.totalSelected}</h3>
                <h3>Ukupno za sto : {activeTable.total}</h3>
            <div>
                <Button color = "success" onClick = { () => {context.checkPlease()}} > NAPLATI </Button>
                {' '}
                <Button onClick = { () => { 
                  context.setShowTableView()}
                  }> 
                    NAZAD 
                </Button>

                </div>
      </Col>
          )
        }

    }

    
      </TableConsumer>

    )
}