import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Select, FormControl, MenuItem, InputLabel, TextField, Button } from '@material-ui/core/';
import Autocomplete from '@material-ui/lab/Autocomplete'
import SERVER from '../server-host'

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

export default function ProductAdd(props) {

  const classes = useStyles();

  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const [categories, setCategories] = useState({
        list : [],
        activeProductCategory : {},
        activeProductCategoryItem : {},
        isLoading : true
  })

  const [ingredients, setIngredients] = useState({
    list : [],
    isLoading : true
})

  useEffect(() => {
    fetch(SERVER + "/category/list")
    .then(res => res.json())
    .then(
      (result) => {
          if(Object.keys(result).length != 0) {
            setCategories(prev => {
                return {
                    ...prev,
                    list : result,
                    activeProductCategory : result[0],
                    activeProductCategoryItem : result[0].items[0],
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
        fetch(SERVER + "/warehouse/ingredients")
        .then(res => res.json())
        .then(
          (result) => {
              if(Object.keys(result).length != 0) {
                setIngredients(prev => {
                    return {
                        ...prev,
                        list : result,
                        isLoading : false 
                    }
                })
              } else 
              setIngredients(prev => {
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

    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedCategoryItem, setSelectedCategoryItem] = useState('')

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value)
    }

    const handleCategoryItemChange = (e) => {
        setSelectedCategoryItem(e.target.value)
    }

    const options = ingredients.list.map(option => {
        const firstLetter = option.name[0].toUpperCase();
            return {
                firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                ...option
            };
    });

    const [arr, setArr] = useState([])

    const handleIngr = (e, value) => {
        setArr([])
        value.map((item, index) => {
            setArr(old => [...old, <>
                <TextField id="outlined-basic" label={item.name} variant="outlined" />
                <Button variant="contained" color="primary">Dodaj</Button>
            </>]
            )
        })
        console.log(value)
    }
  return (
    <>
    <Container>
        <FormControl variant="outlined" className={classes.formControl}>
            <Button variant="contained" color="primary">Dodaj</Button>
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
            <TextField id="outlined-basic" label="Naziv artikla" variant="outlined" />
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
            Kategorija
            </InputLabel>
            <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={selectedCategory}
            onChange={handleCategoryChange}
            labelWidth={labelWidth}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            { categories.list.map((category, index) => {
                return <MenuItem
                            key={index}
                            value={category.name}        
                    >{ category.name }</MenuItem>
                }) 
            }
            </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label2">
            Pod kategorija
            </InputLabel>
            <Select
            labelId="demo-simple-select-outlined-label2"
            id="demo-simple-select-outlined2"
            value={selectedCategoryItem}
            onChange={handleCategoryItemChange}
            labelWidth={labelWidth}
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            { categories.list.map((category, index) => {
                if(category.name === selectedCategory) {
                        return category.items.map((cItem, ind) => {
                            return <MenuItem value={cItem.name}>{ cItem.name }</MenuItem>
                    })
                }
              }) 
            }
            </Select>
        </FormControl>
        <FormControl>
            <Autocomplete
                multiple
                id="tags-standard"
                style={{ width: 300 }}
                options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={option => option.firstLetter}
                getOptionLabel={option => option.name }
                onChange={handleIngr}
                renderInput={params => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Multiple values"
                    placeholder="Favorites"
                />
                )}
            />
        </FormControl>
        <FormControl>
            { arr.map(item =>  item ) }
        </FormControl>
    </Container>  
    </>
  );
}