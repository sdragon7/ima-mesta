import React from 'react';

export const TableContext = React.createContext();

const PRVI_SPRAT  = "prvi";
const DRUGI_SPRAT = "drugi"

export class TableProvider extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            fake : false,
            loggedInUser : {
                token : "",
                username : "whatever"
            },
            currentFloorName : PRVI_SPRAT,
            floorNames : [
                PRVI_SPRAT,
                DRUGI_SPRAT
            ],
            floors : [
                {
                    tables : [],
                    floorName : PRVI_SPRAT
                },
                {
                    tables : [],
                    floorName : DRUGI_SPRAT
                }
            
            ],
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
            addProductToActiveTab : (p, table) => {

                table.orders.push({
                    checked: true,
                    product : { id : p.id, name : p.name, price : p.price},
                    quantity : 1,
                    myTab : table.activeTab
                })
                console.log(table.orders)
                this.setState({fake : true})
            }
            ,
            setTableActiveTab : (table, activeTab) => {
                table.activeTab = activeTab;
            }
        }
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
            orders : [{
                checked: true,
                product : { id : 1111, name : 'Pivo', price : 120},
                quantity : 30,
                myTab : "1"
            },
            {
                checked: true,
                product : { id : 2222, name : 'Sok', price : 120},
                quantity : 15,
                myTab : "1"
            },
            {
                checked: true,
                product : { id : 3333, name : 'whatever', price : 100},
                quantity : 17,
                myTab : "2"
            }
            
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
        this.setState({
            floors : newFloorArray
        } ,
            () => {console.log(this.state)}       
        )
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
        console.log(currentFloorName)

        const {selectedTableNumber } = this.state;

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
        this.setState({
            floors : newFloorArray
        } ,
            () => {console.log(this.state)}       
        )

     

   

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