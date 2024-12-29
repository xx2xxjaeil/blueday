import React from 'react';

// material-ui
import { Box, ButtonBase, Card, CircularProgress, List, styled, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

// project imports
import { userLocation } from '../../context/LocationContext';
import { latLonToGrid } from '../../utils/LatLonToGrid';
import { getWeather } from '../../services/WeatherService/Weather';
import { getCoordinateToAddress } from '../../services/MapService/Map';
import { WeatherCard, SearchField } from '../../components';
import MainWeatherCard from '../../components/MainWeatherCard.jsx';
import BookmarkCard from '../../components/BookmarkCard.jsx';

// styles
const TodayWeatherList = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  overflowX: 'scroll'
}));

const TodayWeatherLoadingBox = styled(Box)(() => ({
  height: 174,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const TodayWeatherErrorBox = styled(Box)(() => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  zIndex: 1,
  opacity: 0.8,
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const updateState = (setter, data = null, loaded = false, error = false) => {
  setter({ data, loaded, error });
};

/**
 * Home view
 * @returns {Element}
 * @constructor
 */
const Home = () => {
  const location = userLocation();

  const [address, setAddress] = React.useState({ data: null, loaded: false, error: false });
  const [todayWeather, setTodayWeather] = React.useState({ data: null, loaded: false, error: false });

  React.useEffect(() => {
    if (!location?.loaded) return;
    const latLng = latLonToGrid(location.latitude, location.longitude);
    const { x, y } = latLng;
    fetchWeather(x, y);
    fetchAddress(location.latitude, location.longitude);
  }, [location?.loaded]);

  // 주소 정보 조회
  const fetchAddress = async (latitude, longitude) => {
    try {
      const addressResponse = await getCoordinateToAddress(latitude, longitude);
      updateState(setAddress, addressResponse, true, false);
    } catch (error) {
      console.error('[Home][fetchAddress] 에러 발생:', error);
      updateState(setAddress, null, true, true);
    }
  };

  // 날씨 정보 조회
  const fetchWeather = async (nx, ny) => {
    updateState(setTodayWeather, null, false, false);
    try {
      const todayWeatherResponse = await getWeather(nx, ny);
      updateState(setTodayWeather, todayWeatherResponse, true, false);
    } catch (error) {
      console.error('[Home][fetchWeather] 에러 발생:', error);
      updateState(setTodayWeather, null, true, true);
    }
  };

  const [bookmarks, setBookmarks] = React.useState([]);

  React.useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(bookmarks);
  }, []);

  const handleBookmark = (address) => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    const currentBookmark = address; // searchAddress 전체 데이터를 저장
    const isCurrentlyBookmarked = bookmarks.some((bookmark) => bookmark.address_name === currentBookmark.address_name);
    if (isCurrentlyBookmarked) {
      // 이미 저장된 경우 삭제
      const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.address_name !== currentBookmark.address_name);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarks(updatedBookmarks);
    } else {
      // 저장되지 않은 경우 추가
      bookmarks.push(currentBookmark);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setBookmarks(bookmarks);
    }
  };

  const [selectedBookmark, setSelectedBookmark] = React.useState(null);

  // render
  return (
    <Box p={2}>
      <Box position="relative">
        {todayWeather.error && (
          <TodayWeatherErrorBox>
            <ButtonBase onClick={() => fetchWeather(location.latitude, location.longitude)}>
              <Typography variant="h4" fontWeight="bold" mr={1}>
                재시도
              </Typography>
              <RefreshIcon />
            </ButtonBase>
          </TodayWeatherErrorBox>
        )}
        {/* 오늘 날씨 정보 */}
        <MainWeatherCard address={address} todayWeather={todayWeather} />

        {/* 오늘 시간별 온도 정보 */}
        <Card sx={{ mt: 2 }}>
          {!todayWeather.loaded && (
            <TodayWeatherLoadingBox>
              <CircularProgress color="gray" />
            </TodayWeatherLoadingBox>
          )}

          {todayWeather.loaded && todayWeather.data?.list && (
            <Box pt={1}>
              <Typography variant="caption" pl={2}>
                시간대 별 날씨
              </Typography>
              <TodayWeatherList>
                {Object.entries(todayWeather.data.list).map(([key, weather], index) => (
                  <WeatherCard key={`today-weather-${index}-card`} weather={{ time: key, ...weather }} />
                ))}
              </TodayWeatherList>
            </Box>
          )}
        </Card>
      </Box>

      <Box mt={2}>
        {/* 주소 검색 영역 */}
        <SearchField handleBookmark={handleBookmark} searchBookmark={selectedBookmark} />
      </Box>

      {bookmarks.length > 0 && (
        <Box mt={2}>
          <Card>
            <Box pt={1}>
              <Typography variant="caption" pl={2}>
                즐겨찾기
              </Typography>
              <TodayWeatherList>
                {bookmarks.map((bookmark, index) => {
                  return (
                    <BookmarkCard key={`bookmark-${index}-card`} address={bookmark} handleClick={(addr) => setSelectedBookmark(addr)} />
                  );
                })}
              </TodayWeatherList>
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Home;
