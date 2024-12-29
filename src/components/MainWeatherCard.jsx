import { Box, Card, Skeleton, Stack, styled, Typography } from '@mui/material';
import React from 'react';
import NearMeIcon from '@mui/icons-material/NearMe';
import NearMeDisabledIcon from '@mui/icons-material/NearMeDisabled';
import { interpretWeather } from '../utils/config.js';
import { userLocation } from '../context/LocationContext.jsx';
import PropTypes from 'prop-types';

const TodayWeatherCard = styled(Card)(({ theme }) => ({
  width: '100%',
  height: theme.spacing(27.5),
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const iconStyles = {
  width: 18,
  height: 18,
  color: 'gray'
};

/**
 * 메인 화면 날씨 카드
 * @param address
 * @param todayWeather
 * @returns {Element}
 * @constructor
 */
const MainWeatherCard = ({ showLocationIcon = true, address, todayWeather }) => {
  const location = userLocation();

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

  // 날씨 강수/하늘
  const weatherDescription = React.useMemo(() => {
    if (!todayWeather.loaded) return {};
    return interpretWeather(todayWeather.data.closestWeather?.SKY, todayWeather.data.closestWeather?.PTY);
  }, [todayWeather]);

  const nowSky = todayWeather.loaded ? (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Typography variant="subtitle2">강수: {weatherDescription.pty}</Typography>
      <Typography variant="subtitle2">하늘: {weatherDescription.sky}</Typography>
    </Stack>
  ) : null;

  return (
    <TodayWeatherCard>
      <Box>
        {showLocationIcon && locationIcon}
        {locationName}
        {nowT1H}
        {maxMinTemp}
        {nowSky}
      </Box>
    </TodayWeatherCard>
  );
};

export default MainWeatherCard;

MainWeatherCard.propTypes = {
  showLocationIcon: PropTypes.bool,
  address: PropTypes.object,
  todayWeather: PropTypes.object
};
