import React, { Component } from 'react';
import { Col, Card } from 'reactstrap'

export default function RightColumn(props) {
    
const style = {
    height : 'calc(100vh - 100px)',
    backgroundColor : 'lightgreen',
    borderRadius : '0',
    boxShadow : 'none'    
}

    return(
        <Col lg={8} md={8} className="p-0">
            <Card style={style}>

            </Card>
        </Col>
    )
}