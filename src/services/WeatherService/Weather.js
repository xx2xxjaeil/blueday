import axios from 'axios';
import { WEATHER_FUNCTION_URL } from './index';

const API_KEY = decodeURIComponent(import.meta.env.VITE_DATA_API_KEY);

// 공통 API 요청 함수
const fetchWeatherData = async (url, params) => {
  try {
    const response = await axios.get(url, { params });
    return response.data?.response?.body?.items?.item || [];
  } catch (error) {
    console.error(`API 호출 중 오류 발생: ${url}`, error);
    throw error;
  }
};

// 초단기실황조회
const fetchCurrentWeather = async (baseDate, baseTime, nx, ny) => {
  const params = {
    serviceKey: API_KEY,
    base_date: baseDate,
    base_time: baseTime,
    nx,
    ny,
    numOfRows: 10,
    dataType: 'JSON',
    pageNo: 1
  };

  const items = await fetchWeatherData(WEATHER_FUNCTION_URL.GET__READ_WEATHER, params);

  // 데이터를 key-value 형태로 변환
  const weatherData = {};
  items.forEach((item) => {
    weatherData[item.category] = item.obsrValue;
  });

  return weatherData;
};

// 단기예보조회
const fetchForecastWeather = async (baseDate, baseTime, nx, ny) => {
  const params = {
    serviceKey: API_KEY,
    base_date: baseDate,
    base_time: baseTime,
    nx,
    ny,
    numOfRows: 1000,
    dataType: 'JSON'
  };

  const items = await fetchWeatherData(WEATHER_FUNCTION_URL.GET__READ_FORECAST, params);

  // 시간별 데이터 그룹화
  return groupForecastByTime(items);
};

// 오늘 날씨 정보
export const getWeather = async (nx = 60, ny = 127) => {
  const { baseDate, baseTime } = getBaseDateTime(); // 기준 날짜와 시간 계산

  try {
    const [currentWeather, forecastWeather] = await Promise.all([
      fetchCurrentWeather(baseDate, baseTime, nx, ny),
      fetchForecastWeather(baseDate, '0200', nx, ny)
    ]);

    // 오늘 온도(최고/최저/평균) 계산
    const todayTemp = calculateDailyTemperatures(forecastWeather, baseDate);

    const today = new Date();
    const todayString = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

    // 오늘 날짜 데이터 필터링
    const filteredData = Object.entries(forecastWeather)
      .filter(([time]) => time.startsWith(todayString))
      .reduce((acc, [time, data]) => {
        acc[time] = data;
        return acc;
      }, {});

    return {
      ...currentWeather,
      ...todayTemp,
      list: filteredData
    };
  } catch (error) {
    console.error('날씨 정보를 가져오는 중 오류 발생:', error);
    throw error;
  }
};

// 오늘의 시간대 별 날씨 정보
// export const getHourlyWeather = async (nx = 60, ny = 127) => {
//   const { baseDate, baseTime } = getBaseDateTime2(); // 기준 날짜와 시간 계산
//
//   try {
//     const forecastWeather = await fetchForecastWeather(baseDate, baseTime, nx, ny);
//
//     // 시간대 별 날씨 정보 계산
//     const hourlyWeather = Object.entries(forecastWeather).map(([time, values]) => {
//       const timeLabel = `${time.slice(8, 10)}시`;
//       return {
//         time: timeLabel,
//         TMP: parseFloat(values.TMP),
//         SKY: values.SKY,
//         PTY: values.PTY
//       };
//     });
//
//     console.log('######## hourlyWeather1 : ', forecastWeather);
//     console.log('######## hourlyWeather2 : ', groupForecastByTime(forecastWeather));
//
//     return hourlyWeather;
//   } catch (error) {
//     console.error('시간대 별 날씨 정보를 가져오는 중 오류 발생:', error);
//     throw error;
//   }
// };

// 기준 날짜와 시간을 계산하는 함수
const getBaseDateTime = () => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // 기상청 기준 시간 계산 (40분 기준)
  let baseTime;
  if (minutes >= 40) {
    baseTime = `${String(hours).padStart(2, '0')}30`;
  } else {
    baseTime = `${String(hours - 1).padStart(2, '0')}30`;
  }

  return { baseDate: date, baseTime };
};

// 현재 시간에 가까운 기준 날짜와 시간을 계산하는 함수
const getBaseDateTime2 = () => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const hours = now.getHours();

  // 기준 시간은 3시간 간격 (0200, 0500, 0800 등)
  const baseTimes = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];
  const baseTime = baseTimes.reduce((prev, curr) => (hours >= parseInt(curr.substring(0, 2)) ? curr : prev), baseTimes[0]);

  // 자정 이후 시간 요청일 경우, 이전 날짜로 처리
  if (hours < 2) {
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayDate = `${yesterday.getFullYear()}${String(yesterday.getMonth() + 1).padStart(2, '0')}${String(yesterday.getDate()).padStart(2, '0')}`;
    return { baseDate: yesterdayDate, baseTime };
  }

  return { baseDate: date, baseTime };
};

// 시간별 데이터를 시간별로 그룹화
const groupForecastByTime = (items) => {
  return items.reduce((acc, item) => {
    const time = `${item.fcstDate} ${item.fcstTime}`;
    if (!acc[time]) acc[time] = {};
    acc[time][item.category] = item.fcstValue;
    return acc;
  }, {});
};

// 오늘 날짜에 해당하는 데이터 필터링 및 온도 계산
const calculateDailyTemperatures = (data, targetDate) => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}00`;

  // 오늘 날짜에 해당하는 데이터 필터링
  const todayData = Object.entries(data)
    .filter(([time]) => time.startsWith(targetDate))
    .map(([time, values]) => ({
      time: time.split(' ')[1],
      TMP: parseFloat(values.TMP),
      SKY: values.SKY,
      PTY: values.PTY
    }));

  if (todayData.length === 0) {
    return {
      maxTemp: null,
      minTemp: null,
      avgTemp: null,
      closestWeather: {
        time: null,
        SKY: null,
        PTY: null
      }
    };
  }

  // 최고온도, 최저온도, 평균온도 계산
  const temperatures = todayData.map((entry) => entry.TMP);
  const maxTemp = Math.max(...temperatures);
  const minTemp = Math.min(...temperatures);
  const avgTemp = Number((temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length).toFixed(1));

  // 현재 시간과 가장 가까운 시간대 찾기
  const closestTime = todayData.reduce((prev, curr) => {
    const timeDiffPrev = Math.abs(parseInt(prev.time, 10) - parseInt(currentTime, 10));
    const timeDiffCurr = Math.abs(parseInt(curr.time, 10) - parseInt(currentTime, 10));
    return timeDiffPrev <= timeDiffCurr ? prev : curr;
  });

  return {
    maxTemp,
    minTemp,
    avgTemp,
    closestWeather: {
      time: closestTime.time,
      SKY: closestTime.SKY,
      PTY: closestTime.PTY
    }
  };
};
