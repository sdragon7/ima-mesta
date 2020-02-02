import React from 'react';

const TableContext = React.createContext();

export class TableProvider extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            tables : [],
            addTable: () => {
                const { tables } = this.state
                if(tables.length === 0) {
                  this.setState({ tables: [{ 
                    id : 1, 
                    orders : [{
                        product : { id : 1, name : 'Pivo', price : 120},
                        quantity : 30,
                        myTab : "1"
                    }], 
                    total : 3600,
                    isDraggable : true,
                    activeTab: "1",    
                    numberOfTabs : 2,
                    tabsToRender : [{tabNumber : "1"}],
                    tableNumber: 1, //visak
                    tableColor: "danger"                
                    }]})
                }
                else {
                  let maxVal = Math.max.apply(Math, tables.map(function(obj) { return obj.id; }));
                  maxVal++;
                  const newTables = [...tables, {
                    id : maxVal, 
                    orders : [], 
                    total : 0,
                    isDraggable : true,
                    activeTab: "1",    
                    numberOfTabs : 2,
                    tabsToRender : [{tabNumber : "1"}],
                    tableNumber: maxVal, //visak
                    tableColor: "danger"                
                  } ]
                  this.setState({tables: newTables})
                }
              }
        
        }
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