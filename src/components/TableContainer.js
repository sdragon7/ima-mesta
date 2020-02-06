import React, { Component } from 'react';
import Table2 from  './Table2';
import LeftColumn from  './LeftColumn';
import RightColumn from  './RightColumn';
import {  Container, Row } from 'reactstrap';
import Sidebar from './Sidebar'
import {  TableConsumer } from './TableContext.js'


export default class TableContainer extends Component {
    constructor(props) {
      super(props); 

      this.state = {
        tables:[],
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
          <Sidebar showTables = {showTables} setActiveTable = {this.setActiveTable} />
          <TableConsumer>
                {
                    context => {
                      let returnTables = []
                        if(showTables) {
                            context.floors.filter(floor => (floor.floorName === context.currentFloorName))[0].tables.map((table, index) => {
                              returnTables.push(<div key = {table.id}>
                                <Table2 
                                  key = {context.currentFloorName + index }
                                  table = {table} 
                                  setActiveTable = {this.setActiveTable}
                                  updateCoordinatesOfSelectedTable = {context.updateCoordinatesOfSelectedTable}
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

