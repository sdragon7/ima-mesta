import React, { Component } from "react";
import Draggable, { DraggableCore } from "react-draggable"; // Both at the same time
import {  Button } from "reactstrap";
import { Resizable } from "re-resizable";
import { TableConsumer } from './TableContext.js'

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
  borderRadius: "100px"
};



export default class Table extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();

    this.state = {
      controlledPosition : this.props.table.controlledPosition
    }
  }

  componentDidMount() {
    console.log(' I mounted! ' + this.props.table.tableNumber)
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

  onControlledDrag = (e, position) => {
    const {x, y} = position;
    this.setState({controlledPosition: {x, y}});
  };


  // addToOrder = (prod, quan) => {
  //   const { total, orders, activeTab } = this.state;
  //   let filtered = orders.filter(o => (o.product.id == prod.id && activeTab ==o.myTab ));
  //   if(filtered.length > 0) {
  //     this.setState({
  //       total: total + prod.price,
  //       orders: orders.map(order =>
  //         order.product.id === prod.id && activeTab ==order.myTab
  //           ? Object.assign({}, order, { quantity: order.quantity + 1 })
  //           : order
  //       )
  //     });
  //     return
  //   }
  //   this.setState({
  //     tableColor: "danger",
  //     total: total + prod.price * quan,
  //     orders: [...orders, { product: prod, quantity: quan, myTab : activeTab }]
  //   });
  //   //this.scrollToBottom();
  // };

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
      isDraggable, 
      total,
    } = this.props.table;

    const {
      controlledPosition
    } = this.state;


    return (
      <Draggable  position={controlledPosition} onStart = {() => isDraggable}  onDrag={this.onControlledDrag} onStop= {() => {this.props.updateCoordinatesOfSelectedTable(controlledPosition, tableNumber);
    }}>
        <Resizable
          style={style}
          defaultSize={{
            width: 100,
            height: 100
          }}
        >
          <TableConsumer>
            {

              context => {
              
                return(
                  <Button
                  color={tableColor}
                  style={{
                    minHeight: "4.5em",
                    minWidth: "6em",
                    width: "100%",
                    height: "100%",
                    borderRadius: "100px"
                  }}
                
                  onClick = {
                    () => {
                      context.setSelectedTableNumber(tableNumber)
                    }
                  }
                  onDoubleClick={() => {
                    this.props.setActiveTable(this.props.table);
                  }}
                >
                  Sto {tableNumber} <br></br> {total} rsd
    
                </Button>


                )

              }
           
           }

        
          </TableConsumer>
         
        </Resizable>
      </Draggable>
    );
  }
}