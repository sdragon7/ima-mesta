import React, {  useState, useEffect, useContext } from 'react';
import { Input, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, Button, Table as TableBsr } from 'reactstrap'
import classnames from "classnames";
import {TableConsumer} from './TableContext';
import { TableContext } from "./TableContext.js"

export default function LeftColumn(props) {

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