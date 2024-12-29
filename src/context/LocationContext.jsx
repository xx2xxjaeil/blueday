import React from 'react';
import PropTypes from 'prop-types';

const LocationContext = React.createContext({
  loaded: false,
  access: false,
  latitude: 0,
  longitude: 0
});
/**
 * 위치 정보를 제공하는 컨텍스트
 * @param children
 * @returns {Element}
 * @constructor
 */
export const LocationProvider = ({ children }) => {
  const [location, setLocation] = React.useState(null);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            loaded: true,
            access: true,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          // 서울 중심으로 설정
          setLocation({
            loaded: true,
            access: false,
            latitude: 37.564214,
            longitude: 127.001699
          });
          console.warn('위치정보를 허용하지 않습니다. ', error.message);
        }
      );
    }
  }, []);

  return <LocationContext.Provider value={location}>{children}</LocationContext.Provider>;
};

export const userLocation = () => React.useContext(LocationContext);

LocationProvider.propTypes = {
  children: PropTypes.node
};
