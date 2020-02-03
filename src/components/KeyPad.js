import React, {  useState } from 'react';
import { Container, Row, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, Button, Table as TableBsr } from 'reactstrap'
import {FaBackspace} from 'react-icons/fa';


export default function KeyPad(props) {


    const style = {
        height : 'calc(100vh - 100px)',
        backgroundColor : 'transparent',
        borderRadius : '0',
        boxShadow : 'none'    
    }

    const charStyle = {       
        border: "3px solid white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "33.3333%",
        backgroundColor: "#343a40",
        color : "#f8f9fa",
        fontSize : "1 rem",
        fontWeight:  "400"
    }
    const outerDivStyle = {
        height: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
    const innerDivStyle = {
        width : "70%",
        height : "70%",
        display: "flex",
        flexFlow: "row wrap"
    }
    
    const passwordEntryStyle = {
        border: "3px solid white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#343a40",
        color : "#f8f9fa",
        fontSize : "1 rem",
        fontWeight:  "400",
        flex: "66%",
        textAlign : "center"

    }
    return (
        <Container>
            <Row>
                <Col lg = "3" />
                <Col lg = "6" style = {style} className = "text-center">
            
                
         
                    <div style = {{height : "15vh"}}></div>

                    <div className="outer" style = {outerDivStyle} >

                        <div style = {innerDivStyle}  >

                        <input type="password" name="password" style = {passwordEntryStyle} />

                        <div style = { charStyle }>
                             <FaBackspace/>
                        </div>

                           {
                               [7, 8, 9, 4, 5, 6, 1, 2, 3, "*", 0, "#"].map(
                                   char =>
                                   {
                                       return (
                                            <div style = { charStyle }>
                                               { char }
                                            </div>
                                       )
                                   }
                               )
                           }
                        </div>

                    </div>

                    

              
                    <div>
                        
                    </div>
              


                </Col>
                <Col lg = "3" />


            </Row>
        

        </Container>
  
       
      
      
    ) 
}