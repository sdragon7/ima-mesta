import React, { useState, useEffect } from 'react';
import { Alert, Input, Row, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, Button, ListGroup, ListGroupItem, Table as TableBsr } from 'reactstrap'
import BottomScrollListener from 'react-bottom-scroll-listener'
import classnames from "classnames";
import { getAllByPlaceholderText } from '@testing-library/react';

export default function Warehouse(props) {

    const [ categories, setCategories ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ activeTab, setActiveTab] = useState(1);
    const [ activeIngredientsList, setActiveIngredientsList] = useState([])
    const [ serverResponse, setServerResponse] = useState([])
    const [ activeIncFields, setActiveIncFields] = useState([]);
    const [ activeDecFields, setActiveDecFields] = useState([]);
    const [ changeNotifiers, setChangeNotifiers] = useState([]);

    
    const style = {
        height : 'calc(100vh - 100px)',
        backgroundColor : 'transparent',
        borderRadius : '0',
        boxShadow : 'none'
    
    }
    useEffect(() => {
        //console.log("EVO GA")
        //console.log(activeIngredientsList)
    }, [activeIngredientsList])

    useEffect(() => {
        fetch("http://localhost:8080/warehouse/categories")
        .then(res => res.json())
        .then(
          (result) => {
              if(Object.keys(result).length != 0) {
                setCategories(result);
                setLoading(false);
                const ingredients = result[0].ingredients
                setActiveIngredientsList(ingredients);
                setServerResponse(result);
                
                setFields(ingredients.length);
          

                console.log(result[0].ingredients)
                
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

    const setFields = (len) => {
        let initArray1 = [];
        let initArray2 = [];

        for(var i = 0; i < len; i++) {
            initArray1.push(0);
            initArray2.push(0);

        }
        setActiveIncFields(initArray1);
        setActiveDecFields(initArray2);
    }

    const handleIncChange = (myIndex, val) => {
        let myArray = activeIncFields;
        myArray[myIndex] = val;
        setActiveIncFields(myArray);
    }
    const handleDecChange = (myIndex, val) => {
        let myArray = activeDecFields;
        myArray[myIndex] = val;
        setActiveDecFields(myArray)
    }
    
    const updateIngredient = (i, qty) => { 
        if(qty == 0) return;  
        let newArray = activeIngredientsList.map(ai => {
            if(ai.id !== i.id ) return ai ; else return {...ai, remainingQuantity : ai.remainingQuantity + Number(qty)} 
        });
        setActiveIngredientsList(newArray);

        i.remainingQuantity += Number(qty);
        console.log(JSON.stringify(i))
        return fetch("http://localhost:8080/warehouse/ingredients/", {
            method: 'PUT',
            body: JSON.stringify(i),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(qty > 0 )
                setChangeNotifiers([...changeNotifiers, {msg : `Kolicina proizvoda \"${i.name}"\ je uvecana  za ${qty} ${i.unit}`, color : "primary", date : new Date()}]);
            else    
                setChangeNotifiers([...changeNotifiers, {msg : `Kolicina proizvoda \"${i.name}"\ je umanjena  za ${Math.abs(qty)} ${i.unit}`, color : "danger", date : new Date()}]);

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
                    <Nav pills style={{cursor : 'pointer'}} className="p-2" id="bill-pills">
                        {/* <NavItem >
                            <NavLink 
                                className={classnames({ active: activeTab === 0 })}
                                onClick={() => { 
                                    setActiveTab(0); 
                                    let ingredients = [];
                                    serverResponse.map(ca => ingredients.push(ca.ingredients))
                                    setActiveIngredientsList(ingredients);
                                   
                                    setFields(ingredients.length)
                                                
                                }}
                            >
                                Svi
                            </NavLink>
                        </NavItem> */}

                        {
                            categories.map(
                            (c, index) =>  {
                                return (

                                    

                                        <NavItem key = {index}>
                                            <NavLink key = {index}
                                            className={classnames({ active: activeTab === c.id })}
                                            onClick={() => { 
                                                        setActiveTab(c.id); 
                                                        const ingredients = serverResponse.filter(ca => (ca.id === c.id ))[0].ingredients;
                                                        setActiveIngredientsList(ingredients);
                                                        setFields(ingredients.length)

                                                
                                                    }}
                                            >
                                            { c.name }
                                            </NavLink>
                                        </NavItem>


                                        
                                                
                                )
                            }
                            )

                        }
                        </Nav>
                        <Row>
                               
                            <Col style={style} lg = "8" md = "8" sm ="8">
                             
                                <TabContent activeTab={activeTab}>
                                    {
                                    categories.map(
                                        (category, index) => {
                                        return (
                                            <>
                                            <TabPane key={index}  tabId = { category.id } >
                                            <BottomScrollListener debounce = "0" onBottom = {() => {}}>
                                                { scrollRef => (
                                            <div  ref = {scrollRef} style = {{height :"500px" ,overflowY : "scroll"}}>
                                            

                                                <TableBsr striped size ="sm" >
                                                <thead>
                                                    <tr>
                                                    <th>Proizvod</th>
                                                    {/* <th>Cena</th> */}
                                                    <th>Jedinica</th>

                                                    <th>Kolicina</th>

                                                    <th >Dodaj</th>
                                                    <th></th>
                                                    <th>Otpis</th>
                                                    <th></th>

                                                    </tr>
                                                </thead>
                                            
                                                <tbody>
                                                    {
                                                    (activeIngredientsList == undefined ? [] : activeIngredientsList).map((i, index) => {
                                                    const myIndex = activeIngredientsList.indexOf(i);
                                                    return (
                                                        <tr key={index}>
                                                        
                                                        <td>{i.name}</td>
                                                        <td>{i.unit}</td>
                                                        <td>{i.remainingQuantity}</td>
                                                        <td>
                                                            <Input  defaultValue = {0} size = "sm" onChange = {(e) => {handleIncChange(myIndex, e.target.value)}} ></Input>
                                                        </td>
                                                        <td>
                                                            <Button  size = "sm" color = "success" onClick = {() => {updateIngredient(i, activeIncFields[myIndex])}}>+</Button>

                                                        </td>
                                                        <td>
                                                            <Input defaultValue = {0} size = "sm" onChange = {(e) => {handleDecChange(myIndex, e.target.value)}}></Input>
                                                        </td>
                                                        <td>
                                                            <Button size = "sm" color = "danger" onClick = {() => {updateIngredient(i, -activeDecFields[myIndex])}}>-</Button>

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
                            <Col style={style} lg = "4" md = "4" sm ="4">
                                <ListGroup>
                                    {
                                        changeNotifiers.map((cn, index) => {
                                            const currentDate = new Date();
                                            return(
                                                    <Alert color={cn.color}>
                                                        <p>{cn.msg}</p>
                                                        <p>{cn.date.getHours() + ":" +cn.date.getMinutes()}</p> 
                                                    </Alert>
                                                   

                                            )
       

                                        })
                                    }
                               
                                </ListGroup>

                            </Col>
                        </Row>
                    </>
            
            }    
        </>
    )


}