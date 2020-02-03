import React, { useState } from 'react';
import {
    Col, Card, CardImg, CardDeck, Row, Container, ListGroup, ListGroupItem
  } from 'reactstrap';

export default function RightColumn(props) {
   
    const [itemName, setItemName] = useState('kafe')

    var req = require.context("../assets/images/", true, /\.(png|jpe?g|svg)$/);
   
    var images = []
    let folder
    const categories = { }

    req.keys().map(r => {
        folder = r.substring(2, r.lastIndexOf('/'))
        images.push(require("../assets/images/" + folder + r.substring(folder.length + 2)))
        
        if(categories[folder] !== undefined)
            categories[folder].push(require("../assets/images/" + folder + r.substring(folder.length + 2)))
        else
            categories[folder] = images

        images = []
    })

    var rowRender = []
    var imagesRender = []
    
    let k = 0
    let count = 0
    for(var a in categories) {
        if(a === itemName)
        for(var aa in categories[a]) {
            count ++
        }
           
    }

    var rows = count / 4 

    for (var i = 0; i < rows; i++) {
        for(var j = k; j < k + 4; j++) {
            if(k === 12)
            break
            imagesRender.push(
                <Card>
                    { categories[itemName][j] !== undefined && 
                        <CardImg top width="100%" src={categories[itemName][j]} alt="Card image cap" /> }
                </Card>
            )
        }
        rowRender.push(
            <Row>
                <CardDeck className="p-2">
                    { imagesRender }
                </CardDeck>
            </Row>         
        )
        k += 4
        imagesRender = [] 
    }
    
const style = {
    height : 'calc(100vh - 100px)',
    backgroundColor : 'transparent',
    borderRadius : '0',
    boxShadow : 'none'    
}

    return(
        <>
        <Col lg={8} md={8} style={style} className="p-0">
            <Container>
            <Row>
            <Col lg={3} style={{backgroundColor : 'transparent'}}>

                <ListGroup>
                    <ListGroupItem onClick={() => setItemName('kafe')} className="bg-dark text-white m-1">Kafe</ListGroupItem>
                    <ListGroupItem onClick={() => setItemName('cajevi')} className="bg-dark text-white m-1">Cajevi</ListGroupItem>
                </ListGroup>
            </Col>

            <Col lg={9} style={{backgroundColor : 'transparent'}}>
                <Container>
                    { rowRender }
                </Container>
            </Col>
            </Row>
            </Container>
        </Col>
        
     </>
    )
}