import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Table, Row, Col, Container, Button, Input} from 'reactstrap';
import classnames from 'classnames';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import DataTable, { createTheme } from 'react-data-table-component';
import { TableContext } from "./TableContext.js"

export default function Test(props) {
    const context = useContext(TableContext);
    const leftRef = useRef([])

    const rightRef = useRef([])

    var selectedRowsArr = []

    const [categories, setCategories] = useState({
        list : [],
        isLoading : true
    })

    const [statistics, setStatistics] = useState({
        list : [],
        isLoading : true
    })

    const [ activeIngredientsList, setActiveIngredientsList] = useState([])
    const [ingrNum, setIngrNum] = useState(0)

    const [activeTab, setActiveTab] = useState(1);
    const [startDate, setStartDate] = useState(new Date("01/01/2019"));
    const [endDate, setEndDate] = useState(new Date());

    const toggle = tab => {
        if(activeTab !== tab) { setActiveTab(tab); setEndDate(new Date())}
      }

      useEffect(() => {
        fetchCategories()
    }, [])

    const createUpdateMsg = (itemList) => {
        let arrayOfMsgs = []
        itemList.map(i => {
            const qty = i.lastQuantityUpdate
            if( qty > 0 )
                arrayOfMsgs.push({ id : i.id, quantity : qty, type : 'NABAVKA'})
            else 
                arrayOfMsgs.push({ id : i.id, quantity : qty, type : 'OTPIS'})    

        })
        console.log('array of msgs')
        console.log(arrayOfMsgs)
        //setChangeNotifiers([...changeNotifiers, { msgs : arrayOfMsgs,  color : "primary", date : new Date()}]);

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

    let ee= 0
    const CustomTableInput = (props) => (
        <>
      <form onSubmit={(e) => {
          e.preventDefault();
          console.log(props.row)
          updateIngredient(props.row, props.positive ? e.target.name.value : -e.target.name.value);
        }}>
        <label>
            <input defaultValue={ props.positive ?  props.row.lastQuantityIncrease : props.row.lastQuantityDecrease } onChange={(e) => ee = e.target.value} type="text" name="name" 
                ref={ee => {
                    props.positive ? leftRef.current[(props.row.id - 1)] = ee : rightRef.current[(props.row.id - 1)] = ee
                }} />
        </label>
        <input type="submit" value={props.positive ? '+' : '-'} />
      </form>
        </>
    );

    const fetchCategories = () => {

        fetch("http://localhost:8080/warehouse/categories")
        .then(res => res.json())
        .then(
          (result) => {
              console.log(result)
              if(Object.keys(result).length != 0) {
                setCategories(prev => {
                    return {
                        ...prev,
                        list : result,
                        isLoading : false 
                    }
                })

                setActiveIngredientsList(result[0].ingredients)
                setIngrNum(result[0].ingredients.length)
                leftRef.current = leftRef.current.slice(0, result[0].ingredients.length);
                rightRef.current = rightRef.current.slice(0, result[0].ingredients.length);
              } else 
              setCategories(prev => {
                  return {
                      ...prev,
                      isLoading : true
                  }
            })
                
          },
          (error) => {

          }
        )
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
            fetchCategories()
            createUpdateMsg(Array.of(i))
        }).catch(err => console.log(err));

    }

    const updateAllChecked = (sRows) => {
        leftRef.current.map((ref, index) => {
            sRows[index].lastQuantityUpdate = ref.value
        })
 
        console.log(selectedRowsArr)
        
        fetch("http://localhost:8080/warehouse/ingredients/", {
            method: 'PUT',
            body: JSON.stringify(sRows),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            createUpdateMsg(sRows);
            fetchCategories();
      
        }).catch(err => console.log(err));
    }

    const [selectedRows, setSelectedRows] = useState([])
    
    const handleCheckboxes = () => {
        
    }

      const columns = useMemo(() =>
        [
            {
                name: 'Proizvod',
                selector: 'name',
                sortable: true,
            },
            {
                name: 'Jedinica',
                selector: 'unit',
                sortable: false
            },
            {
                name: 'Kolicina',
                selector: 'remainingQuantity',
                sortable: true
            },
            {
                name: 'Dodaj',
                selector: 'remainingQuantity',
                sortable: false,
                cell : row => <CustomTableInput row={row} positive={true} />

            },
            {
                name: 'Otpis',
                selector: 'remainingQuantity',
                sortable: false,
                cell : row => <CustomTableInput  row={row} positive={false}  />

            }
      ]
    )
  
    return(
        <>
        <Container fluid className="d-flex justify-content-center mb-5" style={{boxShadow: '0 10px 10px -10px gray'}}>
            <Row>
            <div className="process">
            <Nav pills style={{cursor : 'pointer'}} className="process-row pt-2" id="bill-pills2">
            {
                    categories.list.map((category, index) => {
                        return (

                            <NavItem key={index} style={{borderRadius : '10px'}} className="process-step pr-2">
                                <NavLink 
                                    key={index} 
                                    className={classnames({ active: activeTab === category.id })} 
                                    onClick={() => { toggle(category.id); }}>
                                
                                {/* <img src={require("../assets/images/coffee.png")} style={{ width: '50px', height: '50px' }} alt="" /> */}
                                <p className="pt-2">{ category.name }</p></NavLink>
                                
                            </NavItem>
                        )
                    })
                }
            </Nav>
            </div>
        </Row>
        </Container>
        <Container fluid>
            <Row>
                <Col lg={9} style={{ backgroundColor : 'transparent'}}>
                    <TabContent activeTab={activeTab}>
                        {
                            categories.list.map((category, index) => {
                                return (
                                    <TabPane key={index} tabId={ category.id }>
                                    <Row>
                                    <Col sm="12">
                                        <DataTable
                                            title={category.name}
                                            columns={columns}
                                            data={activeIngredientsList}
                                            striped
                                            pagination
                                            paginationPerPage={5}
                                            paginationRowsPerPageOptions={[5, 10, 20, 30]}
                                            selectableRows
                                            onSelectedRowsChange={row => selectedRowsArr = row.selectedRows}
                                            subHeader={true}
                                            subHeaderComponent={
                                                (
                                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Button color="primary" onClick={() => updateAllChecked(selectedRows)}>+</Button>
                                                  </div>
                                                )
                                              }
                                        />
                                    </Col>
                                    </Row>
                                </TabPane>
                                )
                            })
                        }
                    </TabContent>
                </Col>
                <Col lg={3}></Col>
            </Row>
        </Container>
    </>
    )
}