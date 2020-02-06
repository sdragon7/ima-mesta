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

const increaseQuantity = (id, price) => {
  setTotal(total + price);
  setOrders(
    orders.map(order =>
      (order.product.id === id && activeTab === order.myTab)
      ? {...order, quantity : order.quantity + 1}
      : order)

  )
  

};

const decreaseQuantity = (id, price) => {
  setTotal(total - price);
  setOrders(orders
    .filter(order => order.product.id !== id || order.quantity !== 1 || (order.product.id === id && order.myTab !== activeTab))
    .map(order =>
      (order.product.id === id && activeTab === order.myTab)
        ? Object.assign({}, order, { quantity: order.quantity - 1 })
        : order
    ))

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
                        onClick={() => { toggleTab(ttRender.tabNumber); }}
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
                             addNewTab()
                  }}> + </Button>
              
              </NavItem>
            </Nav>


            <TabContent activeTab={activeTab}>
   
            {
              tabsToRender.map(
                ttRender => {
                  console.log(ttRender + 'tabcina')
                  return (
                    <>
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
                                        increaseQuantity(order.product.id, order.product.price);
                                      
                                      }}
                                    >
                                      +
                                    </Button>
                                  </td>
                                  <td>
                                    <Button
                                      color="danger"
                                      onClick={() => {
                                        decreaseQuantity(order.product.id, order.product.price);
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
          </Card>
      </Col>
          )
        }

    }
      </TableConsumer>

    )
}