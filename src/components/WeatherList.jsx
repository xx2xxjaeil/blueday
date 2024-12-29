import { Box, List, ListItem, ListItemText } from '@mui/material';
import React from 'react';

const WeatherList = () => {
  return (
    <List sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <ListItem sx={{ width: 100, height: 100, border: '1px solid red' }}>
        <ListItemText primary="Item 1" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Item 2" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Item 3" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Item 3" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Item 3" />
      </ListItem>
    </List>
  );
};

export default WeatherList;
