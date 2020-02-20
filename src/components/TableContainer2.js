import React, { useContext } from 'react';
import Table2 from  './Table2';
import LeftColumn2 from  './LeftColumn2';
import RightColumn from  './RightColumn';
import {  Container, Row } from 'reactstrap';
import Sidebar from './Sidebar'
import { TableContext } from "./TableContext.js"

export default function TableContainer(props) {

    const context = useContext(TableContext);
    let returnTables = []

    if(context.showTables) {
      if(context.floors.length > 0) {
          context.floors.filter(floor => (floor.floorName === context.currentFloorName))[0].tables.map((table, index) => {
            returnTables.push(<div key = {table.id}>
              <Table2 
                key = {context.currentFloorName + index }
                table = {table} 
                setActiveTable = {context.setActiveTable}
                updateCoordinatesOfSelectedTable = {context.updateCoordinatesOfSelectedTable}
                addProductToActiveTab = {context.addProductToActiveTab}
                />
            </div>)
        })
      }
      return (
        <>
        <Sidebar />
        { returnTables }
        </>)
    } else {
      return (
        <>
        <Sidebar />
        <Container fluid>
          <Row>
            <LeftColumn2></LeftColumn2>
            <RightColumn></RightColumn>
          </Row>
        </Container>
        </>
      )
    }
}