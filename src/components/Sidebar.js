
import React, { useState, useContext } from 'react';
import { Button } from 'reactstrap';
import { TableProvider, TableConsumer } from './TableContext.js'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
  } from 'reactstrap';
  
  
  
export default function Sidebar(props) {
    
        const [isOpen, setIsOpen] = useState(false);
      
        const toggle = () => setIsOpen(!isOpen);
      
    return(

        <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Ima mesta</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
          <TableConsumer>
                 {
                    context => {
                         return (
                             <>
                                <NavItem style={{cursor : 'pointer'}}>
                                    <NavLink onClick={context.addTable} >Dodaj</NavLink>
                                </NavItem>
                                <NavItem style={{cursor : 'pointer'}}>
                                    <NavLink>Obrisi</NavLink>
                                </NavItem>
                            </>
                         )
                     }
                 }
             </TableConsumer>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  Option 1
                </DropdownItem>
                <DropdownItem>
                  Option 2
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Reset
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <NavbarText>debilcine</NavbarText>
        </Collapse>
      </Navbar>


        // <div className="sidebar">
        //     <TableConsumer>
        //         {
        //             context => {
        //                 return (
        //                     <>
        //                         <Button className = "btn-xl" style = {{"width" : "100%"}} onClick={context.addTable} >DODAJ</Button>
        //                         <Button className = "btn-xl" style = {{"width" : "100%"}} >OBRISI</Button>
        //                     </>
        //                 )
        //             }
        //         }
        //     </TableConsumer>
        // </div>

    )
    }
