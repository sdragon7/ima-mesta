import React, { Component } from "react";
import Draggable, { DraggableCore } from "react-draggable"; // Both at the same time
import { Table as TableBsr, Button, Nav, NavItem, NavLink } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { TabPane, TabContent } from "reactstrap";
import { Resizable } from "re-resizable";
import ProductPicker from "./ProductPicker";
import classnames from "classnames";
import BottomScrollListener from 'react-bottom-scroll-listener';

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
  borderRadius: "100px"
};

const products = [
  {
    id: 1,
    price: 200,
    name: "sok"
  },
  {
    id: 2,
    price: 110,
    name: "kafa"
  },
  {
    id: 3,
    price: 150,
    name: "voda"
  },
  {
    id: 4,
    price: 250,
    name: "pivo"
  }
];

export default class Table extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.state = {
      isDraggable : true,
      activeTab: "1",
      numberOfTabs : 2,
      tabsToRender : [{tabNumber : "1"}],
      tableNumber: props.tableNumber,
      tableColor: "danger",
      modal: false,
      total: 0,
      orders: [
        {
          product: products[0],
          quantity: 1,
          myTab : "1"
        },
        {
          product: products[1],
          quantity: 2 ,
          myTab : "1"
        }
      ]
    };
  }

  componentDidMount() {
    this.updateTotal();
  }

  scrollToBottom = () => {
    this.myRef.scrollIntoView({behaviour : "smooth", block:"end" , inline :"nearest"})

  }

  addNewTab = () => {
      const {numberOfTabs, tabsToRender } = this.state;
      this.setState(
        {tabsToRender : [...tabsToRender, {"tabNumber": this.state.numberOfTabs}] , activeTab : numberOfTabs, numberOfTabs : numberOfTabs + 1}
      )

  }

  updateTotal = () => {
    let total = 0;
    this.state.orders.forEach(
      order => (total = total + order.product.price * order.quantity)
    );
    this.setState({ total: total });
  };

  increaseQuantity = (id, price) => {
    const { orders, total, activeTab } = this.state;
    this.setState({
      total: total + price,
      orders: orders.map(order =>
        (order.product.id === id && activeTab == order.myTab)
          ? Object.assign({}, order, { quantity: order.quantity + 1 })
          : order
      )
    });
  };

  decreaseQuantity = (id, price) => {
    const { orders, total, activeTab } = this.state;
    this.setState({
      modal:
        orders.length === 1 &&
        orders.filter(o => o.product.id === id && activeTab == o.myTab)[0].quantity === 1
          ? false
          : true,
      isDraggable:
      orders.length === 1 &&
      orders.filter(o => o.product.id === id && activeTab == o.myTab)[0].quantity === 1
        ? true
        : false,
      tableColor:
        orders.length === 1 &&
        orders.filter(o => o.product.id === id && activeTab == o.myTab)[0].quantity === 1
          ? "success"
          : "danger",
      total: total - price,
      orders: orders
        .filter(order => order.product.id !== id || order.quantity !== 1 || (order.product.id === id && order.myTab !== activeTab))
        .map(order =>
          (order.product.id === id && activeTab == order.myTab)
            ? Object.assign({}, order, { quantity: order.quantity - 1 })
            : order
        )
    });
    console.log(this.state.orders);
    if (this.state.orders.length === 0) {
      this.setState({isDraggable : true, modal: false, activeTab: "1" });
    }
  };

  checkPlease = () => {
    this.setState({
      tableColor: "success",
      numberOfTabs : 2,
      tabsToRender : [{tabNumber : "1"}],
      total: 0,
      orders: [],
      modal: false,
      isDraggable : true
    });
  };

  addToOrder = (prod, quan) => {
    const { total, orders, activeTab } = this.state;
    let filtered = orders.filter(o => (o.product.id == prod.id && activeTab ==o.myTab ));
    if(filtered.length > 0) {
      this.setState({
        total: total + prod.price,
        orders: orders.map(order =>
          order.product.id === prod.id && activeTab ==order.myTab
            ? Object.assign({}, order, { quantity: order.quantity + 1 })
            : order
        )
      });
      return
    }
    this.setState({
      tableColor: "danger",
      total: total + prod.price * quan,
      orders: [...orders, { product: prod, quantity: quan, myTab : activeTab }]
    });
    //this.scrollToBottom();
  };

  toggle = () => {
    const { modal, isDraggable } = this.state;
    this.setState({ modal: !modal, activeTab: "1" , isDraggable : !isDraggable});
  };

  toggleTab = tab => {
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
  };

  render() {
    const {
      tableNumber,
      tableColor,
      modal,
      orders,
      total,
      activeTab,
      isDraggable
    } = this.state;
    return (
      <Draggable defaultPosition={{ x: 25, y: 111 }} onStart = {() => isDraggable}>
        <Resizable
          style={style}
          defaultSize={{
            width: 100,
            height: 100
          }}
        >
          <Button
            color={tableColor}
            style={{
              minHeight: "4.5em",
              minWidth: "6em",
              width: "100%",
              height: "100%",
              borderRadius: "100px"
            }}
            onClick={() => {
              this.props.setSelectedId(tableNumber);
            }}
            onDoubleClick={this.toggle}
          >
            Sto {tableNumber} <br></br> {total} rsd
          </Button>
          <Modal size="xl" isOpen={modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Sto {tableNumber}</ModalHeader>
            <ModalBody style={{ }}>
              <Nav tabs>
                {
                  this.state.tabsToRender.map(
                    ttRender => {

                      return (
                        <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === ttRender.tabNumber })}
                          onClick={() => {
                            this.toggleTab(ttRender.tabNumber);
                          }}
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
                      this.addNewTab();
                    }}> + </Button>
                
                </NavItem>
              </Nav>


              <TabContent activeTab={activeTab}>
     
              {
                this.state.tabsToRender.map(
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
                              {orders.filter(o => (o.myTab === this.state.activeTab)).map(order => {
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
                                          this.increaseQuantity(
                                            order.product.id,
                                            order.product.price
                                          );
                                        }}
                                      >
                                        +
                                      </Button>
                                    </td>
                                    <td>
                                      <Button
                                        color="danger"
                                        onClick={() => {
                                          this.decreaseQuantity(
                                            order.product.id,
                                            order.product.price
                                          );
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

                          <div ref = {(el) => {this.myRef = el;}} style = {{float : "left", clear : "both"}}>
                          </div>
                          
                  </div>

                          )}
                  </BottomScrollListener>
                  <h3>Ukupno za sto : {this.state.total}</h3>

                </TabPane>
                    )

                  }

                )

              }
         

                   
               
              </TabContent>

            </ModalBody>
            <ModalFooter>
            <ProductPicker addToOrder={this.addToOrder}></ProductPicker>

        

              <Button color="success" onClick={this.checkPlease}>
                Naplati
              </Button>
              <Button color="secondary" onClick={this.toggle}>
                Nazad
              </Button>{" "}
     
            
            </ModalFooter>
          </Modal>
        </Resizable>
      </Draggable>
    );
  }
}