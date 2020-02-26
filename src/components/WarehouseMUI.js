import React, { useState, useEffect, forwardRef } from 'react';
import { Alert, Input, Container, Row, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, InputGroup, InputGroupAddon, Table as TableBsr } from 'reactstrap'
import BottomScrollListener from 'react-bottom-scroll-listener'
import classnames from "classnames";
import { getAllByPlaceholderText } from '@testing-library/react';
import validator from 'validator';
import SERVER from '../server-host';
import MaterialTable from "material-table";

import { AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, FilterList, Remove, FirstPage, LastPage, SaveAlt, Search, ViewColumn } from '@material-ui/icons';
// tab dependencies
import PropTypes from "prop-types";

import { makeStyles } from '@material-ui/core/styles';

import {TextField, Button, FormControl, AppBar, Tabs, Tab, Typography, Box} from '@material-ui/core'



const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
const style = {
    height : 'calc(100vh - 100px)',
    backgroundColor : 'transparent',
    borderRadius : '0',
    boxShadow : 'none'

}

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const useStylesForTabs = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      width: "100%"
    }
  }));




export default function Warehouse(props) {


    const [ categories, setCategories ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ activeIngredientsList, setActiveIngredientsList] = useState([])
    const [ activeIncFields, setActiveIncFields] = useState([]);
    const [ activeDecFields, setActiveDecFields] = useState([]);
    const [ changeNotifiers, setChangeNotifiers] = useState([]);
    const [ currentTabIndex, setCurrentTabIndex] = useState(0);

    const classesForTabs = useStylesForTabs()
    const classes = useStyles();


    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(e.target.value)
        console.log(e.target.ime.value)
    }

    const columns = 
 
        [
            { title : "Sastojak", field : "name", editable : "never"}, 
            { title : "Jedinica", field : "unit", editable : "never"},
            { title : "Preostala kolicina", field : "remainingQuantity", editable : "never"},
            { title : "Dodaj", field : "lastQuantityIncrease"},
            { title : "Otpis", field : "lastQuantityDecrease"},

            {   title : "", 
                field : "",
                render : 
                    rowData => {
                        return (
                            <FormControl className={classes.formControl} >
                                <Button 
                                    
                                    onClick = { () => {  updateIngredient(rowData, rowData.lastQuantityIncrease) } }
                                    type = "submit" 
                                    id = {rowData.id} 
                                    size = "small" 
                                    variant="contained" 
                                    color="primary" 
                                    >
                                    +
                                </Button>
                            </FormControl>
                        )
                    },
      
            },
            { title : "", render : 
                rowData =>     
                    <FormControl className={classes.formControl} >
                        <Button 
                            onClick = { () => {  updateIngredient(rowData, -rowData.lastQuantityDecrease) } }
                            type = "submit" 
                            id = {rowData.id} 
                            size = "small" 
                            variant="contained" 
                            color="secondary" 
                            >
                            -
                        </Button>
                    </FormControl>
            }

            // { title : "Dodaj" , render: rowData => {
            //         return(
            //             <div className = "mb-2">
            //                 <form onSubmit = {handleSubmit}>
            //                     <FormControl className={classes.formControl}>
            //                     <TextField
            //                         defaultValue = {rowData.remainingQuantity}
            //                         name = "ime"
            //                         id={"outlined-helperText" + "-Plus"+ rowData.id}
            //                         label="Nabavljena kolicina"
            //                         variant="outlined"                               
            //                         size = "small"
            //                     />
            //                     </FormControl>    
            //                     <FormControl className={classes.formControl} >
            //                         <Button type = "submit" id = {rowData.id} variant="contained" color="primary" >
            //                             Dodaj
            //                         </Button>
            //                     </FormControl>

            //                 </form>
                          
            //             </div>
            //         )
            //     }
            // }, 
            // { title : "Otpisi" , render: rowData => {
            //     return(
            //         <div className = "mb-2">
            //             <FormControl className={classes.formControl}>
            //             <TextField
            //                 onChange = {(e) => { handleDecChange(rowData.id, e.target.value)}} 
            //                 value = {activeDecFields[rowData.id] || ''}
            //                 id={"outlined-helperText" + "-Minus" + rowData.id}
            //                 label="Kolicina za otpis"
            //                 variant="outlined"                               
            //                 size = "small"
            //             />
            //             </FormControl>    
            //             <FormControl className={classes.formControl} >
            //                 <Button id = {rowData.id} variant="contained" color="secondary" onClick = { () => {  updateIngredient(rowData, -activeDecFields[rowData.id]); } }>
            //                     Otpisi
            //                 </Button>
            //             </FormControl>
            //         </div>
            //     )
            //     }
            // } 
        ]
    
    


    // novi state 
    const [value, setValue] = useState(0);
    const [selectedRows, setSelectedRows] = useState([])

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
    
        
        return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
        );
    }
    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired
    };

  
    


    const handleTabChange = (event, newValue) => {

        setValue(newValue);
        const filteredC = categories.filter(ca => (ca.id === newValue))
        const ingredients = (filteredC === undefined) ? [] : filteredC[0].ingredients;


        let newCategories = categories.slice();
        newCategories[currentTabIndex].ingredients = activeIngredientsList;
        
        setCurrentTabIndex(categories.indexOf(filteredC[0]))
        setCategories(newCategories);
        setFields(ingredients.length);
        setActiveIngredientsList(ingredients);

    
    };
    
    const  a11yProps  = (index) =>  {
        return {
          id: `scrollable-auto-tab-${index}`,
          'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
      }

    
   
    useEffect(() => {
        console.log('list changed!')
    }, [activeIngredientsList])

   

    useEffect(() => {
        fetchCategories(true);

    }, [])




    

    const fetchCategories = (initCall) => {
        fetch(SERVER + "/warehouse/categories")
        .then(res => res.json())
        .then(
          (result) => {
              if(Object.keys(result).length != 0) {
                setValue(result[0].id)
                setCategories(result);
                setLoading(false);
               
                if(initCall) { 
                    const ingredients = result[0].ingredients
                    setActiveIngredientsList(ingredients);
                    setFields(ingredients.length);            
                }
                else {
                    const ingredients = result.filter(cat => (cat.id === value))[0].ingredients
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



        return;
        // //let arr = selectedRows.slice();
        // //for(var i = 0 ; i < selectedRows.length)
        // // for(var i =0; i < checkboxArray.length; i++)
        // //     if(checkboxArray[i]) {
        // //         arr.push({...activeIngredientsList[i], lastQuantityUpdate :  (pos ? Number(activeIncFields[i])  : -Number(activeDecFields[i]) )})
        // // }
   

        // fetch(SERVER + "/warehouse/ingredients/", {
        //     method: 'PUT',
        //     body: JSON.stringify(arr),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // .then(res => res.json())
        // .then(res => {
        //     createNotifier(arr);
        //     fetchCategories(false);
      
        // }).catch(err => console.log(err));
        
        
        
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
        setActiveIncFields(initArray1);
        setActiveDecFields(initArray2);
    }

    const handleIncChange = (myIndex, val) => {
        
        if(!validator.isFloat(val) && val !== "") return;
        let myArray = activeIncFields.slice(); // ovo ne menja originalni array
        myArray[myIndex] = val;
        setActiveIncFields(myArray);

    }
    const handleDecChange = (myIndex, val) => {
        if(!validator.isFloat(val) && val !== "") return;
        let myArray = activeDecFields.slice();
        myArray[myIndex] = val;
        setActiveDecFields(myArray)

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

        fetch(SERVER + "/warehouse/messages/", {
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
        return fetch(SERVER + "/warehouse/ingredient/", {
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
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {
                        categories.map(
                            c => {
                                return (
                                    <Tab label = {c.name} index = {c.id}  value = {c.id} {...a11yProps(c.id)}>
                                    </Tab>
                                )
                            } 
                        )

                    }
                    
                </Tabs>

            </AppBar>
            {
                categories.map(
                    c => {
                        return (
                            <TabPanel value={value} index={c.id}>
                            </TabPanel>

                        )
                    }
                )


            }
                       
                      
            {
                loading ? 
                    <h1> Content loading... </h1> 
                    : 
                    <>

                    <Container>                     
                        <div style = {{ boxShadow : "0px 3px 3px 3px 25px 7px rgba(207,207,207,1)" }}>
                            <Button color = "primary" variant="contained" onClick = {() => { updateAllChecked(true) }} >Dodaj sve</Button>
                            <Button color = "secondary" variant="contained" onClick = {() => { updateAllChecked(false) }} >Otpisi sve</Button>
                            
                            <MaterialTable
                              

                        
                                options={{
                                selection: true
                                 }}
                                onSelectionChange={(rows) =>  {  setSelectedRows(rows); }}
                                icons={tableIcons}
                                columns= {columns}
                                data={
                                    activeIngredientsList
                                }
                                title=""
                                editable = {{
                                    onRowUpdate : (newData, oldData) => 
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                        {
                                            let data = activeIngredientsList.slice();
                                            const index = data.indexOf(oldData);
                                            data[index] = newData;
                                            setActiveIngredientsList(data)
                                        }
                                          resolve()
                                        }, 50)
                                      })
                
                                      
                                    }
                                    
                                }
                               

                                

                            />
                        </div>
                    </Container>
                    {/* <Nav pills style={{cursor : 'pointer'}} className="p-2" id="bill-pills">
                        { <NavItem >
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
                        </NavItem> }

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
                        </Nav> */}
                        {/* <Row>
                               
                            <Col style={style} lg = "9" md = "9" sm ="9">
                             
                                <TabContent activeTab={activeTab}>
                                    {
                                    categories.map(
                                        (category, index) => {
                                        return (
                                            <>
                                            <TabPane key={index}  tabId = { category.id } >
                                         
                                            

                                                { <TableBsr striped size ="sm">
                                                <thead>
                                                    <tr>
                                                    <th></th>
                                                    <th>Proizvod</th>
                                                    <th>Jedinica</th>
                                                    <th>Kolicina</th>
                                                    <th >Dodaj</th>
                                                    <th>Otpis</th>
                                                    </tr>
                                                </thead>
                                            
                                                <tbody className="mt-1">
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
                                                            <div class="col-md-5">
                                                                              
                                                            
                                                            <InputGroup size="sm">
                                                                <InputGroupAddon addonType="prepend" onClick = {() => { updateIngredient(i, activeIncFields[myIndex])}}>
                                                                    <Button color="success"> + </Button> 
                                                                </InputGroupAddon>
                                                                <Input value = {activeIncFields[myIndex] || ''} size = "sm" onChange = {(e) => { handleIncChange(myIndex, e.target.value)}} />
                                                            </InputGroup>
                                                            </div>
                                                        </td>
                                                        <td>
                                                           
                                                            <div class="col-md-5">
                                                                              
                                                            
                                                            <InputGroup size="sm">
                                                                <InputGroupAddon addonType="prepend" onClick = {() => { updateIngredient(i, -activeDecFields[myIndex])}}>
                                                                    <Button color="danger"> - </Button>       
                                                                </InputGroupAddon>
                                                                <Input  value = {activeDecFields[myIndex] || ''} size = "sm" onChange = {(e) => { handleDecChange(myIndex, e.target.value)}}></Input>
                                                        </InputGroup>
                                                            </div>
                                                        </td>
                                                        </tr>
                                                    );
                                                    })}
                                                
                                                </tbody>
                                                </TableBsr> }


                                            
                                   
                                    
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
                        </Row> */}
                    </>
            
            }    

       

         
        </>
    )


}