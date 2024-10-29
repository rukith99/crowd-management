import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Typography, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

import educationalImage from '../assets/educational.jpg';
import entertainmentImage from '../assets/entertainment.jpg';
import politicalImage from '../assets/political.jpg';
import religiousImage from '../assets/religious.jpg';
import sportImage from '../assets/sport.jpg';

const { Title } = Typography;
const { Meta } = Card;

// Initialize Supabase client
const supabaseUrl = 'https://natrlcbqqexhazwcmovd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHJsY2JxcWV4aGF6d2Ntb3ZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTQwMTE3NiwiZXhwIjoyMDQ0OTc3MTc2fQ.VlHoE88TFgB6_GYKMcwABC3PYIaZIZ5HfPhg7cV_ayg';

const supabase = createClient(supabaseUrl, supabaseKey);

const defaultImage = 'https://via.placeholder.com/200';

const EventList = () => {
  const navigate = useNavigate();

  const eventTypeImages = {
    Educational: educationalImage,
    Entertainment: entertainmentImage,
    Political: politicalImage,
    Religious: religiousImage,
    Sport: sportImage,
  };

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from('events').select('*');

        if (error) {
          console.error('Error fetching events:', error);
          message.error('Error fetching events.');
        } else {
          setEvents(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching events:', error);
        message.error('Unexpected error fetching events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleNewEvent = () => {
    navigate('/create-event');
  };

  const handleCardClick = (event) => {
    navigate(`/event-details/${event.id}`, { state: { event } });
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div
      className="event-list-container"
      style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        minHeight: '46vw',
      }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
        <Col>
          <Title level={2} style={{ color: '#191919', fontWeight: 'bold' }}>
            My Events
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={handleNewEvent}
            size='large'
            style={{ backgroundColor: '#ff7600', borderColor: '#ff7600'}} // Orange button
          >
            New Event
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {events.map((event) => {
          const eventTypeName = event.type || 'Other/Unknown';
          const imageUrl = eventTypeImages[event.type] || defaultImage;

          let statusColor = '';
          let statusText = '';

          if (event.status === 'Succes') {
            statusColor = 'green';
            statusText = 'Success';
          } else if (event.status === 'Error') {
            statusColor = 'red';
            statusText = 'Error';
          } else {
            statusColor = 'gray';
            statusText = 'Unknown';
          }

          return (
            <Col xs={24} sm={12} md={8} key={event.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={eventTypeName}
                    src={imageUrl}
                    style={{ height: '140px', objectFit: 'cover' }}
                  />
                }
                onClick={() => handleCardClick(event)}
              >
                <Meta
                  title={event.title}
                  description={
                    <>
                      <p style={{ margin: '8px 0' }}>
                        <strong>Event Type:</strong> {eventTypeName}
                      </p>
                      <p style={{ margin: '8px 0' }}>
                        <strong>Date:</strong> {event.created_at}
                      </p>
                      <Tag color={statusColor}>{statusText}</Tag>
                    </>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default EventList;
