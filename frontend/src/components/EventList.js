import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + '/api/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item key={event.EventId} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={event.ImageUrl || 'https://via.placeholder.com/400x200'}
                alt={event.Title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.Title}
                </Typography>
                <Typography>
                  {event.Description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Date: {new Date(event.EventDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {event.Location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registrations: {event.CurrentRegistrations}/{event.MaxParticipants}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  component={RouterLink}
                  to={`/events/${event.EventId}`}
                  variant="contained"
                  fullWidth
                >
                  View Details
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default EventList; 