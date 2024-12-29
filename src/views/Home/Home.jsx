import React from 'react';

// material-ui
import { Box, ButtonBase, Card, CircularProgress, List, Skeleton, Stack, styled, Typography } from '@mui/material';
import NearMeIcon from '@mui/icons-material/NearMe';
import NearMeDisabledIcon from '@mui/icons-material/NearMeDisabled';
import RefreshIcon from '@mui/icons-material/Refresh';

// project imports
import { userLocation } from '../../context/LocationContext';
import { latLonToGrid } from '../../utils/LatLonToGrid';
import { getWeather } from '../../services/WeatherService/Weather';
import { getCoordinateToAddress } from '../../services/MapService/Map';
import { WeatherCard } from '../../components';
import { interpretWeather } from '../../utils/config';

// styles
const TodayWeatherCard = styled(Card)(({ theme }) => ({
  width: '100%',
  height: theme.spacing(27.5),
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const TodayWeatherList = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  overflowX: 'scroll'
}));

const TodayWeatherLoadingBox = styled(Box)(() => ({
  height: 141,
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

const iconStyles = {
  width: 18,
  height: 18,
  color: 'gray'
};

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

  const locationIcon = location?.loaded ? location.access ? <NearMeIcon sx={iconStyles} /> : <NearMeDisabledIcon sx={iconStyles} /> : null;

  const locationName = address.loaded ? (
    <Typography variant="h5">
      {address.data?.region_3depth_name || address.data?.region_2depth_name || address.data?.region_1depth_name || '알 수 없음'}
    </Typography>
  ) : (
    <Skeleton variant="text" />
  );

  const nowT1H = todayWeather.loaded ? <Typography variant="h4">{todayWeather?.data?.T1H}℃</Typography> : <Skeleton variant="text" />;

  const maxMinTemp = todayWeather.loaded ? (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Typography variant="subtitle2">최고: {todayWeather?.data?.maxTemp}℃</Typography>
      <Typography variant="subtitle2">최저 {todayWeather?.data?.minTemp}℃</Typography>
    </Stack>
  ) : null;

  const nowSky = todayWeather.loaded ? (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Typography variant="subtitle2">강수: {interpretWeather(todayWeather.data.PTY).pty}</Typography>
      <Typography variant="subtitle2">하늘: {interpretWeather(todayWeather.data.closestWeather?.SKY).sky}</Typography>
    </Stack>
  ) : null;

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
        <TodayWeatherCard>
          <Box>
            {locationIcon}
            {locationName}
            {nowT1H}
            {maxMinTemp}
            {nowSky}
          </Box>
        </TodayWeatherCard>

        {/* 오늘 시간별 온도 정보 */}
        <Card sx={{ mt: 2 }}>
          {!todayWeather.loaded && (
            <TodayWeatherLoadingBox>
              <CircularProgress color="gray" />
            </TodayWeatherLoadingBox>
          )}

          {todayWeather.loaded && todayWeather.data?.list && (
            <TodayWeatherList>
              {Object.entries(todayWeather.data.list).map(([key, weather], index) => (
                <WeatherCard key={`today-weather-${index}-card`} weather={{ time: key, ...weather }} />
              ))}
            </TodayWeatherList>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default Home;
