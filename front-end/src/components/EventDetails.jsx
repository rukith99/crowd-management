import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Image, Statistic, Button, Row, Col, message } from 'antd';
import ReactMarkdown from 'react-markdown';
import { createClient } from '@supabase/supabase-js';

const { Title, Paragraph } = Typography;

// Initialize Supabase client
const supabaseUrl = 'https://natrlcbqqexhazwcmovd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHJsY2JxcWV4aGF6d2Ntb3ZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTQwMTE3NiwiZXhwIjoyMDQ0OTc3MTc2fQ.VlHoE88TFgB6_GYKMcwABC3PYIaZIZ5HfPhg7cV_ayg';

const supabase = createClient(supabaseUrl, supabaseKey);

const EventDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch event data from Supabase
  useEffect(() => {
    const fetchEvent = async () => {
      console.log('Fetching event with id:', id);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching event:', error);
          message.error(`Error fetching event data: ${error.message}`);
        } else if (!data) {
          console.error('No event data found.');
          message.error('No event data found.');
        } else {
          console.log('Fetched event data:', data);
          setEvent(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching event:', error);
        message.error(`Unexpected error fetching event data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading event details...</div>;
  }

  if (!event) {
    return (
      <div>
        <p>Error loading event data.</p>
        <Button onClick={handleBack}>Back to Events</Button>
      </div>
    );
  }

  // Extract attributes from event data
  const {
    title,
    event_type,
    status,
    imageUrl,
    prediction,
    suggestion,
  } = event;

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: '#fff',
        color: '#191919',
        minHeight: '100vh',
        boxSizing: 'border-box',
        borderRadius: '12px',
      }}
    >
      <Button
        type="link"
        onClick={handleBack}
        style={{ marginBottom: '20px', padding: 0 }}
      >
        &lt; Back
      </Button>

      <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
        <Col>
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px',
            }}
          >
            <div>
              <Title
                level={1}
                style={{
                  textAlign: 'left',
                  color: '#191919',
                  marginTop: '0px',
                  marginBottom: '0px',
                }}
              >
                {title}
              </Title>
            </div>
            <div
              style={{
                backgroundColor: '#BFF4BE',
                padding: '8px',
                color: 'green',
                borderRadius: '8px',
              }}
            >
              {status}
            </div>
          </div>
        </Col>
      </Row>

      {imageUrl && (
        <div
          style={{
            width: '100%',
            display: 'block',
            textAlign: 'left',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <strong style={{ fontSize: '24px', color: '#191919' }}>
              Possible Crowd Density Heatmap
            </strong>
          </div>
          <div>
            <Image
              src={imageUrl}
              alt="Event Heatmap"
              style={{
                width: '100%',
                border: '2px solid #777',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>
      )}

      {prediction && Array.isArray(prediction) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginTop: '40px',
          }}
        >
          <Statistic
            title="Fatalities"
            value={prediction[0]}
            valueStyle={{ color: '#191919' }}
            style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold'}}
          />
          <Statistic
          title="Injuries"
          value={prediction[1]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        <Statistic
          title="Possible Maximum Entrances at Peak Time"
          value={prediction[2]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        <Statistic
          title="Possible Maximum Exits at Peak Time"
          value={prediction[3]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        <Statistic
          title="Population at Special Place 01"
          value={prediction[4]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        <Statistic
          title="Population at Special Place 02"
          value={prediction[5]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        <Statistic
          title="Population at Other Places"
          value={prediction[6]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        </div>
      )}

      {suggestion && (
        <Paragraph style={{ color: '#191919' }}>
          <div style={{ display: 'block', marginTop: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <strong style={{ fontSize: '24px' }}>Event Analysis</strong>
            </div>
            <div style={{ fontSize: '16px' }}>
              <ReactMarkdown>{suggestion}</ReactMarkdown>
            </div>
          </div>
        </Paragraph>
      )}
    </div>
  );
};

export default EventDetails;
