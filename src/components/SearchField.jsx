import React from 'react';

// material-ui
import { Box, Divider, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

// project imports
import { getAddressToCoordinate } from '../services/MapService/Map';
import { getWeather } from '../services/WeatherService/Weather';
import { latLonToGrid } from '../utils/LatLonToGrid';
import { MainWeatherCard } from './index';
import PropTypes from 'prop-types';

/**
 * 주소 검색 필드
 * @returns {Element}
 * @constructor
 */
const SearchField = ({ handleBookmark, searchBookmark }) => {
  const [search, setSearch] = React.useState('');

  const [searchAddress, setSearchAddress] = React.useState({ data: null, loaded: false, error: false });
  const [searchWeather, setSearchWeather] = React.useState({ data: null, loaded: false, error: false });
  const [searchCompleted, setSearchCompleted] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  // 북마크 검색
  React.useEffect(() => {
    if (!searchBookmark) return;
    handleComplete(searchBookmark);
  }, [searchBookmark]);

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSearch = () => {
    new window.daum.Postcode({
      oncomplete: handleComplete
    }).open();
  };

  const handleComplete = async (data) => {
    setSearch(data);
    const response = await getAddressToCoordinate(data.address).catch((error) => ({ error }));

    if (response.error) {
      console.error('[SearchField][handleComplete] 에러 발생:', response.error);
      setSearchAddress({ data: null, loaded: true, error: true });
      return;
    }

    setSearchAddress({ data: { ...response, address: data.address }, loaded: true, error: false });
    const latLng = latLonToGrid(response.y, response.x);
    fetchWeather(latLng.x, latLng.y);
    setSearchCompleted(true);
  };

  // 날씨 정보 조회
  const fetchWeather = async (nx, ny) => {
    setSearchWeather({ data: null, loaded: false, error: false });
    try {
      const todayWeatherResponse = await getWeather(nx, ny);
      setSearchWeather({ data: todayWeatherResponse, loaded: true, error: false });
    } catch (error) {
      console.error('[SearchField][fetchWeather] 에러 발생:', error);
      setSearchWeather({ data: null, loaded: true, error: true });
    }
  };

  const clickToBookmark = () => {
    handleBookmark(searchAddress.data);
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const currentBookmark = searchAddress.data; // searchAddress 전체 데이터를 저장
    const isCurrentlyBookmarked = bookmarks.some((bookmark) => bookmark.address_name === currentBookmark.address_name);
    setIsBookmarked(isCurrentlyBookmarked);
  };

  React.useEffect(() => {
    if (searchAddress.loaded && searchAddress.data) {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
      const bookmarked = bookmarks.some((bookmark) => bookmark.address_name === searchAddress.data.address_name);
      setIsBookmarked(bookmarked);
    }
  }, [searchAddress]);

  return (
    <Box>
      <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          value={search?.address ?? ''}
          placeholder="Search for Addresses"
          inputProps={{ 'aria-label': 'search for Addresses' }}
          onClick={handleSearch}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        {search && (
          <>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={clickToBookmark}>
              {isBookmarked ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </>
        )}
      </Paper>
      {searchCompleted && (
        <Box mt={2}>
          <MainWeatherCard showLocationIcon={false} address={searchAddress} todayWeather={searchWeather} />
        </Box>
      )}
    </Box>
  );
};

export default SearchField;

SearchIcon.propTypes = {
  handleBookmark: PropTypes.func,
  searchBookmark: PropTypes.object
};
