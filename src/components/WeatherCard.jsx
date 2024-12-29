import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// material-ui
import { ListItem, Skeleton, styled, Typography } from '@mui/material';

// project imports
import { interpretWeather } from '../utils/config';

const WeatherListItem = styled(ListItem)(({ theme }) => ({
  width: 125,
  minWidth: 125,
  height: 125,
  minHeight: 125,
  justifyContent: 'center',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius
}));

const SkeletonText = () => <Skeleton variant="text" />;

/**
 * Weather card
 * @param weather
 * @returns {Element}
 * @constructor
 */
const WeatherCard = ({ weather }) => {
  // 시간 포맷
  const timeFormat = React.useMemo(() => {
    if (!weather?.time) return null;
    return moment(weather.time, 'YYYYMMDD HHmm').format('a hh시').replace('am', '오전').replace('pm', '오후');
  }, [weather?.time]);

  // 날씨 강수/하늘
  const weatherDescription = React.useMemo(() => {
    if (!weather) return {};
    return interpretWeather(weather.SKY, weather.PTY);
  }, [weather]);

  // 온도
  const temperature = weather?.TMP ? <Typography variant="subtitle1">{weather.TMP}℃</Typography> : <SkeletonText />;

  // 강수
  const precipitation =
    weather?.PTY !== undefined ? <Typography variant="caption">강수: {weatherDescription.pty}</Typography> : <SkeletonText />;

  // 하늘
  const sky = weather?.SKY !== undefined ? <Typography variant="caption">하늘: {weatherDescription.sky}</Typography> : <SkeletonText />;

  // render
  return (
    <WeatherListItem>
      <Typography variant="subtitle2">{timeFormat}</Typography>
      {temperature}
      {precipitation}
      {sky}
    </WeatherListItem>
  );
};

WeatherCard.propTypes = {
  weather: PropTypes.shape({
    time: PropTypes.string,
    TMP: PropTypes.string,
    PTY: PropTypes.string,
    SKY: PropTypes.string
  })
};

export default WeatherCard;
