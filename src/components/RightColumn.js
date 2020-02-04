import React, { useState, useEffect } from 'react';
import {
    Col, Card, CardImg, CardDeck, CardColumns, Row, Container, ListGroup, ListGroupItem, Button
  } from 'reactstrap';

export default function RightColumn(props) {
   
    const [productCategories, setProductCategories] = useState([])
    const [isLoading, setIsloading] = useState(true)
    const [activeProductCategory, setActiveProductCategory] = useState({})
    const [activeProductCategoryItem, setActiveProductCategoryItem] = useState({})

    var req = require.context("../assets/images/", true, /\.(png|jpe?g|svg)$/);
   
    var images = []
    var folders = []
    let folder
    const categories = { }

    req.keys().map(r => {
        folder = r.substring(2, r.lastIndexOf('/'))
        images.push(require("../assets/images/" + folder + r.substring(folder.length + 2)))
        
        if(categories[folder] !== undefined)
            categories[folder].push(require("../assets/images/" + folder + r.substring(folder.length + 2)))
        else {
            folders.push(folder)
            categories[folder] = images
        }

        images = []
    })

    var rowRender = []
    let products = []

    if(!isLoading) {
        productCategories.map(category => {
            if(category.name === activeProductCategory.name)
                category.items.map(item => {
                    if(item.name === activeProductCategoryItem.name) {
                        item.items.map(aa => {
                            products.push(aa)
                        })
                    }
                })
        })
    
            rowRender.push(
                <Row>
                    <CardColumns id="right-column" className="p-2">
                        { 
                            products.map((p, index) => {
                                return (
                                    <Card style={{boxShadow : '0 10px 6px -4px black'}}>
                                        <CardImg top width="100%" src="https://image.shutterstock.com/image-photo/beautiful-water-drop-on-dandelion-260nw-789676552.jpg" alt="Card image cap" /> 
                                        <Button>{ p.name }</Button>
                                    </Card>
                                )
                            })
                        }
                    </CardColumns>
                </Row>         
            )
    }
 

    useEffect(() => {
        fetch("http://localhost:8080/test")
        .then(res => res.json())
        .then(
          (result) => {
                setProductCategories(result)
                setIsloading(false)
                setActiveProductCategory(result[0])
                setActiveProductCategoryItem(result[0].items[0])
          },
          (error) => {
           
          }
        )
    }, [])
    
    const style = {
        height : 'calc(100vh - 100px)',
        backgroundColor : 'transparent',
        borderRadius : '0',
        boxShadow : 'none',
        backgroundImage : 'linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(117, 19, 93, 0.73)), url(https://images.pexels.com/photos/239975/pexels-photo-239975.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
        backgroundSize : 'cover',
        backgroundRepeat : 'no-repeat',
    }

    return(
        <>
        {
            !isLoading && 
            <Col lg={8} md={8} style={style} className="p-0">
            <Container>
                {
                    productCategories.map((item, index) => {
                        return <Button color="primary" onClick={() => { setActiveProductCategory(item); setActiveProductCategoryItem(item.items[0]) }} >{item.name}</Button>
                    })
                }
                <Row>
                    <Col lg={3} style={{backgroundColor : 'transparent'}}>

                        <ListGroup>
                            {
                                productCategories.map((category, index) => {
                                    if(category.name === activeProductCategory.name)
                                        return category.items.map((productItem, index) => {
                                                return <ListGroupItem key={index} onClick={() => setActiveProductCategoryItem(productItem)} className="bg-dark text-white m-1">{ productItem.name }</ListGroupItem>
                                            }) 
                                })
                            }
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
        }
     </>
    )
}