import React from 'react'; // react import
import {css} from '@emotion/react';

export function Slide(props) { // Slide function component 
    const { title, children } = props; // 
    return (
        <div 
            css={css`
            text-align: center;
            border-top: 1px solid #aaa;
            padding-top: 40px;
            padding-bottom: 60px;
            `}
        >
            <h2>
               {title}
            </h2> 
            <div>
                {children}
            </div>
        </div>
    );
}

