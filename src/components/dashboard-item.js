import React from 'react';
import { css } from '@emotion/react';

// 증감량을 표현하는 함수, 숫자에 천 단위 구분 기호를 추가하여 표현하는 함수
import { formatDiff, numberWithCommas } from '../utils/formatter';

export function DashboardItem(props) {
    const { text, current, prev, diffColor, unit } = props;
    //diffColor 속성이 존재하면 해당 값을 사용하고, 없다면 red 값을 사용
    const finalDiffColor = diffColor ? diffColor : 'red';
    // unit 속성이 percent일 때는 소수점 두 자릿수까지 표기
    const formattedNumber = 
        unit === 'percent' ? `${current.toFixed(2)}%`: numberWithCommas(current);

        return (
            <div
                css={css`
                    font-size: 15px;
                    position: relative;
                `}
            >
                <p
                    css={css`
                        font-size: 22px;
                        font-weight: 500;
                        //화면 가로 길이가 576px 보다 작거나 같으면 폰트 크기를 더 작게 지정
                        @media (max-width: 576px){
                            font-size: 20px;
                        }
                    `}
                >
                    {formattedNumber}
                </p>

                {/* prev 속성의 존재 여부에 따라 증감을 보여주는 엘리먼트를 보여줄지를 결정 */}
                {prev ? (
                    <p
                        css={css`
                        //diff에 해당하는 엘리먼트가 끼어들어도 레이아웃이 그대로 유지되게 처리
                            position: absolute;
                            top: 24px;
                            width: 100%;
                            color: ${finalDiffColor};    
                        `}
                    >
                        {formatDiff(current, prev)}
                    </p>
                ) : null }
                <p>{text}</p>       
            </div>
        );
}