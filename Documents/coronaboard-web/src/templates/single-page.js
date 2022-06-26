import React from 'react';
import {Slide} from '../components/slide';

export default function SinglePage({ pageContext}) {
    const { dataSource} = pageContext;
    // 데이터 소스에서 원하는 필드 추출
    const { countryByCc, globalStats} = dataSource;
    // 각 필드를 로그로 출력
    console.log(countryByCc);
    console.log(globalStats);
    return (
        <div>
            <h1>
                코로나보드
            </h1>
            {/* <p>
                createPage로 만들어진 페이지입니다.
            </p>
             */}
            <Slide title = "국가별 현황"> 국가별 현황을 보여줍니다. </Slide>
            {/* <Slide title = {'대한민국 지역별 현황'}>
                대한민국 지역별 현황을 보여줍니다.     
            </Slide> 
            < Slide title = {thirdSlideTitle}> 예방 행동 수칙을 보여줍니다. </Slide> */}
        </div>
    );
}