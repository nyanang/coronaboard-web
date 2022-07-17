import React, {useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { css, Global }  from '@emotion/react';
import { Dashboard } from '../components/dashboard';
import { Notice } from '../components/notice';
import { GlobalSlide } from '../components/global-slide';
import { globalChartSlide } from '../components/global-chart-slide';
import {Slide} from '../components/slide';
import { last } from 'lodash';

export default function SinglePage({ pageContext}) {
    // pageContext를 통해 전달된 데이터를 추출해서 사용
    const { dataSource} = pageContext;
    // 데이터 소스에서 원하는 필드 추출
    const { lastUpdated, globalStats, notice} = dataSource;

    // 사용자의 언어/지역 설정에 맞는 날짜 형태로 표시
    const lastUpdatedFormatted = new Date(lastUpdated).toLocaleString();

    // 각 필드를 로그로 출력
    // console.log(countryByCc);
    // console.log(globalStats);
    return (
        <div id ="top">
            {/* 상단 검은색 배경 만들기 */}
            <div
                css={css`
                    position: absolute;
                    background-color: purple;
                    width: 100%;
                    height: 300px;
                    z-index: -99;
              `}
            />
            {/* 제목 표시 */}
            <h1
                css={css`
                    padding-top: 48px;
                    padding-bottom: 24px;
                    color: white;
                    text-align: center;
                    font-size: 28px;
                `}
            >
              *COVID-19*
              <br />
              REAL TIME INFO. 
            </h1>
            {/* 마지막 업데이트 정보 표시 */}
            <p className="text-center text-white">
                Last Updated: {lastUpdatedFormatted}
            </p>
            <Dashboard globalStats={globalStats} />
            <Notice notice={notice} />


            <GlobalSlide id="global-slide" dataSource={dataSource} />
            <globalChartSlide id="global-chart-slide" dataSource={dataSource} />
            {/* <Slide title = "국가별 현황"> 국가별 현황을 보여줍니다. </Slide> */}
            {/* <Slide title = {'대한민국 지역별 현황'}>
                대한민국 지역별 현황을 보여줍니다.     
            </Slide> 
            < Slide title = {thirdSlideTitle}> 예방 행동 수칙을 보여줍니다. </Slide> */}
        </div>
    );
}