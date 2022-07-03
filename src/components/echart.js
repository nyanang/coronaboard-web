import React, {useEffect, useRef } from 'react' ;
import * as echarts from 'echarts';

export function Echart(props) {
    const {wrapperCss, option} = props;
    //차트가 그려질 DOM 엘리먼트를 참조할 레퍼런스 생성
    const chartRef = useRef(null);

    //의존하는 상태 변수(props 포함)가 변경될 때마다 호출됨
    useEffect(()=> {
        // echarts를 초기화 
        const chartInstance = echarts.init(chartRef.current);
        chartInstance.setOption(option);

        // 의존하는 상태 변수가 바뀌거나 현재 컴포넌트가 DOM에서 제거될 때 
        // 사용중인 리소스를 정리하기 위한 클린업 함수를 정의하여 반환

        return () => {
            chartInstance.dispose();
        };
    }, [option]);

    // 실제 차트가 그려질 리택트 엘리먼트
    return <div css = {wrapperCss} ref = {chartRef} />;
}