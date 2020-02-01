import React, { Component, useState } from 'react';
import { Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, Button, Table as TableBsr } from 'reactstrap'
import BottomScrollListener from 'react-bottom-scroll-listener'
import classnames from "classnames";

export default function LeftColumn(props) {

  
const style = {
    height : 'calc(100vh - 100px)',
    backgroundColor : 'transparent',
    borderRadius : '0',
    boxShadow : 'none',
    color: 'green',

}
const [tabsToRender, setTabsToRender] = useState(props.tabsToRender);
const [tableNumber, setTableNumber] = useState(props.tableNumber);
const [tableColor, setTableColor] = useState(props.tableColor);
const [orders, setOrders] = useState(props.orders);
const [total, setTotal] = useState(props.total);
const [activeTab, setActiveTab] = useState(props.total);
const [isDraggable, setIsDraggable] = useState(props.isDraggable);
const [numberOfTabs, setNumberOfTabs] = useState(props.numberOfTabs)
const addNewTab = () => {
  
  setTabsToRender(prev => [...prev, {"tabNumber": numberOfTabs}])
  setActiveTab(numberOfTabs)
  setNumberOfTabs(numberOfTabs + 1)

}




    return(
        <Col lg={4} md={4} className="p-0">
            <Card style={style}>
            <Nav tabs>
                {
                  tabsToRender.map(
                    ttRender => {

                      return (
                        <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === ttRender.tabNumber })}
                          
                        >
                          Racun {' '} {ttRender.tabNumber}
                        </NavLink>
                      </NavItem>


                      )
                    }

                  )

                }
               
               
              <NavItem>
                 
                    <Button  color = "success"onClick={() => {
                               this.addNewTab()
                    }}> + </Button>
                
                </NavItem>
              </Nav>


              <TabContent activeTab={activeTab}>
     
              {
                tabsToRender.map(
                  ttRender => {

                    return (
                      <TabPane  tabId= {ttRender.tabNumber } >
                        <BottomScrollListener debounce = "0" onBottom = {() => {}}>
                          { scrollRef => (
                        <div  ref = {scrollRef} style = {{height :"250px" ,overflowY : "scroll"}}>
                       

                          <TableBsr>
                            <thead>
                              <tr>
                                <th>Proizvod</th>
                                {/* <th>Cena</th> */}
                                <th>Kolicina</th>
                                <th>Ukupno</th>
                              </tr>
                            </thead>
                       
                            <tbody>
                              {orders.filter(o => (o.myTab === activeTab)).map(order => {
                                return (
                                  <tr key={order.product.id}>
                                    <td>{order.product.name}</td>
                                    {/* <td>{order.product.price}</td> */}
                                    <td>{order.quantity}</td>
                                    <td>{order.quantity * order.product.price}</td>
                                    <td>
                                      <Button
                                        color="success"
                                        onClick={() => {
                                 
                                        }}
                                      >
                                        +
                                      </Button>
                                    </td>
                                    <td>
                                      <Button
                                        color="danger"
                                        onClick={() => {
                                          
                                        }}
                                      >
                                        -
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                           
                            </tbody>
                          </TableBsr>

                        
                          
                  </div>

                          )}
                  </BottomScrollListener>
                  <h3>Ukupno za sto : {total}</h3>

                </TabPane>
                    )

                  }

                )
              }     
              </TabContent>
            </Card>
        </Col>
    )
}