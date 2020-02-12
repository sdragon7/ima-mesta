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
    const [ checkboxArray, setCheckboxArray ] = useState([]);

    
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
        console.log(checkboxArray)
    }, [checkboxArray])

    useEffect(() => {
        fetchCategories(true);

    }, [])
    

    const fetchCategories = (initCall) => {
        fetch("http://localhost:8080/warehouse/categories")
        .then(res => res.json())
        .then(
          (result) => {
              if(Object.keys(result).length != 0) {
                setCategories(result);
                setLoading(false);
               
                setServerResponse(result);             
                if(initCall) { 
                    const ingredients = result[0].ingredients
                    setActiveIngredientsList(ingredients);
                    setFields(ingredients.length);            
                }
                else {
                    const ingredients = result.filter(cat => (cat.id === activeTab))[0].ingredients
                    setActiveIngredientsList(ingredients);
                }
                //console.log(result[0].ingredients)
                
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
    }

    const updateAllChecked = (pos) => {

        let arr = [];
        for(var i =0; i < checkboxArray.length; i++)
            if(checkboxArray[i]) {
                arr.push({...activeIngredientsList[i], lastQuantityUpdate :  (pos ? Number(activeIncFields[i])  : -Number(activeDecFields[i]) )})
            }
   

        fetch("http://localhost:8080/warehouse/ingredients/", {
            method: 'PUT',
            body: JSON.stringify(arr),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            createNotifier(arr);
            fetchCategories(false);
      
        }).catch(err => console.log(err));
        
        
        
    }

    const setFields = (len) => {
        let initArray1 = [];
        let initArray2 = [];
        let styleArr= [];
  
        for(var i = 0; i < len; i++) {
            styleArr.push(false);
            initArray1.push(0);
            initArray2.push(0);
        }
        setCheckboxArray(styleArr);
        setActiveIncFields(initArray1);
        setActiveDecFields(initArray2);
    }

    const handleIncChange = (myIndex, val) => {
        let myArray = activeIncFields.slice(); // ovo ne menja originalni array
        myArray[myIndex] = val;
        setActiveIncFields(myArray);
    }
    const handleDecChange = (myIndex, val) => {
        let myArray = activeDecFields.slice();
        myArray[myIndex] = val;
        setActiveDecFields(myArray)
    }

    const checkboxChange = (myIndex) => {
        let myArray = checkboxArray.slice();
        myArray[myIndex] = !myArray[myIndex];
        setCheckboxArray(myArray)
    }

    const createNotifier = (itemList) => {

        let arrayOfMsgs = []
        itemList.map(i => {
           

            const qty = i.lastQuantityUpdate
            // if( qty > 0 ) arrayOfMsgs.push({ msg : `Kolicina proizvoda \"${i.name}"\ je uvecana  za ${qty} ${i.unit}`, ingredient : {id : i.id}, quantity : qty})
            // else arrayOfMsgs.push({msg : `Kolicina proizvoda \"${i.name}"\ je umanjena  za ${Math.abs(qty)} ${i.unit}`, ingredient : {id : i.id}, quantity : qty})    
            if( qty > 0 ) arrayOfMsgs.push({ msg : `Kolicina proizvoda \"${i.name}"\ je uvecana  za ${qty} ${i.unit}`, id : i.id, quantity : qty})
            else arrayOfMsgs.push({msg : `Kolicina proizvoda \"${i.name}"\ je umanjena  za ${Math.abs(qty)} ${i.unit}`, id : i.id, quantity : qty})    

        })
        console.log('array of msgs')
        console.log(arrayOfMsgs)
        setChangeNotifiers([...changeNotifiers, { msgs : arrayOfMsgs,  color : "primary", date : new Date()}]);

        fetch("http://localhost:8080/warehouse/messages/", {
            method: 'POST',
            body: JSON.stringify(arrayOfMsgs),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
                console.log('sve ok')

        }).catch(err => console.log(err));


  
    }
    
    const updateIngredient = (item, qty) => { 
        if(qty == 0) return;  
        // let newArray = activeIngredientsList.map(ai => {
        //     if(ai.id !== i.id ) return ai ; else return {...ai, remainingQuantity : ai.remainingQuantity + Number(qty)} 
        // });
        // setActiveIngredientsList(newArray);

        let i = {...item}
        i.lastQuantityUpdate = Number(qty);
        //console.log(JSON.stringify(i))
        return fetch("http://localhost:8080/warehouse/ingredient/", {
            method: 'PUT',
            body: JSON.stringify(i),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            createNotifier(Array.of(i));
            fetchCategories(false);

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
                               
                            <Col style={style} lg = "9" md = "9" sm ="9">
                             
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
                                                    <th></th>
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
                                                        <tr key={index} >
                                                        
                                                        <td>
                                                            <input  type="checkbox" 
                                                                id= {i.id} 
                                                                name={i.id}
                                                                defaultChecked = {checkboxArray[myIndex]}

                                                                onClick={() =>{
                                                                    checkboxChange(myIndex);
                                                                    
                                                                }
                                                                }
                                                            />
                                                        </td>
                                                        <td>                          
                                                            {i.name}
                                                        </td>
                                                        <td>{i.unit}</td>
                                                        <td>{i.remainingQuantity}</td>
                                                        <td>
                                                            <Input  defaultValue = {0} size = "sm" onChange = {(e) => { handleIncChange(myIndex, e.target.value)}} ></Input>
                                                        </td>
                                                        <td>
                                                            <Button  size = "sm" color = "success" onClick = {() => { updateIngredient(i, activeIncFields[myIndex])}}>+</Button>

                                                        </td>
                                                        <td>
                                                            <Input defaultValue = {0} size = "sm" onChange = {(e) => { handleDecChange(myIndex, e.target.value)}}></Input>
                                                        </td>
                                                        <td>
                                                            <Button size = "sm" color = "danger" onClick = {() => { updateIngredient(i, -activeDecFields[myIndex])}}>-</Button>

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
                                    <Button color = "success" onClick = {() => { updateAllChecked(true) }} >Dodaj sve</Button>
                                    <Button color = "danger" onClick = {() => { updateAllChecked(false) }} >Otpisi sve</Button>


                            </Col>
                            <Col style={style} lg = "3" md = "3" sm ="3">
                                <ListGroup>
                                    {
                                        
                                        changeNotifiers.map((cn, index) => {
                                            const hrs = cn.date.getHours();
                                            const mins = cn.date.getMinutes();
                                            const secs = cn.date.getSeconds();
                                            return(
                                                    <Alert color={cn.color} >
                                                        {
                                                            cn.msgs.map(o => {
                                                                return (
                                                                    <p>
                                                                        {o.msg}
                                                                    </p>

                                                                )                                                           
                                                                
                                                            }
                                                                
                                                                              
                                                            )}
                                                        <p>{(hrs > 9 ? hrs : "0" + hrs  ) + ":" + (mins > 9 ? mins : "0"+ mins) + ":" + (secs > 9 ? secs : "0" + secs)}</p> 
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