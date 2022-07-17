import React from 'react'; // react import
import {css} from '@emotion/react';
import { Container } from 'react-bootstrap';

export function Slide(props) { // Slide function component 
    const { title, children, id } = props; // 
    return (
        <div 
            id={id} // id 추가
            css={css`
                text-align: center;
                border-top: 1px solid #aaa;
                padding-top: 40px;
                padding-bottom: 60px;
                h2{
                    margin-bottom: 24px;
                }
            `}
        >
            {/* 컴포넌트 추가 */}
            
            <Container>
                <h2>
                {title}
                </h2> 
                <div>
                    {children}
                </div>
            </Container>
        </div>
    );
}

