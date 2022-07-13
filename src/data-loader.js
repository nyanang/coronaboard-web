// 각종 라이브러리 가져오기
const axios = require ('axios');
const {subDays} = require('date-fns');
const {format, utcToZonedTime} = require ('date-fns-tz');
const _ = require('lodash');

const countryInfo = require('../../coronaboard/tools/downloaded/countryInfo.json');
const ApiClient = require('./api-client');

// 구글 시트로부터 내려받은 공지사항 목록 로드
const notice = require('../../coronaboard/tools/downloaded/notice.json');


async function getDataSource(){
    const countryByCc = _.keyBy(countryInfo, 'cc');
    const apiClient = new ApiClient();

    // 국가별 데이터 로드
    const allGlobalStats = await apiClient.getAllGlobalStats();

    // 날짜별로 데이터를 묶는 부분을 기존 generateGlobalStats()함수에서 추출
    const groupedByDate = _.groupBy(allGlobalStats, 'date');
    const globalStats = generateGlobalStats(groupedByDate);

    return{
        lastUpdated: Date.now(), // 데이터를 만든 현재 시간 기록
        globalStats,
        countryByCc,
        //공지사항 몽록 중 hidden 필드가 false인 항목만 필터하여 전달
        notice: notice.filter((x) => !x.hidden),
    };
}

function generateGlobalStats(groupedByDate){
    // HTTP 클라이언트 생성
    // const apiClient = axios.create({
    //     baseURL: process.env.CORONABOARD_API_BASE_URL ||'http://localhost:8080',
    // });

    // // GET /global-stats API 호출
    // const response = await apiClient.get('global-stats');

    // // 날짜 기준 그룹핑
    // const groupedByDate = _.groupBy(response.data.result, 'date');

    // 오늘/ 어제 날짜 생성
    // 데이터가 제공되는 마지막 날짜로 Date 객체 생성
    // const now = new date(); //현재 시각의 Date 객체 생성

    const now = new Date('2021-06-05');
    const timeZone = 'Asia/Seoul'; // 시간대 = 한국(서울)
    const today = format(utcToZonedTime(now, timeZone), 'yyyy-MM-dd');
    const yesterday = format(
        utcToZonedTime(subDays(now, 1), timeZone),
        'yyyy-MM-dd',
    );

    // 오늘 날짜에 대한 데이터가 존재하지 않는 경우 오류 발생시키기
    if (!groupedByDate[today]) {
        throw new Error('Data for today is missing!!');
    }

    // 오늘, 어제 데이터를 모두 가진 객체를 생성해 반환
    return createGlobalStatWithPrevField(
        groupedByDate[today],
        groupedByDate[yesterday],
    );
}

// 오늘, 어제 데이터를 모두 가진 객체 생성
function createGlobalStatWithPrevField(todayStats, yesterdayStats) {
    // 어제 데이터를 국가 코드 기준으로 찾을 수 있게 변환
    const yesterdayStatsByCc = _.keyBy(yesterdayStats, 'cc');

    // 국가별로 오늘 데이터와 어제 데이터를 한 번에 가질 수 있게 데이터 변환
    const globalStatWithPrev = todayStats.map((todayStat) => {
        const cc = todayStat.cc;
        const yesterdayStat = yesterdayStatsByCc[cc];
        // 어제 데이터가 존재하면 오늘 데이터 필드 외에 xxxxPrev 형태로
        // 어제 데이터 필드 추가
        if (yesterdayStat) {
            return {
                ...todayStat,
                confirmedPrev: yesterdayStat.confirmed || 0,
                deathPrev: yesterdayStat.death || 0,
                negativePrev: yesterdayStat.negative || 0,
                releasedPrev: yesterdayStat.released || 0,
                testedPrev: yesterdayStat.tested || 0,
            };
        }

        return todayStat;
    });

    return globalStatWithPrev;
}

module.exports = {
    getDataSource,
};