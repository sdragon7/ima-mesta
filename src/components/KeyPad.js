import React, {  useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, Button, Table as TableBsr } from 'reactstrap'
import {FaBackspace} from 'react-icons/fa';


export default function KeyPad(props) {



    const [pincode, setPincode] = useState("");
    const [startLongPress, setStartLongPress] = useState(false);
    const [isLogged, setIsLogged] = useState(false)



    useEffect(() => {
        let timerId;
        if (startLongPress) {
          timerId = setTimeout(() => {setPincode("")},  1500);
        } else {
          clearTimeout(timerId);
        }
    
        return () => {
          clearTimeout(timerId);
        };
      }, [startLongPress]);

  


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

                        <input type="password" value = {pincode} name="password" style = {passwordEntryStyle} onChange = {(e) => {setPincode(e.target.value)}} />

                        <div style = { charStyle } onClick = {() => {setPincode(pincode.slice(0, pincode.length-1))}}
                        
                        
                        
                        onMouseDown = {() => setStartLongPress(true)}
                        onMouseUp = {() => setStartLongPress(false)}
                        onMouseLeave = {() => setStartLongPress(false)} 
                        onTouchStart = {() => setStartLongPress(true)}
                        onTouchEnd = {() => setStartLongPress(false)}
                        >
                             <FaBackspace/>
                        </div>

                           {
                               [7, 8, 9, 4, 5, 6, 1, 2, 3, "*", 0, "#"].map(
                                   char =>
                                   {
                                       return (
                                            <div 
                                                style = { charStyle } 
                                                onClick = {() => {
                                                    setPincode(pincode + "" + char)
                                                    if((pincode + "" + char).length >= 8) {
                                                        const input = {
                                                            password : (pincode + "" + char)
                                                        };
                                                        fetch("http://localhost:8080/login", {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                              },
                                                              body: JSON.stringify(input)
                                                        })
                                                        .then(res => res.json())
                                                        .then(
                                                        (result) => {
                                                            props.isUserLogged(true)
                                                                
                                                        },
                                                        (error) => {
                                                            props.isUserLogged(false)
                                                        }
                                                        )
                                                    }
                                            }}>
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