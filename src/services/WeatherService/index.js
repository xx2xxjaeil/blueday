const BASE_URL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';

export const WEATHER_FUNCTION_URL = {
  /** 초단기실황조회 API */
  GET__READ_WEATHER: `${BASE_URL}/getUltraSrtNcst`,
  /** 단기예보조회 API */
  GET__READ_FORECAST: `${BASE_URL}/getVilageFcst`
};
