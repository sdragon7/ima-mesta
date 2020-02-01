import React, {Component} from 'react';
import { Card,Button, Container, Row, Col } from 'reactstrap';

const products = [
    {
        id : 1,
        price : 200,
        name : 'sok'
    },
    {
        id : 2,
        price : 110,
        name : 'kafa'
    },
    {
        id : 3,
        price : 150,
        name : 'voda'
    },
    { 
        id : 4,
        price : 250,
        name : 'pivo'
    },
    { 
        id : 5,
        price : 150,
        name : 'asd1'
    }
    ,
    { 
        id : 6,
        price : 330,
        name : 'aaaaa'
    }
    ,
    { 
        id : 7,
        price : 990,
        name : 'zz'
    }
    ,  
    { 
        id : 8,
        price : 250,
        name : 'product1'
    }
  ]

export default class ProductPicker extends Component {


    constructor(props) {
        super(props);
     

    }
    
    render() {
        let quan = 1;

        return(

            <div className="productPickerWrapper">
              <Row>
              {
                  products.map(p => {

                    return(
                            <Col key = {p.id}> 
                                <Card>
                                    <Button onClick = {() => this.props.addToOrder(p, quan)}> {p.name}</Button>
                                </Card>                
                            </Col>
                    ) ;
                  })

              }
            </Row>

        
            </div>

        )


    }

}