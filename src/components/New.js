import React , { useState, useRef, useEffect }from 'react';
import { Row, Col} from 'reactstrap';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { TextField, Button, Container } from '@material-ui/core'
import MaterialTable from "material-table";

import SERVER from '../server-host'
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

import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";


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


    const useStylesForTabs = makeStyles(theme => ({
        root: {
          flexGrow: 1,
          width: "100%"
        }
      }));
      


    const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    }));

    const units = [
        'G', 'L', 'KOM'
    ]


    export default function SimpleSelect() {

        const classes = useStyles();
        const classesForTabs = useStylesForTabs()


        const [data, setData] = useState([[],[]])

        const categoryColumns = [
            [
                { title: "Kategorija", field: "name"}
            ],
            [
                { title : "Sastojak", field : "name"}, 
                { title : "Preostala kolicina", field : "remainingQuantity"},
                { title : "Jedinica", field : "unit"}
            ]
        ]

        const [category, setCategory] = useState('');
        const [unit, setUnit] = useState('')

        const inputLabel = useRef(null);
        const inputLabel2 = useRef(null);

        const [labelWidth, setLabelWidth] = useState(0);
        const [labelWidth2, setLabelWidth2] = useState(0);

        const [name, setName] = useState('');

        const [qty, setQty] = useState('');

        const [newCategoryName, setNewCategoryName] = useState('');

        const [value, setValue] = useState(0);

        const handleTabChange = (event, newValue) => {
            setValue(newValue);
            setColumns(categoryColumns[newValue])
        };
        

        const [ingredientCategories, setIngredientCategories] = useState({
            list : [],
        })

        const [ingredients, setIngredients] = useState([])


        const [loading, setLoading] = useState(true);

        const [columns, setColumns] = useState(
            categoryColumns[0]
        )


        
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


        const fetchAll = async () => {
            let newData = data.slice();
            await fetch(SERVER +  "/warehouse/categories")
            .then(res => res.json())
            .then(
                (res) => {
                    setIngredientCategories({list : res});
                    newData[0] = res;
                  
                }
            )
            await  fetch(SERVER + "/warehouse/ingredients")
            .then(res => res.json())
            .then(
                (res) => {
                    newData[1] = res;
                }
            )
            setData(newData)


        }

        // const fetchCategories =  () => {
        //     fetch(SERVER +  "/warehouse/categories")
        //     .then(res => res.json())
        //     .then(
        //         (res) => {
        //             setIngredientCategories({list : res});
        //             console.log("got categ")
        //             return res;
        //             // let newData = data.slice();
        //             // newData[0] = res;
        //             // newData[1] =  fetchIngredients();
        //             // console.log("uzeo sam ingrediente")

        //             // setData(newData);
        //         }
        //     )
    
        // }

        // const fetchIngredients  =  () => {

        //     fetch(SERVER + "/warehouse/ingredients")
        //     .then(res => res.json())
        //     .then(
        //         (res) => {
        //             setIngredients({list : res});
        //             console.log("got ingr")

        //             return res;
        //         }
        //     )
        // }


      

        const createIngredient = () => {

            const o = {
                name : name,
                remainingQuantity : qty, 
                categoryId :  category.id,
                unit : unit
            }
            console.log(JSON.stringify(o))

            fetch(SERVER + "/warehouse/ingredients/", {
                method: 'POST',
                body: JSON.stringify(o),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                () => {  
                    fetchAll();
                }              
            )

        }

        const createIngredientCategory = () => {


            fetch(SERVER + `/warehouse/categories/add?name=${newCategoryName}`, {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                }
            }).then(
                () => {  fetchAll()}              
            )

        }

        useEffect(() => {
            if(inputLabel.current !== null)
                setLabelWidth(inputLabel.current.offsetWidth);
            if(inputLabel2.current !== null)
                setLabelWidth2(inputLabel2.current.offsetWidth);

        }, [value])

        useEffect(() => {

            if(inputLabel.current !== null)
                setLabelWidth(inputLabel.current.offsetWidth);
            if(inputLabel2.current !== null)
                setLabelWidth2(inputLabel2.current.offsetWidth);

            //fetchCategories();
            //fetchIngredients();
            fetchAll();

        }, []);

        useEffect(() => {
            console.log(unit)
        }, [unit])



        const handleCategoryChange = event => {
            setCategory(event.target.value);
        };

        const handleUnitChange = event => {
            setUnit(event.target.value);
        };

        return (
            <>
                <div className={classes.root}>
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
                            <Tab label="Kategorije" />
                            <Tab label="Sastojci" />        
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Container>
                            <div className = "mb-2">
                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="outlined-helperText1"
                                    label="Nova kategorija"
                                    variant="outlined"
                                    value = {newCategoryName}
                                    onChange = {
                                        (e) => setNewCategoryName(e.target.value)
                                    }
                                    size = "small"
                                />
                                </FormControl>    
                                <FormControl className={classes.formControl} >
                                    <Button variant="contained" color="primary" onClick = {createIngredientCategory}>
                                        Dodaj
                                    </Button>
                                </FormControl>
                            </div>

                        </Container>
                      
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Container>
                            <div className = "mb-2">
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="outlined-helperText2"
                                        label="Novi sastojak"
                                        variant="outlined"
                                        value = {name}
                                        onChange = {
                                            (e) => setName(e.target.value)
                                        }
                                        size = "small"
                                    />
                                </FormControl>                   

                                <FormControl variant="outlined" className={classes.formControl} size = "small">
                                    <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                                        Kategorija
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={category}
                                        onChange={handleCategoryChange}
                                        labelWidth={labelWidth}

                                    >
                                        {
                            
                                            ingredientCategories.list.map(
                                                (category, index) => {
                                                    return (
                                                        <MenuItem key = {index} value = {category}> {category.name} </MenuItem>
                                                    )
                                                }
                                            )
                            
                                        }
                                        
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl} size = "small">
                                    <InputLabel ref={inputLabel2} id="demo-simple-select-outlined-label">
                                        Jedinica
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={unit}
                                        onChange={handleUnitChange}
                                        labelWidth={labelWidth2}
                                        inputProps={{
                                            name: 'age',
                                            id: 'outlined-age-native-simple',
                                        }}
                                    >
                                    
                                        {
                            
                                            units.map(
                                                (u, index) => {
                                                    return (
                                                        <MenuItem key = {index} value = {u}> {u} </MenuItem>
                                                    )
                                                }
                                            )
                            
                                        }
                                        {/* <MenuItem value="">
                                        <em>None</em>
                                        </MenuItem> */}
                                    </Select>
                                </FormControl>
                                <FormControl className = {classes.formControl} >
                                    <TextField
                                        size = "small"
                                        id="outlined-helperText3"
                                        label="Pocetna kolicina"
                                        variant="outlined"
                                        value = {qty}
                                        onChange = {
                                            (e) => {
                                                setQty(e.target.value)
                                            }
                                        }
                                    />

                                </FormControl>
                                
                                <FormControl className={classes.formControl} >
                                    <Button variant="contained" color="primary" onClick = {createIngredient}>
                                        Dodaj
                                    </Button>
                                </FormControl>                     
                            </div>
                        </Container>
                    </TabPanel>
                </div>
                {
                    <Container>

                     
                        
                        <div style = {{ boxShadow : "0px 3px 3px 3px 25px 7px rgba(207,207,207,1)" }}>
                            
                            <MaterialTable
                            icons={tableIcons}
                            columns= {columns}
                            data={
                                data[value]
                            }
                            title=""
                            />
                        </div>
                
                        
                          

                    </Container>
                }

            </>
        
        );
    }
