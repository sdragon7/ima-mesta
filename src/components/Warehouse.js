import React, { useState, useEffect } from 'react';
import { Input, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, Button, Table as TableBsr } from 'reactstrap'
import BottomScrollListener from 'react-bottom-scroll-listener'
import classnames from "classnames";

export default function Warehouse(props) {

    const [ categories, setCategories ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ activeTab, setActiveTab] = useState(1);
    const [ activeIngredientsList, setActiveIngredientsList] = useState([])
    const [ serverResponse, setServerResponse] = useState([])
    const style = {
        height : 'calc(100vh - 100px)',
        backgroundColor : 'transparent',
        borderRadius : '0',
        boxShadow : 'none'
    
    }
    useEffect(() => {
        fetch("http://localhost:8080/warehouse/categories")
        .then(res => res.json())
        .then(
          (result) => {
              console.log(result)
              if(Object.keys(result).length != 0) {
                setCategories(result);
                setLoading(false);
                setActiveIngredientsList(result[0].ingredients);
                setServerResponse(result);
                
              } 
              else
              {
                setLoading(true);
              }                              
        },
        (error) => {
            console.log('An error occured!')
        }
        )

        // fetch("http://localhost:8080/warehouse/ingredients")
        // .then(res => res.json())
        // .then(
        //   (result) => {
        //       if(Object.keys(result).length != 0) {
        //         setActiveIngredientsList(result);
        //         console.log('list of obj')
        //         console.log(result);
        //       } 
        //       else
        //       {
        //       }                              
        // },
        // (error) => {
        //     console.log('An error occured!')
        // }
        // )
    }, [])
    
    const updateIngredient = (i, qty) => {   
        let newArray = activeIngredientsList.map(ai => {
            if(ai.id !== i.id ) return ai ; else return {...ai, remainingQuantity : ai.remainingQuantity + qty} 
        });
        setActiveIngredientsList(newArray);

        i.remainingQuantity += qty;
        console.log(JSON.stringify(i))
        return fetch("http://localhost:8080/warehouse/ingredients/", {
            method: 'PUT',
            body: JSON.stringify(i),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res;
        }).catch(err => console.log(err));
    }

    return(
        <>
            {
                loading ? 
                    <h1> Content loading... </h1> 
                    : 
                    <>
                        <Col style={style} className="p-0">
                            <Nav pills style={{cursor : 'pointer'}} className="p-2" id="bill-pills">

                            {
                                categories.map(
                                (c, index) =>  {
                                    return (

                                        
                        
                                            <NavItem key = {index}>
                                                <NavLink key = {index}
                                                className={classnames({ active: activeTab === c.id })}
                                                onClick={() => { setActiveTab(c.id); setActiveIngredientsList(serverResponse.filter(cat => (cat.id === c.id)).ingredients); }}
                                                >
                                                { c.name }
                                                </NavLink>
                                            </NavItem>
                        
                        
                                            
                                                     
                                    )
                                }
                                )

                            }
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                {
                                categories.map(
                                    (category, index) => {
                                    return (
                                        <>
                                        <TabPane key={index}  tabId= {category.id } >
                                        <BottomScrollListener debounce = "0" onBottom = {() => {}}>
                                            { scrollRef => (
                                        <div  ref = {scrollRef} style = {{height :"500px" ,overflowY : "scroll"}}>
                                        

                                            <TableBsr striped >
                                            <thead>
                                                <tr>
                                                <th>Proizvod</th>
                                                {/* <th>Cena</th> */}
                                                <th>Jedinica</th>

                                                <th>Kolicina</th>

                                                <th>Dodaj</th>
                                                <th>Otpis</th>
                                            
                                                </tr>
                                            </thead>
                                        
                                            <tbody>
                                                {
                                                (activeIngredientsList == undefined ? [] : activeIngredientsList).map((i, index) => {
                                                return (
                                                    <tr key={index}>
                                                    
                                                    <td>{i.name}</td>
                                                    <td>{i.unit}</td>
                                                    <td>{i.remainingQuantity}</td>
                                                    <td>
                                                        <Input value = {}></Input>
                                                        <Button color = "success" onClick = {() => {updateIngredient(i,10)}}>+</Button>
                                                    </td>
                                                    <td>
                                                        <Input value = {}></Input>
                                                        <Button color = "danger" onClick = {() => {updateIngredient(i,-10)}}>+</Button>
                                                    </td>
                                                    </tr>
                                                );
                                                })}
                                            
                                            </tbody>
                                            </TableBsr>

                                        
                                            
                                    </div>

                                            )}
                                    </BottomScrollListener>
                                
                                </TabPane>
                                
                                </>
                                    )

                                    }

                                )
                                    
                                }     
                                </TabContent>

                        </Col>
                    </>
            
            }    
        </>
    )


}