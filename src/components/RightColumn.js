import React, { useState, useEffect, useContext } from 'react';
import {
    Col, Card, CardImg, CardDeck, CardColumns, Row, Container, ListGroup, ListGroupItem, Button
  } from 'reactstrap';
 
import { TableContext } from "./TableContext.js"

export default function RightColumn(props) {

    const context = useContext(TableContext);
   
    const [productCategories, setProductCategories] = useState({
        list : [],
        activeProductCategory : {},
        activeProductCategoryItem : {},
        isLoading : true
    })

    var rowRender = []
    let products = []

    if(!productCategories.isLoading) {
        console.log(productCategories)
        productCategories.list.map(category => {
            if(category.name === productCategories.activeProductCategory.name)
                category.items.map(item => {
                    if(item.name === productCategories.activeProductCategoryItem.name) {
                        item.items.map(aa => {
                            products.push(aa)
                        })
                    }
                })
        })
    
            rowRender.push(
                // <Row> card columns ne sme biti u row jer se zakenja :D
                    <CardColumns id="right-column" className="p-2">
                        { 
                            products.map((p, index) => {
                                return (
                                    <Card style={{boxShadow : '0 10px 6px -4px black'}}>
                                        <CardImg top width="100%" src={"data:image/jpeg;base64," + p.image} alt="Card image cap" /> 
                                        <Button onClick={ () => context.addProductToActiveTab(p, context.activeTable) } >{ p.name } { p.price }</Button>
                                    </Card>
                                )
                            })
                        }
                    </CardColumns>
                // </Row>         
            )
    }

    useEffect(() => {
        fetch("http://localhost:8080/test")
        .then(res => res.json())
        .then(
          (result) => {
              if(Object.keys(result).length != 0) {
                setProductCategories(prev => {
                    return {
                        ...prev,
                        list : result,
                        activeProductCategory : result[0],
                        activeProductCategoryItem : result[0].items[0],
                        isLoading : false 
                    }
                })
              } else 
              setProductCategories(prev => {
                  return {
                      ...prev,
                      isLoading : true
                  }
            })
                
          },
          (error) => {

          }
        )
    }, [])
    
    const style = {
        maxHeight : 'calc(100vh - 100px)',
        height : 'calc(100vh - 100px)',
        overflowY : 'scroll',
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
            !productCategories.isLoading && 
            <Col lg={8} md={8} style={style} className="p-0">
            <Container>
                <Row>
                {
                    productCategories.list.map((item, index) => {
                        return <Col><Button id="select-btn" style={{width : '100%', backgroundColor : 'steelblue'}} className="mt-2 mb-5" onClick={() => { 
                            setProductCategories(
                                prev => { 
                                    return {...prev, activeProductCategory : item, activeProductCategoryItem : item.items[0] }
                                }
                            )
                        }} >{item.name}</Button></Col>
                    })
                }
                </Row>
                <Row>
                    <Col lg={3} style={{backgroundColor : 'transparent'}}>

                        <ListGroup>
                            {
                                productCategories.list.map((category, index) => {
                                    if(category.name === productCategories.activeProductCategory.name)
                                        return category.items.map((productItem, index) => {
                                                return <ListGroupItem key={index} 
                                                    onClick={() => {
                                                        setProductCategories(
                                                            prev => {
                                                                return {...prev, activeProductCategoryItem : productItem }
                                                            }
                                                        )
                                                    }} id="select-btn" style={{ backgroundColor : 'steelblue' }} className="m-2">{ productItem.name }</ListGroupItem>
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