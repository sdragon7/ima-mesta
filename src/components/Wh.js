import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from 'material-table'
import SERVER from '../server-host'
import { Container } from '@material-ui/core';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }));

export default function Wh(props) {

    const classes = useStyles();
    const [value, setValue] = useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };



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
        fetch(SERVER + "/warehouse/categories")
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
        fetch(SERVER + "/warehouse/statistics/list", {
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
    }

    const columns = [
            {
                title: 'Naziv',
                field: 'ingredientName'
            },
            {
                title: 'Nabavka',
                field: 'nabavka'
            },
            {
                title: 'Otpis',
                field: 'otpis'
            },
            {
                title: 'Potrosnja',
                field: 'potrosnja'
            }
    ]

    return(
        <>
        <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >

        {
            categories.list.map((category, index) => {
                return (
                    <Tab key={index} label={category.name} onClick={() =>  setActiveTab(category.id)} {...a11yProps(index)} />
                )
            })
        }
        </Tabs>
      </AppBar>

      {
            categories.list.map((category, index) => {
                return (
                    <TabPanel key={index} value={value} index={index} >
                        {/* { category.name } */}
                    </TabPanel>
                )
            })
        }
      
    </div>

    <Container>
        <MaterialTable
            icons={tableIcons}
            columns= {columns}
            data={ statistics.list }
            title=""
            />
    </Container>
    </>
    );

    // return(
    //     <>
    //     <Container fluid className="d-flex justify-content-center mb-5" style={{boxShadow: '0 10px 10px -10px gray'}}>
    //         <Row>
    //         <div className="process">
    //         <Nav pills style={{cursor : 'pointer'}} className="process-row pt-2" id="bill-pills2">
    //         {
    //                 categories.list.map((category, index) => {
    //                     return (

    //                         <NavItem key={index} style={{borderRadius : '10px'}} className="process-step pr-2">
    //                             <NavLink 
    //                                 key={index} 
    //                                 className={classnames({ active: activeTab === category.id })} 
    //                                 onClick={() => { toggle(category.id); }}>
                                
    //                             {/* <img src={require("../assets/images/coffee.png")} style={{ width: '50px', height: '50px' }} alt="" /> */}
    //                             <p className="pt-2">{ category.name }</p></NavLink>
                                
    //                         </NavItem>
    //                     )
    //                 })
    //             }
    //         </Nav>
    //         </div>
    //     </Row>
    //     </Container>
    //     <Container>
    //         <Row>
    //             <Col style={{ backgroundColor : 'transparent'}}>
    //                 <TabContent activeTab={activeTab}>
    //                     {
    //                         categories.list.map((category, index) => {
    //                             return (
    //                                 <TabPane key={index} tabId={ category.id }>
    //                                 <Row>
    //                                 <Col sm="12">
    //                                     <Row className="text-center" style={{cursor : 'pointer'}}>
    //                                         <Col lg="6">
    //                                             <DatePicker 
    //                                                 selected={startDate} 
    //                                                 onChange={date => setStartDate(date)}
    //                                                 customInput={<StartDateCustomInput />} 
    //                                             />
    //                                         </Col>
    //                                         <Col lg="6">
    //                                             <DatePicker 
    //                                                 selected={endDate} 
    //                                                 onChange={date => setEndDate(date)}
    //                                                 customInput={<EndDateCustomInput />} 
    //                                             />
    //                                         </Col>
    //                                     </Row>
    //                                     <DataTable
    //                                         title={category.name}
    //                                         columns={
    //                                             [
    //                                                 {
    //                                                     name: 'Naziv',
    //                                                     selector: 'ingredientName',
    //                                                     sortable: true
    //                                                 },
    //                                                 {
    //                                                     name: 'Nabavka',
    //                                                     selector: 'nabavka',
    //                                                     sortable: true
    //                                                 },
    //                                                 {
    //                                                     name: 'Otpis',
    //                                                     selector: 'otpis',
    //                                                     sortable: true
    //                                                 },
    //                                                 {
    //                                                     name: 'Potrosnja',
    //                                                     selector: 'potrosnja',
    //                                                     sortable: true
    //                                                 }
    //                                             ]
    //                                         }
    //                                         data={statistics.list}
    //                                         striped
    //                                         pagination
    //                                         paginationPerPage={5}
    //                                         paginationRowsPerPageOptions={[5, 10, 20, 30]}
    //                                     />
    //                                 </Col>
    //                                 </Row>
    //                             </TabPane>
    //                             )
    //                         })
    //                     }
    //                 </TabContent>
    //             </Col>
    //         </Row>
    //     </Container>
    // </>
    // )
}