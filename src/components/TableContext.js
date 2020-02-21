import React from 'react';
import SERVER from '../server-host'

export const TableContext = React.createContext();

export class TableProvider extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            loggedInUser : {
                token : "",
                username : "whatever"
            },
            activeTable : null,
            showTables : true,
            totalSelected : 0,
            setTotalSelected : (price) => {
                this.setState({ totalSelected : price })
            },
            setTotal : (price) => {
                let activeTable = this.state.activeTable
                activeTable.total = activeTable.total + price
                this.setState({ activeTable : activeTable })
            },
            checkPlease : () => {
                let activeTable = this.state.activeTable
                // var orders = [...this.state.activeTable.orders]
                // let totalPrice = 0
                // let newOrders = activeTable.orders.filter(
                //     (order => (!( order.checked && order.myTab === this.state.activeTable.activeTab ))))

                //newOrders.map(order => {  totalPrice += order.product.price * order.quantity })

                //fetch...
                let selectedOrders = activeTable.orders.filter(
                    (order => ( order.checked && order.myTab + "" === this.state.activeTable.activeTab + "" )))

                    console.log(selectedOrders)

                fetch(SERVER + "/table/orders/pay", {
                    method: 'POST',
                    body: JSON.stringify({ tableNumber : activeTable.tableNumber, orders : selectedOrders }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res1 => res1.json())
                .then(res1 => {
                    this.setState({activeTable: res1})
                
                }).catch(err => console.log(err));
                    

                // let activeTable = this.state.activeTable
                // activeTable.orders = newOrders
                // if(totalPrice === 0) {
                //     activeTable.tableColor = "success"
                //     activeTable.tabsToRender = [{ tabNumber : "1" }, { tabNumber : "2" }]
                // }
                // activeTable.isDraggable = true
                // activeTable.total = totalPrice
                // activeTable.activeTab = "1"
                // let tabsToRender = [...activeTable.tabsToRender]
                // tabsToRender.map((tab, index) => { activeTable.tabsToRender.push({tabNumber : index + ""}) })
                // activeTable.tabsToRender = tabsToRender
                // this.setState({ activeTable : activeTable, showTables : true})
                

            },
            setActiveTable : (table) => {
                this.setState({ activeTable : table, showTables : false, activeOrders : table.orders })
            },
            setShowTableView : () => {
                this.setState({ showTables : !this.state.showTables })
            },
            currentFloorName : "Prizemlje",
            floors : [],
            addTable: this.addTable,
            deleteTable : this.deleteTable,
            updateTable : this.updateTable,
            setCurrentFloorName : this.setCurrentFloorName,
            setSelectedTableNumber : (selectedTableNumber) => {
                this.setState({selectedTableNumber})
            },
            selectedTableNumber : -1
            ,
            updateCoordinatesOfSelectedTable : this.updateCoordinatesOfSelectedTable
            ,
            temporaryTable :       { 
                orders : [], 
                total : 0,
                isDraggable : true,
                activeTab: "1",    
                numberOfTabs : 2,
                tabsToRender : [{tabNumber : "1"}],
                tableNumber: 10000,
                tableColor: "danger",
                controlledPosition    : {
                    x : 0,
                    y : 0
                }       
            },
            addProductToActiveTab : (p) => {
                let activeTable = this.state.activeTable

                // const res = activeTable.orders.filter(order => (
                //     (order.product.name === p.name) && (order.myTab === activeTable.activeTab)));

                fetch(SERVER + "/table/add/order", {
                    method: 'PUT',
                    body: JSON.stringify({ tableNumber : activeTable.tableNumber, orders : [{
                        checked: true,
                        product : { id : p.id, name : p.name, price : p.price},
                        quantity : 1,
                        myTab : activeTable.activeTab
                    }] }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res1 => res1.json())
                .then(res1 => {
                    console.log(res1)
                    // if(res.length === 0) {
                    //     //add order on server
                    //     activeTable.orders.push({
                    //         checked: true,
                    //         product : { id : p.id, name : p.name, price : p.price},
                    //         quantity : 1,
                    //         myTab : activeTable.activeTab
                    //     })
                    // } else {
                    //     //update qu on server
                    //     res[0].quantity = res[0].quantity + 1;
                    // }

                    // activeTable.total = activeTable.total + p.price
                
                    // , totalSelected: this.state.totalSelected + p.price
                    this.setState({activeTable: res1, totalSelected : this.state.totalSelected + p.price})
              
                }).catch(err => console.log(err));
            }
            ,
            setTableActiveTab : (table, activeTab) => {
                table.activeTab = activeTab;
                this.setState({ activeTable : table })
            },
            setTableOrders : (order) => {
                var orders = [...this.state.activeTable.orders]

                let newActiveTable = this.state.activeTable
                newActiveTable.orders =  orders.map(o => {
                if(order.product.id !== o.product.id || order.myTab + "" !== o.myTab + "") return o;
                else return { ...order, checked : !order.checked }
                
                })

                this.setState(prev => ({ activeTable : newActiveTable, totalSelected : this.state.totalSelected - order.product.price * order.quantity })) 
            },
            increaseQuantity : (o) => {
                let activeTable = this.state.activeTable

                fetch(SERVER + "/table/increase/order", {
                    method: 'PUT',
                    body: JSON.stringify({ tableNumber : activeTable.tableNumber, orders : [o] }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res1 => res1.json())
                .then(res1 => {
                    this.setState({activeTable: res1})
              
                }).catch(err => console.log(err));
            },
            decreaseQuantity : (o) => {
                let activeTable = this.state.activeTable

                fetch(SERVER + "/table/decrease/order", {
                    method: 'PUT',
                    body: JSON.stringify({ tableNumber : activeTable.tableNumber, orders : [o] }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res1 => res1.json())
                .then(res1 => {
                    this.setState({activeTable: res1})
              
                }).catch(err => console.log(err));
            },
            addNewTab : () => {
                let activeTable = this.state.activeTable

                fetch(SERVER + "/table/add/tab", {
                    method: 'PUT',
                    body: JSON.stringify({ tableNumber : activeTable.tableNumber }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res1 => res1.json())
                .then(res1 => {
                    this.setState({activeTable: res1})
              
                }).catch(err => console.log(err));
            }
        }
    }

    componentDidMount() {
        fetch(SERVER + "/floor/list")
        .then(res => res.json())
        .then(
          (result) => {
              console.log(result)
              this.setState({ floors : result })
               
          },
          (error) => {
            alert()
          }
        )
    }


    setCurrentFloorName = (val) => {
        this.setState(
            {
            currentFloorName : val  
         }       
        )
    }


    getTablesOnCurrentFloor = () => {
        const {floors, currentFloorName} = this.state;
        const newArray = floors.filter(floor => floor.floorName === currentFloorName);
        if(newArray.length === 0) return [];
        else return newArray[0].tables;
    }

    addTable = () => {
        let tables = this.getTablesOnCurrentFloor();
        const {floors, currentFloorName} = this.state;

        if(tables.length === 0) {
            tables = []
            tables.push({ 
            orders : [
            //     {
            //     checked: true,
            //     product : { id : 1111, name : 'Pivo', price : 120},
            //     quantity : 30,
            //     myTab : "1"
            // },
            // {
            //     checked: true,
            //     product : { id : 2222, name : 'Sok', price : 120},
            //     quantity : 15,
            //     myTab : "1"
            // },
            // {
            //     checked: true,
            //     product : { id : 3333, name : 'whatever', price : 100},
            //     quantity : 17,
            //     myTab : "2"
            // }
            
            ], 
            total : 0,
            isDraggable : true,
            activeTab: "1",    
            numberOfTabs : 3,
            tabsToRender : [{tabNumber : "1"}, { tabNumber : "2"}],
            tableNumber: 1, //visak
            tableColor: "danger",
            controlledPosition    : {
                x : 25,
                y : 25
            }

            })
        }
        else {
          let maxVal = Math.max.apply(Math, tables.map(function(obj) { return obj.tableNumber; }));
          maxVal++;
          tables.push({
            orders : [], 
            total : 0,
            isDraggable : true,
            activeTab: "1",    
            numberOfTabs : 2,
            tabsToRender : [{tabNumber : "1"}],
            tableNumber: maxVal, //visak
            tableColor: "success",
            controlledPosition    : {
                x : 25 * maxVal,
                y : 25* maxVal
            }
                
            })
        }

        const  newFloorArray = floors.map( floor => {
            if(floor.floorName !== currentFloorName) return floor;
            else {
                return {...floor, tables : tables};
            }
        })
        this.setState({ floors : newFloorArray })
      }

    deleteTable = () => {
        const {floors, currentFloorName} = this.state;

        const {selectedTableNumber} = this.state;
        if(selectedTableNumber < 0) return;
        const tables  = this.getTablesOnCurrentFloor().filter(t => (t.tableNumber !== selectedTableNumber));

        const  newFloorArray = floors.map( floor => {
            if(floor.floorName !== currentFloorName) return floor;
            else {
                return {...floor, tables : tables};
            }
        })
        this.setState(
            {
                floors : newFloorArray
            }
        )
    }

    updateTable = (myTable) => {
        const {floors, currentFloorName} = this.state;

        let tables = this.getTablesOnCurrentFloor().map(t => {
            if(t.tableNumber !== myTable.tableNumber) return t;
            else return myTable;
        });

       const  newFloorArray = floors.map( floor => {
            if(floor.floorName !== currentFloorName) return floor;
            else {
                return {...floor, tables : tables};
            }
        })
        this.setState(
            {
                floors : newFloorArray
            }
        )
    }

    updateCoordinatesOfSelectedTable = (controlledPosition, tableNumber) => {
        const {floors, currentFloorName} = this.state;
        const tables  = this.getTablesOnCurrentFloor().map(
            t => (t.tableNumber !== tableNumber) ?
                t
                :
               {...t, controlledPosition : controlledPosition}
        );

        const  newFloorArray = floors.map( floor => {
            if(floor.floorName !== currentFloorName) return floor;
            else {
                return {...floor, tables : tables};
            }
        })
        this.setState({ floors : newFloorArray })
    }

    render() {
        return (
            <TableContext.Provider value={ this.state }>
                { this.props.children }
            </TableContext.Provider>
        )
    }    
}

export const TableConsumer = TableContext.Consumer