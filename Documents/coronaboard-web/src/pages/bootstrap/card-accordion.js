import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Accordion, Button } from 'react-bootstrap';

export default function CardAccordionPage(){
    return(
        <Container className="pt-3">
            {/*아코디언 컴포넌트*/}
            <Accordion defaultActiveKey="0">{/*열린 상태를 초기 상태로 지정*/}
                <Card>
                    <Card.Header>
                        {/* 아코디언을 여닫을 수 있는 버튼을 지정 */}
                        <Accordion.Toggle
                            className='p-0'
                            as={Button}
                            variant="link"
                            eventKey='0'
                        >
                            카드의 헤더
                        </Accordion.Toggle>
                    </Card.Header>
                    {/* 아코딩너 토글 버튼이 눌렸을 때 이 부분이 열리고 닫힘 */}
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            카드 콘텐츠
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </Container>
    );
}