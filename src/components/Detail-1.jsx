import React from 'react';
import './Detail-1.css';

// Bootstrap imports
import { Container, Row, Col, Image, Button } from 'react-bootstrap';

class Detail_1 extends React.Component{
    render() {
        return (
            <Container fluid>
                <Row>
                    <Col xs={6}>
                        <Image src="https://lh3.googleusercontent.com/H1_2W9MHglpx4Mg7Tglp74ZMKpfCB_eQXa_3annw4NtMs6kiTkVl3A_csxbHIXJNXrM=w2400" 
                            alt="ag-major-logo"
                            className='vertical-center img'/>
                    </Col>
                    <Col xs={6}>
                        <Container className='vertical-center'>
                            <Row>
                                <Col>
                                    {/* <button class="button">Food & Nutrition</button> */}
                                    <Button variant='danger' className='button' size="lg">Food & Nutrition</Button>
                                    <Button variant='warning' className='button' size="lg">Environmental Science</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button variant='success'className='button' size="lg">Agriculture</Button>
                                    <Button variant='primary' className='button' size="lg">Animal Science</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Detail_1
