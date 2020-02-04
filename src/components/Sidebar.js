
import React, { useState, useContext } from 'react';
import {  TableConsumer } from './TableContext.js'
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
      <TableConsumer>
        {
          context => {
            return (
              <Navbar color="dark" dark expand="md">
                <NavbarBrand href="/">Ima mesta</NavbarBrand>
                  <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                      <Nav className="mr-auto" navbar>
                        <>
                          {
                            props.showTables 
                              ?
                              <>
                              <NavItem style={{cursor : 'pointer'}}>
                                <NavLink onClick={context.addTable} >Dodaj</NavLink>
                              </NavItem>
                              <NavItem style={{cursor : 'pointer'}}>
                                <NavLink onClick= {context.deleteTable}>Obrisi</NavLink>
                              </NavItem>
                              <NavItem style= {{cursor : "pointer"}}>
                                <NavLink onClick = {() => props.setActiveTable(context.temporaryTable)}>
                                  Za poneti
                                </NavLink>
                              </NavItem>
                              </>
                              : 

                              <>
                              </>
                          }
                         
                        
                        </>
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
                        <NavbarText>Konobar : {context.loggedInUser.username} </NavbarText>
                      </Collapse>
                    </Navbar>
              )
            }
          }
      </TableConsumer>
        
      )
    }
