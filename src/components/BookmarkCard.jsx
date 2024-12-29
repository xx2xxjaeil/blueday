import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { ButtonBase, styled, Typography } from '@mui/material';

const Card = styled(ButtonBase)(({ theme }) => ({
  minWidth: 'fit-content',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: '4px 12px'
}));

/**
 * 북마크 카드
 * @param address
 * @param handleClick
 * @returns {Element}
 * @constructor
 */
const BookmarkCard = ({ address, handleClick }) => {
  return (
    <Card onClick={() => handleClick(address)}>
      <Typography variant="subtitle1">{address?.address}</Typography>
      <Typography variant="subtitle2">({address?.region_3depth_name})</Typography>
    </Card>
  );
};

export default BookmarkCard;

BookmarkCard.propTypes = {
  address: PropTypes.object,
  handleClick: PropTypes.func
};
