import React, { useState } from 'react';
import { css } from '@emotion/react';
import Chart, { chart }from 'react-google-charts';
import { formatDiffForTable, numberWithCommas} from '../utils/formatter';
import { Button } from 'react-bootstrap';

// 자바스크립트에서 커스텀 객체를 정렬할 때 정렬 기준을 제공하는 함수
function compareConfirmed(x,y) {
    if (x.confirmed > y.confirmed) {
        return -1;
    } else if (x.confirmed < y.confirmed) {
        return 1;
    }
    return 0;
}

// 테이블에 표시되는 데이터를 만들어내는 공통 함수
function generateDiffText(value, valuePrev, colorClassName) {
    return{
        v: value,
        f: `${numberWithCommas(value)}
        <br>
        <span class="diff ${colorClassName}>
        ${formatDiffForTable(value, valuePrev)}
        </span>
        `,
    };
}

export function GlobalTable(props) {
    const { countryByCc, globalStats } = props;

    //모든 국가 데이터를 보여줄지 상위 20개만 노출할지 결정하는 상태 변수
    const [isShowAll, setIsShowAll] = useState(false);

    const globalStatsSorted = globalStats.sort(compareConfirmed);

    // 구글 테이블 차트에서 요구하는 자료 형식으로 변형
    const rows = globalStatsSorted.map((x) => {
        const country = countryByCc[x.cc];
        const countryName = country.title_ko + country.flag;
        const deathRateText = 
        x.death === 0 ? '-' : ((x.death / x.confirmed) * 100).toFixed(1);

        return [
            {
                v: x.cc,
                f: countryName,
            },
            generateDiffText(x.confirmed, x.confirmedPrev, 'red'),
            generateDiffText(x.death, x.deathPrev, 'red'),
            generateDiffText(x.released, x.releasedPrev, 'green'),
            {
                v: x.death / x.confirmed,
                f: deathRateText,
            },
        ];
    });

    const header = [
        { type: 'string', label: '국가'},
        { type: 'number', label: '확진자' },
        { type: 'number', label: '사망자'},
        { type: 'number', label: '격리해제'},
        { type: 'number', label: '치명(%)'},
    ];

    // 기본적으로 200개가 넘는국가 중 상위 20개만 노출
    // 사용자가 [전체보기] 버튼을 클릭하면 전체 국가를 모두 보여줌

    const tableData = [header, ...(isShowAll ? rows: rows.slice(0,10))];

    return (
        <div
            css = {css`
                // pc에서 테이블이 불필요하게 크게 보이지 않게 제한
                    max-width: 640px;
                    margin: 20px auto;

                    .diff.green {
                        color: green;
                  }
                    .diff.red{
                        color: red;
                    }

                // 구글 테이블 차트의 기본 스타일 변경
                .google-visualization-table-tr-head th{
                    background-image: none;
                    background-color: #f8f9fa;
                    padding: 14px 4px;
                    border-bottom: 2px solid #dee2e6;
                }

                .google-visualization-table-td {
                    vertical-align: top;
                }

                button { 
                    display: block;
                    width: 100%;
                    margin-top: 8px;
                    border-radius: 0;
                }
            `}
        >
            <Chart
                chartType="Table"
                loader={<div> loading... </div>}
                data={tableData}
                options={{
                    showRowNumber : true,
                    width: '100%',
                    height: '100%',
                    allowHtml: true,
                    cssClassNames: {},
                }}  
            />

            {!isShowAll ? (
                //[전체보기] 버튼을 클릭하면 isShowAll샅애 변수의 값을 true 로 변경
                <Button variant="secondary" onClick={() => setIsShowAll(true)}>
                    Show All
                </Button>
            ) : null}
        </div>
    );
}