const axios = require('axios');

//로케일 설정에 따라 n분전, n시간 전 등의 형태로 시간을 표시해주는 라이브러리 사용
const TimeAgo = require('javascript-time-ago');
const ko = require('javascript-time-ago/locale/ko');
TimeAgo.addLocale(ko);
const timeAgoKorean = new TimeAgo('ko-KR');

//GCP콘솔을 통해 발급받은 API 키
const apiKey = 'AIzaSyDXbBP3QVsHHh3dXdZkC9PAj4qNWIMaH8g';

//description이 너무 긴 경우 앞부분만 남기고 잘라내는 함수
function truncateText(text, maxLength) {
    if (!text) {
      return '';
    }
  
    if (text.length > maxLength) {
      return text.substr(0, maxLength) + '...';
    } else {
      return ds;
    }
}

//유튭 API에서 전달된 item을 코로나 보드에서 사용하기 좋은 형태로 변환
function convertModel(item) {
    const { id, snippet, statistics } = item;
  
    return {
      videoUrl: 'https://www.youtube.com/watch?v=' + id,
  
      publishedAt: timeAgoKorean.format(Date.parse(snippet.publishedAt)),
      title: snippet.title,
      channelTitle: snippet.channelTitle,
      thumbnail: snippet.thumbnails ? snippet.thumbnails.medium.url : '',
      description: truncateText(snippet.description, 80),
  
      viewCount: parseInt(statistics.viewCount),
    };
}
async function getYouTubeVideosByKeyword(keyword) {
    const searchResponse = await axios.get(
      'https://content.googleapis.com/youtube/v3/search',
      {
        params: {
          key: apiKey,
          q: keyword,
          type: 'video', // video, channel, playlist 중 하나
          part: 'id', // 검색 조건을 만족하는 비디오의 id값 만 조회
          maxResults: 3,
        },
      },
    );
  
    const ids = searchResponse.data.items.map((x) => x.id.videoId);
  
    const detailResponse = await axios.get(
      'https://content.googleapis.com/youtube/v3/videos',
      {
        params: {
          key: apiKey,
          id: ids.join(','),
          order: 'relevance',
          // snippet: 제목, 설명, 업로드 날짜 등의 비디오 정보 조회
          // statistics에는 조회수 등의 통계 정보 조회
          part: 'snippet,statistics',
        },
      },
    );
  
    return detailResponse.data.items.map(convertModel);
  }
  
  module.exports = {
    getYouTubeVideosByKeyword,
  };