import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';

function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
  });
  const [registrationStatus, setRegistrationStatus] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to fetch event details');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/events/${eventId}/register`,
        registrationForm
      );
      setRegistrationStatus('success');
      setOpenDialog(false);
      // Refresh event data to update registration count
      const updatedEvent = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${eventId}`);
      setEvent(updatedEvent.data);
    } catch (err) {
      setRegistrationStatus('error');
      console.error('Error registering for event:', err);
    }
  };

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
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={event?.ImageUrl || 'https://via.placeholder.com/800x400'}
          alt={event?.Title}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="h1">
            {event?.Title}
          </Typography>
          <Typography variant="body1" paragraph>
            {event?.Description}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Date: {new Date(event?.EventDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Location: {event?.Location}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Available Spots: {event?.MaxParticipants - event?.CurrentRegistrations}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
              disabled={event?.CurrentRegistrations >= event?.MaxParticipants}
            >
              Register for Event
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Register for {event?.Title}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleRegistration} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={registrationForm.name}
              onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={registrationForm.email}
              onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleRegistration} variant="contained" color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>

      {registrationStatus === 'success' && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Registration successful! Check your email for confirmation.
        </Alert>
      )}
      {registrationStatus === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to register. Please try again.
        </Alert>
      )}
    </Container>
  );
}

export default EventDetail; 