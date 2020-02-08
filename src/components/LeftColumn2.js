import React, {  useState, useEffect } from 'react';
import { Input, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, Button, Table as TableBsr } from 'reactstrap'
import BottomScrollListener from 'react-bottom-scroll-listener'
import classnames from "classnames";
import {TableConsumer} from './TableContext';
export default function LeftColumn(props) {

  
const style = {
    height : 'calc(100vh - 100px)',
    backgroundColor : 'transparent',
    borderRadius : '0',
    boxShadow : 'none'

}
const [tabsToRender, setTabsToRender] = useState(props.table.tabsToRender);
const [tableNumber, setTableNumber] = useState(props.table.tableNumber);
const [tableColor, setTableColor] = useState(props.table.tableColor);
const [orders, setOrders] = useState(props.table.orders);
const [total, setTotal] = useState(props.table.total);
const [activeTab, setActiveTab] = useState(props.table.activeTab);
const [isDraggable, setIsDraggable] = useState(props.table.isDraggable);
const [numberOfTabs, setNumberOfTabs] = useState(props.table.numberOfTabs)
const [totalSelected, setTotalSelected] = useState(props.table.total);


useEffect(() => {
  calculateTotals();
  
},[orders, activeTab]);

const calculateTotals = () => {
    let ts = 0;
    let t = 0;
    if(orders.length > 0) {
      orders.forEach((o) => {
        if(o.checked && o.myTab === activeTab) {
          ts += o.quantity * o.product.price
        }
        t += o.quantity * o.product.price;
      })

    }
  
    setTotalSelected(ts);
    setTotal(t);

}

const addNewTab = () => {  
  setTabsToRender(prev => [...prev, {"tabNumber": "" +numberOfTabs}]) 
  setActiveTab("" +numberOfTabs)
  setNumberOfTabs(numberOfTabs + 1)
  console.log(tabsToRender)

}

const toggleTab = tab => {
  if (activeTab !== tab) setActiveTab(tab);

};

const increaseQuantity = (id, price, order) => {

    if(order.myTab === activeTab)
        order.quantity = order.quantity + 1    
    
    setTotal(total + price);
};

const decreaseQuantity = (id, price, order) => {
    if(order.myTab === activeTab)
        order.quantity = order.quantity - 1

    setTotal(total - price);

    // ovde treba i ako je order lista prazna smanjenjem da sto pozeleni
}

const checkPlease = () => {
  let remainingOrders = orders.filter(o => (!o.checked || o.myTab !== activeTab ));
  if(remainingOrders.length == 0) {

    setTableColor("success");
    setNumberOfTabs(2);
    setTabsToRender( [{tabNumber : "1"}]);
    setTotal(0);
    setOrders([]);
    setIsDraggable(true);
    setActiveTab("1");
  }
  else {
    setOrders(remainingOrders);
  }
 
  // call callback to tableview
};



    return(
      <TableConsumer>
        {
        context => {
          return(
          <Col lg={4} md={4} style={style} className="p-0">
          <Nav pills style={{cursor : 'pointer'}} className="p-2" id="bill-pills">
              {
                tabsToRender.map(
                  ttRender => {

                    return (
                      <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === ttRender.tabNumber })}
                        onClick={() => { toggleTab(ttRender.tabNumber); context.setTableActiveTab(props.table, ttRender.tabNumber + ""); }}
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
                    addNewTab();
                    context.setTableActiveTab(props.table,  "" + numberOfTabs); }}></i>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
            {
              tabsToRender.map(
                (ttRender, index) => {
                  console.log(ttRender + 'tabcina')
                  return (
                    <>
                    <TabPane key={index}  tabId= {ttRender.tabNumber } >
                      <BottomScrollListener debounce = "0" onBottom = {() => {}}>
                        { scrollRef => (
                      <div  ref = {scrollRef} style = {{height :"250px" ,overflowY : "scroll"}}>
                     

                        <TableBsr striped>
                          <thead>
                            <tr>
                              <th>Proizvod</th>
                              {/* <th>Cena</th> */}
                              <th>Kolicina</th>
                              <th>Ukupno</th>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                     
                          <tbody>
                            {orders.filter(o => (o.myTab === activeTab)).map((order, index) => {
                              return (
                                <tr key={index}>
                                
                                  <td>{order.product.name}</td>
                                  {/* <td>{order.product.price}</td> */}
                                  <td>{order.quantity}</td>
                                  <td>{order.quantity * order.product.price}</td>
                                  <td>
                                    <Button
                                      color="success"
                                      onClick={() => {
                                        increaseQuantity(order.product.id, order.product.price, order);
                                      
                                      }}
                                    >
                                      +
                                    </Button>
                                  </td>
                                  <td>
                                    <Button
                                      color="danger"
                                      onClick={() => {
                                        decreaseQuantity(order.product.id, order.product.price, order);
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
                                          onClick={() =>{
                                            setOrders(orders.map(o => {
                                              if(order.product.id !== o.product.id) return o;
                                              else return {...order, checked : !order.checked}
                                              
                                            }))    

                                          }}
                                  />
                                    <label htmlFor= {order.product.id}></label>                                    
                                  </td>

                                </tr>
                              );
                            })}
                         
                          </tbody>
                        </TableBsr>

                      
                        
                </div>

                        )}
                </BottomScrollListener>
                <h3>Pojedinacno : {totalSelected}</h3>
                <h3>Ukupno za sto : {total}</h3>
              
              </TabPane>
              
              </>
                  )

                }

              )
                
            }     
            </TabContent>
            <div>
                <Button color = "success" onClick = { () => {checkPlease()}} > NAPLATI </Button>
                {' '}
                <Button onClick = { () => { 
                  
                  context.updateTable(
                    {
                      orders, total, isDraggable, activeTab, numberOfTabs, tabsToRender, tableNumber, tableColor, controlledPosition : props.table.controlledPosition
                    }
                  )
                  props.showTableView()}

                  } > 
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