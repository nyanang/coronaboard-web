import React, {useEffect, useState} from "react";
import { css } from '@emotion/react';
import {
    convertToMonthDay,
    numberWithUnitFormatter,
} from '../../utils/formatter';
import { Echart } from "../echart";
import { Button, ButtonGroup, Card} from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios' ;
import {colors} from '../../config';

function generateChartOption(data, dataType){
    const seriesAccList = [
        {
            name: '누적확진',
            type: 'line',
            data: data.confirmedAcc,
            color: colors.confirmed, //
        },
        {
            name: '누적사망',
            type: 'line',
            data: data.daeathAcc,
            color: colors.death,
        },
        {
            name: '누적격리해제',
            type: 'line',
            data: data.releasedAcc,
            color: colors.released,
        },
    ];
    
    const seriesDailyList = [
        {
            name: '확진',
            type: 'bar',
            data: data.confirmed,
            color: colors.confirmed,
        },
        {
            name: '사망',
            type: 'bar',
            data: data.death,
            color: colors.death,
        },
        {
            name: '격리해제',
            type: 'bar',
            data: data.released,
            color: colors.released,
        },
    ];

    let legendData;
    let series;
    let dataZoomStart;

    // '누적' 또는 '일별'에 따라서 어떤 데이터를 어떻게 보여줄지 결정
    if (dataType === 'acc') {
        legendData = seriesAccList.map((x) => x.name);
        series = seriesAccList;
        dataZoomStart = 30;
    } else if (dataType === 'daily') {
        legendData = seriesDailyList.map((x) => x.name);
        series = seriesDailyList;
        dataZoomStart = 85;
    } else {
        throw new Error (`Not supported dataType: ${dataType}`);
    }

    return {
        animation: false,
        title: {
            text: '전 세계 코로나 추이',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: legendData,
            bottom: 50,
        },
        // 전체 캔버스 영역에서 상하좌우 얼마나 떨어진 곳에 차트를 그릴지 결정
        grid: {
            top: 70,
            left: 40,
            right: 10,
            bottom: 100,
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                // 데이터 줌 슬라이더의 초기 선택 범위 결정
                start: dataZoomStart,
                end: 100,
            },
        ],
        xAxis: {
            // 날짜를 yyyy-MM-dd에서 M.d형식으로 최대한 짧게 변환
            data: data.date.map(convertToMonthDay),
        },
        yAxis: {
            axisLabel: {
                rotate: 50, //긴 텍스트가 잘리지 않도록 비스듬하게 회전시켜 보여줌
                formatter: numberWithUnitFormatter,
            },
        },
        series,
    };
}



export function GlobalTrendChart(props) {
    const {countryByCc} = props;
    // 선택상자의 기본값
    
    const defaultSelectedItem = {
        value: 'global',
        label: '전세계',
    };

    // 상태 변수 정의
    // 실제 차트를 그리는 데 필요한 데이터
    const [chartData, setChartData] = useState(null);

    //누적(acc), 일별(daily) 선택 여부
    const [dataType, setDataType] = useState('acc');
    //선택 상자에서 현재 선택된 항목
    const [selectedItem, setSelectedItem] =useState(defaultSelectedItem);
    const countryCodes = Object.keys(countryByCc);

    useEffect(() => {
        // 선택된 국가가 변경될 때 해당 국에 대한 차트 데이터를 동적으로 로드
        async function fetchDataWithCc(cc) {
            const response = await axios.get(`/generated/${cc}.json`);
            setChartData(response.data);
        }
        fetchDataWithCc(selectedItem.value);
    }, [selectedItem]);
    //데이터가 아직 준비되지 않은 때는 로딩 화면 노출
    if (!chartData) {
        return <div> Loading ... </div>;
    }
    // 차트 데이터와 자료형에 맞는 차트 옵션 생성
    const chartOption = generateChartOption(chartData, dataType);
    // 선택 상자에 사용할 국가 코드와 국가 이름 데이터 생성
    const selectOption = [
        defaultSelectedItem,
        ...countryCodes.map((cc) => ({
            value: cc,
            label: countryByCc[cc].title_ko,
        })),
    ];

    return (
        <Card>
            <Card.Body>
                <Echart
                    wrapperCss={css`
                        width: 100%;
                        height: 400%px;
                    `}
                    option={chartOption}
                    />
                    {/* ButtonGroup과 Select 컴포넌트를 한 줄에 나란히 놓는 작업 */}
                    <div className="d-flex justify-content-center">
                        <ButtonGroup
                            size="sm"
                            css={css`
                                padding: 0 10px;
                            `}
                            >
                            <Button
                                variant="outline-primary"
                                //상태변수의 값에 따라 버튼의 액티브 상태 결정
                                active= {dataType === 'acc'}
                                onClick={()=> setDataType('acc')}
                                >
                                acc
                            </Button>
                            <Button
                                variant="outline-primary"
                                active= {dataType === 'daily'}
                                onClick={()=> setDataType('daily')}
                                >
                                daily
                            </Button>
                        </ButtonGroup>
                        <Select
                            styles = {{
                                //선택상자 UI 커스터마이즈
                                container: (provided) => ({
                                    ...provided,
                                    width: '160px',
                                }),
                            }}
                            value={selectedItem}
                            onChange={(selected) => {
                                setSelectedItem(selected);
                            }}
                            options={selectOption}
                            />
                    </div>
            </Card.Body>
        </Card>
    );
}
