import React from 'react';

const TableContext = React.createContext();

export class TableProvider extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            loggedInUser : {
                token : "",
                username : "whatever"
            },
            tables : [],
            addTable: this.addTable,
            deleteTable : this.deleteTable,
            setSelectedTableNumber : (selectedTableNumber) => {
                this.setState({selectedTableNumber})
            },
            selectedTableNumber : -1
            ,
            updateCoordinatesOfSelectedTable : this.updateCoordinatesOfSelectedTable
            ,
            temporaryTable :       { 
                orders : [{
              
                }], 
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
                }
        }
    }



   


    addTable = () => {
        const { tables } = this.state
        if(tables.length === 0) {
          this.setState({ tables: [{ 
            orders : [{
                checked: true,
                product : { id : 1, name : 'Pivo', price : 120},
                quantity : 30,
                myTab : "1"
            },
            {
                checked: true,
                product : { id : 2, name : 'Sok', price : 120},
                quantity : 15,
                myTab : "1"
            }
            
            ], 
            total : 3600,
            isDraggable : true,
            activeTab: "1",    
            numberOfTabs : 2,
            tabsToRender : [{tabNumber : "1"}],
            tableNumber: 1, //visak
            tableColor: "danger",
            controlledPosition    : {
                x : 25,
                y : 25
            }

            }]})
        }
        else {
          let maxVal = Math.max.apply(Math, tables.map(function(obj) { return obj.tableNumber; }));
          maxVal++;
          const newTables = [...tables, {
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
                
          } ]
          this.setState({tables: newTables})
        }
      }

    deleteTable = () => {

        const {selectedTableNumber} = this.state;
        if(selectedTableNumber < 0) return;
        const { tables } = this.state;
        this.setState(
            {
                tables : tables.filter(t => (t.tableNumber !== selectedTableNumber))
            }
        )
    }


    updateCoordinatesOfSelectedTable = (controlledPosition, tableNumber) => {
        const {selectedTableNumber, tables } = this.state;
   
        this.setState(
            {
                tables : 
                    tables.map(
                        t => (t.tableNumber !== tableNumber) ?
                            t
                            :
                           {...t, controlledPosition : controlledPosition}
                    )
            
            }
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