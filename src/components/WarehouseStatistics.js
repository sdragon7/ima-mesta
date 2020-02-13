import React, { useState, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Table, Row, Col, Container, Button } from 'reactstrap';
import classnames from 'classnames';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import DataTable, { createTheme } from 'react-data-table-component';
import { storiesOf } from '@storybook/react';

export default function WarehouseStatistics(props) {

    const [categories, setCategories] = useState({
        list : [],
        isLoading : true
    })

    const [statistics, setStatistics] = useState({
        list : [],
        isLoading : true
    })

    const [activeTab, setActiveTab] = useState(1);
    const [startDate, setStartDate] = useState(new Date("01/01/2019"));
    const [endDate, setEndDate] = useState(new Date());

    const StartDateCustomInput = ({ value, onClick }) => (
        <>
        <img 
            onClick={onClick} 
            alt=""
            src={require("../assets/images/calendar.png")}
            style={{width : '70px', height : "70px"}}
            />
            <br />
          {value}
        </>
      );

      const EndDateCustomInput = ({ value, onClick }) => (
        <>
        <img 
            onClick={onClick}
            alt=""
            src={require("../assets/images/calendar.png")}
            style={{width : '70px', height : "70px"}}
            />
            <br />
          {value}
        </>
      );

    const toggle = tab => {
        if(activeTab !== tab) { setActiveTab(tab); setEndDate(new Date())}
      }

      useEffect(() => {
        fetch("http://localhost:8080/warehouse/categories")
        .then(res => res.json())
        .then(
          (result) => {
              if(Object.keys(result).length != 0) {
                setCategories(prev => {
                    return {
                        ...prev,
                        list : result,
                        isLoading : false 
                    }
                })
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
    }, [])

    useEffect(() => {
        fetch("http://localhost:8080/warehouse/statistics/list", {
            method : "POST",
            headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ingredientCategoryId : activeTab, startDate : startDate, endDate : endDate })
        })
        .then(res => res.json())
        .then(
          (result) => {
              if(Object.keys(result).length != 0) {
                  console.log(result)
                setStatistics(prev => {
                    return {
                        ...prev,
                        list : result,
                        isLoading : false 
                    }
                })
              } else 
              setStatistics(prev => {
                  return {
                      ...prev,
                      list : result,
                      isLoading : true
                  }
            })
          },
          (error) => {
                alert("errorcina")
          }
        )
    }, [activeTab, startDate, endDate])

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
        <Container>
            <Row>
                <Col style={{ backgroundColor : 'transparent'}}>
                    <TabContent activeTab={activeTab}>
                        {
                            categories.list.map((category, index) => {
                                return (
                                    <TabPane key={index} tabId={ category.id }>
                                    <Row>
                                    <Col sm="12">
                                        <Row className="text-center" style={{cursor : 'pointer'}}>
                                            <Col lg="6">
                                                <DatePicker 
                                                    selected={startDate} 
                                                    onChange={date => setStartDate(date)}
                                                    customInput={<StartDateCustomInput />} 
                                                />
                                            </Col>
                                            <Col lg="6">
                                                <DatePicker 
                                                    selected={endDate} 
                                                    onChange={date => setEndDate(date)}
                                                    customInput={<EndDateCustomInput />} 
                                                />
                                            </Col>
                                        </Row>
                                        <DataTable
                                            title={category.name}
                                            columns={
                                                [
                                                    {
                                                        name: 'Naziv',
                                                        selector: 'ingredientName',
                                                        sortable: true
                                                    },
                                                    {
                                                        name: 'Nabavka',
                                                        selector: 'nabavka',
                                                        sortable: true
                                                    },
                                                    {
                                                        name: 'Otpis',
                                                        selector: 'otpis',
                                                        sortable: true
                                                    },
                                                    {
                                                        name: 'Potrosnja',
                                                        selector: 'potrosnja',
                                                        sortable: true
                                                    }
                                                ]
                                            }
                                            data={statistics.list}
                                            striped
                                            pagination
                                            paginationPerPage={5}
                                            paginationRowsPerPageOptions={[5, 10, 20, 30]}
                                        />
                                    </Col>
                                    </Row>
                                </TabPane>
                                )
                            })
                        }
                    </TabContent>
                </Col>
            </Row>
        </Container>
    </>
    )
}