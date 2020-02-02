import React, { Component } from 'react';
import Table from  './Table';
import Table2 from  './Table2';
import LeftColumn from  './LeftColumn';
import RightColumn from  './RightColumn';
import { Button, Container, Row } from 'reactstrap';
import Sidebar from './Sidebar'
import { TableProvider, TableConsumer } from './TableContext.js'


export default class TableContainer extends Component {
    constructor(props) {
      super(props); 

      this.state = {
        tables:[],
        selectedTableId : -1,
        showTables : true,
        table : null
      };

    }



    // deleteTable = () => {
    //   const {selectedTableId} = this.state
    //   if(selectedTableId < 0) return;
    //   const {tables} = this.state;
    //   this.setState({ selectedTableId : -1, tables : tables.filter(table => (table.id !== selectedTableId))});
    // }

    setSelectedId = (childData) => {
      this.setState({selectedTableId: childData})
      
    }

    setActiveTable = (table) => {
        this.setState({ table, showTables : false }, () => console.log(table))
    }

    showTableView =() => {
        this.setState({showTables : true})
    }

    render () {
        const {showTables} = this.state;
        return (
          <>
          <Sidebar />
          <TableConsumer>
                {
                    context => {
                      let returnTables = []
                        if(showTables) {
                            context.tables.map(table => {
                              returnTables.push(<div key = {table.id}>
                                <Table2 
                                  table = {table} 
                                  setActiveTable = {this.setActiveTable}
                                  ></Table2>
                              </div>)
                          })
                          return returnTables;
                        }
                    
                        else return (
                          <Container fluid>
                          <Row>
                            <LeftColumn table = {this.state.table} showTableView = {this.showTableView}></LeftColumn>
                            <RightColumn></RightColumn>
                          </Row>
                        </Container>
                        )
                    }
                }
            </TableConsumer>
          </>
        )
    }
}

