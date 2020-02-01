
import React, { useContext } from 'react';
import { Button } from 'reactstrap';
import { TableProvider, TableConsumer } from './TableContext.js'

export default function Sidebar(props) {

    return(
        <div className="sidebar">
            <TableConsumer>
                {
                    context => {
                        return (
                            <>
                                <Button className = "btn-xl" style = {{"width" : "100%"}} onClick={context.addTable} >DODAJ</Button>
                                <Button className = "btn-xl" style = {{"width" : "100%"}} >OBRISI</Button>
                            </>
                        )
                    }
                }
            </TableConsumer>
        </div>

    )
    }
