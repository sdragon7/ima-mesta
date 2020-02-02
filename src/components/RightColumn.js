import React, { useState } from 'react';
import {
    Col, Card, Button, CardImg, CardTitle, CardText, CardDeck,
    CardSubtitle, CardBody, Row, Container, ListGroup, ListGroupItem, TabContent, TabPane, Nav, NavItem, NavLink
  } from 'reactstrap';
  import classnames from 'classnames';
export default function RightColumn(props) {

    const categories = {
        "Cajevi" : [
              "https://biljna-apoteka.rs/wp-content/uploads/2018/08/caj-od-maticnjaka-.jpg?x39062",
              "https://lh5.googleusercontent.com/proxy/_ts01DDnjQU80U6kgv5ie5X8DUIWYH83fBMGtf0EWme7SXe-EqLdjpTwbAPAouW3TrfM9Uz1E8gy7e6yXZ0um5dQItYWZtxikRm4EsHk",
              "https://onaportal.com/wp-content/uploads/2019/11/%C4%8Daj-od-koprive-za-lice-990x536.jpg",
              "https://www.novosti.rs/upload/images/2016//02/11n/dr-caj.jpg",
              "https://www.herceg.tv/media/uploads/2018/02/zeleni-caj-i-limun.jpg",
              "https://www.adiva.hr/wp-content/uploads/2019/01/Rooibos_caj-760x530.jpg",
              "https://www.zisha.si/fileadmin/user_upload/Novice/rooibos-caj.jpg",
              "https://lh3.googleusercontent.com/proxy/Y4tE63d4Y45JH7Qxz4eG2bpl_1zAazYIooin87vUS_Ywdzx8TbwTtFvvn6zNyB4mR0pytr3UwGUkkziRM8QmNJfQzG9G_7Nnr0T9oU3OiZfQS7Q",
              "https://www.kucastil.rs/uploads/ck_editor/images/RECEPTI%20I%20STIL/Otkrijte%20da%20li%20ceo%20%C5%BEivot%20pijete%20%C4%8Daj%20na%20pogre%C5%A1an%20na%C4%8Din/Otkrijte%20da%20li%20ceo%20%C5%BEivot%20pijete%20caj%20na%20pogre%C5%A1an%20nacin%20665.jpg",
              "https://galaksijanova.rs/wp-content/uploads/2017/06/ssolja-ccaja-vikipedija-810x506.jpg",
              "https://static.vesti.rs/slike-4/Kako-pripremiti-savrsenu-solju-caja-uputstvo-Dzordza-Orvela.jpg",
              "https://stil.kurir.rs/data/images/2019/07/10/14/194579_shutterstock-709867099_ls.jpg"
        ],
        "Kafe" : [
            "https://i2.wp.com/zdravarica.com/wp-content/uploads/2017/05/mineralna-voda.jpg?fit=810%2C540&ssl=1",
            "https://www.restoranibeograd.com/storage/news/interior/74/serbian_coffee.jpg",
            "https://see.news/wp-content/uploads/2019/06/istock-157528129.jpg",
            "https://www.slashgear.com/wp-content/uploads/2019/07/coffee_main_envat-1280x720.jpg",
            "https://boygeniusreport.files.wordpress.com/2018/09/coffee.jpg?quality=98&strip=all&w=782",
            "https://see.news/wp-content/uploads/2018/10/a-woman-holding-a-cup-of-coffee.jpg",
            "https://foodzpace.com/wp-content/uploads/2019/07/china-coffee-cup.jpg",
            "https://www.dynamitenews.com/images/2019/11/04/coffee-a-boon-for-sportspersons-finds-study/5dbfd23838d5b.jpeg",
            "https://citymagazine.rs/wp-content/uploads/2019/12/MG_7136-1213x564.jpg",
            "https://images.theconversation.com/files/126820/original/image-20160615-14016-njqw65.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip",
            "https://bestproductlists.com/wp-content/uploads/2019/04/c-1.jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-LOu5wr2HU0wMXzzoumQo50aCCNUlpxrX8khPJFQjv44HNFiu&s"
             
      ]
    }
console.log(categories)
    const [itemName, setItemName] = useState('Kafe')
    var arr = []
    var test = []
    
    let k = 0
    let count = 0
    for(var a in categories) {
        if(a == itemName)
        for(var aa in categories[a]) {
            count ++
        }
           
    }

    var rows = count / 4 
                

    for (var i = 0; i < rows; i++) {
        for(var j = k; j < k + 4; j++) {
            if(k == 12)
            break
            test.push(
                <Card>
                    { categories[itemName][j] !== undefined && 
                        <CardImg top width="100%" src={categories[itemName][j]} alt="Card image cap" /> }
                </Card>
            )
        }
        arr.push(
            <Row>
                <CardDeck className="p-2">
            {

                test
            }
                </CardDeck>
            </Row>
                           
        )
        k += 4
        test = [] 
    }
    
const style = {
    height : 'calc(100vh - 100px)',
    backgroundColor : 'transparent',
    borderRadius : '0',
    boxShadow : 'none'    
}
const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }
    return(
        <>
        <Col lg={8} md={8} style={style} className="p-0">
            <Container>
            <Row>
            <Col lg={3} style={{backgroundColor : 'transparent'}}>

                <ListGroup>
                    <ListGroupItem onClick={() => setItemName('Kafe')} className="bg-dark text-white m-1">Kafe</ListGroupItem>
                    <ListGroupItem onClick={() => setItemName('Cajevi')} className="bg-dark text-white m-1">Cajevi</ListGroupItem>
                    {/* <ListGroupItem className="bg-dark text-white m-1">Mineralne vode</ListGroupItem>
                    <ListGroupItem className="bg-dark text-white m-1">Konjak i Vinjak</ListGroupItem>
                    <ListGroupItem className="bg-dark text-white m-1">Rakije</ListGroupItem>
                    <ListGroupItem className="bg-dark text-white m-1">Vina</ListGroupItem>
                    <ListGroupItem className="bg-dark text-white m-1">Viski</ListGroupItem>
                    <ListGroupItem className="bg-dark text-white m-1">Mesana pica</ListGroupItem>
                    <ListGroupItem className="bg-dark text-white m-1">Zestoka i Aperitivi</ListGroupItem>
                    <ListGroupItem className="bg-dark text-white m-1">Piva</ListGroupItem>
                    <ListGroupItem className="bg-dark text-white m-1">Pelinkovac</ListGroupItem>    */}
                </ListGroup>
            </Col>

            <Col lg={9} style={{backgroundColor : 'transparent'}}>
                <Container>
                    {arr}
                </Container>
            </Col>
            </Row>
            </Container>
        </Col>
        
     </>
    )
}