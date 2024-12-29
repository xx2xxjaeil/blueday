import axios from 'axios';
import { MAP_FUNCTION_URL } from './index';

const API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

// 좌표를 주소로 변환
export const getCoordinateToAddress = async (latitude, longitude) => {
  try {
    const response = await axios.get(MAP_FUNCTION_URL.GET__COORDINATE_TO_ADDRESS, {
      headers: {
        Authorization: `KakaoAK ${API_KEY}`
      },
      params: {
        x: longitude, // 경도
        y: latitude // 위도
      }
    });
    const address = response.data?.documents?.[0];

    if (address) {
      return address;
    } else {
      console.warn('주소를 찾을 수 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
};

// 주소를 좌표로 변환
export const getAddressToCoordinate = async (address) => {
  try {
    const response = await axios.get(MAP_FUNCTION_URL.GET__ADDRESS_TO_COORDINATE, {
      headers: {
        Authorization: `KakaoAK ${API_KEY}`
      },
      params: {
        query: address
      }
    });
    const coordinate = response.data?.documents?.[0]?.address;

    if (coordinate) {
      return coordinate;
    } else {
      console.warn('좌표를 찾을 수 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
};
