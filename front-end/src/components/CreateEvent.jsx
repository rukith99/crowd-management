import React, { useState } from 'react';
import { Form, Input, Button, Upload, Modal, message, Spin, Result } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import for the map
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const OPENWEATHER_API_KEY = 'a22e1b80052ed4d05411dd7a8840598e';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    user_input_country: '',
    user_input_event_type: '',
    user_input_month: '',
    user_input_year: '',
    user_input_crowd_size: '',
    user_input_entrance_symbol: '',
    user_input_exit_symbol: '',
    user_input_area_A: '',
    user_input_area_B: '',
    user_input_other: '',
    user_input_description: '',
  });
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [position, setPosition] = useState(null);
  const navigate = useNavigate();
  const { TextArea } = Input;

  const LocationSelector = ({ setPosition }) => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return null;
  };

  // Function to process weather data and get daily summaries
  const processWeatherData = (data) => {
    const dailyData = {};

    data.list.forEach((entry) => {
      const date = entry.dt_txt.split(' ')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          feels_like_temps: [],
          humidities: [],
          pressures: [],
          wind_speeds: [],
          visibilities: [],
          conditions: [],
        };
      }
      dailyData[date].temps.push(entry.main.temp);
      dailyData[date].feels_like_temps.push(entry.main.feels_like);
      dailyData[date].humidities.push(entry.main.humidity);
      dailyData[date].pressures.push(entry.main.pressure);
      dailyData[date].wind_speeds.push(entry.wind.speed);
      dailyData[date].visibilities.push(entry.visibility);
      dailyData[date].conditions.push(entry.weather[0].description);
    });

    const today = new Date().toISOString().split('T')[0];

    const dates = Object.keys(dailyData)
      .filter((date) => date >= today)
      .sort()
      .slice(0, 2);

    // Create summaries
    const summaries = dates.map((date) => {
      const data = dailyData[date];
      const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

      return {
        date,
        avg_temp: avg(data.temps).toFixed(2),
        avg_feels_like: avg(data.feels_like_temps).toFixed(2),
        avg_humidity: avg(data.humidities).toFixed(2),
        avg_pressure: avg(data.pressures).toFixed(2),
        avg_wind_speed: avg(data.wind_speeds).toFixed(2),
        avg_visibility: avg(data.visibilities).toFixed(2),
        conditions: [...new Set(data.conditions)],
      };
    });

    return summaries;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!fileList.length || !fileList[0].originFileObj) {
      message.error('Please upload an image before submitting.');
      return;
    }

    if (!position) {
      message.error('Please select a location on the map.');
      return;
    }

    setModalVisible(true);
    setLoading(true);

    try {
      const { lat, lng } = position;
      const weatherResponse = await axios.get(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            lat: lat,
            lon: lng,
            units: 'metric',
            appid: OPENWEATHER_API_KEY,
          },
        }
      );

      const weatherData = weatherResponse.data;

      const dailySummaries = processWeatherData(weatherData);

      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      formDataToSend.append('image', fileList[0].originFileObj);

      formDataToSend.append('latitude', lat);
      formDataToSend.append('longitude', lng);

      formDataToSend.append('weather_data', JSON.stringify(dailySummaries));

      const response = await axios.post('http://127.0.0.1:5000/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      setApiStatus('success');

      setTimeout(() => {
        setModalVisible(false);
        navigate('/output', { state: { data: response.data } });
      }, 2000);
    } catch (error) {
      setLoading(false);
      setApiStatus('error');
      console.error('Error submitting form:', error);

      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Error: ${error.response.data.message}`);
      } else {
        message.error('An error occurred while submitting the form.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = ({ file, fileList: newFileList }) => {
    if (newFileList.length > 1) {
      message.error('You can only upload one image.');
      return;
    }

    setFileList(newFileList);

    if (file.status === 'done' || file.status === 'removed') {
      setFormData((prevData) => ({
        ...prevData,
        image: file.originFileObj || null,
      }));
    }
  };

  const inputStyleFull = {
    width: '600px',
    backgroundColor: '#efefef',
    color: '#191919',
    height: '40px',
  };

  const inputStyleMid = {
    width: '280px',
    backgroundColor: '#efefef',
    color: '#191919',
    height: '40px',
  };

  return (
    <div
      className="create-event-container"
      style={{ color: '#191919', backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}
    >
      <h1 style={{ color: '#191919', marginTop: '0px', marginBottom: '20px' }}>Create Event</h1>
      <Form layout="vertical">
        <div
          style={{
            padding: '20px',
            backgroundColor: '#f9f9fb',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ color: '#191919', marginBottom: '20px', marginTop: '0px' }}>
            Generic Details
          </h2>
          <div style={{ display: 'flex', width: '600px', justifyContent: 'space-between' }}>
            <Form.Item
              label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Country</span>}
              name="user_input_country"
              rules={[{ required: true, message: 'Please enter the country' }]}
            >
              <Input
                name="user_input_country"
                value={formData.user_input_country}
                onChange={handleInputChange}
                style={inputStyleMid}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Event Type</span>}
              name="user_input_event_type"
              rules={[{ required: true, message: 'Please enter the event type' }]}
            >
              <Input
                name="user_input_event_type"
                value={formData.user_input_event_type}
                onChange={handleInputChange}
                style={inputStyleMid}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', width: '600px', justifyContent: 'space-between' }}>
            <Form.Item
              label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Month</span>}
              name="user_input_month"
              rules={[{ required: true, message: 'Please enter the month' }]}
            >
              <Input
                name="user_input_month"
                value={formData.user_input_month}
                onChange={handleInputChange}
                style={inputStyleMid}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Year</span>}
              name="user_input_year"
              rules={[{ required: true, message: 'Please enter the year' }]}
            >
              <Input
                name="user_input_year"
                value={formData.user_input_year}
                onChange={handleInputChange}
                style={inputStyleMid}
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Estimated Crowd Size</span>}
            name="user_input_crowd_size"
            rules={[{ required: true, message: 'Please enter the crowd size' }]}
          >
            <Input
              name="user_input_crowd_size"
              value={formData.user_input_crowd_size}
              onChange={handleInputChange}
              style={inputStyleFull}
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ color: '#3a3a3c', fontSize: '16px' }}>
                Description About Event
              </span>
            }
            name="user_input_description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea
              rows={4}
              name="user_input_description"
              value={formData.user_input_description}
              onChange={handleInputChange}
              style={inputStyleFull}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Select Location on Map</span>}
            required
          >
            <div style={{ height: '400px' }}>
              <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: '100%' }}
                maxBounds={[[-90, -180], [90, 180]]}
                maxBoundsViscosity={1.0}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  noWrap={true}
                />
                <LocationSelector setPosition={setPosition} />
                {position && <Marker position={[position.lat, position.lng]} />}
              </MapContainer>
            </div>
          </Form.Item>
        </div>

        <div
          style={{
            padding: '20px',
            backgroundColor: '#f9f9fb',
            borderRadius: '8px',
            marginBottom: '60px',
          }}
        >
          <h2 style={{ color: '#191919', marginBottom: '20px', marginTop: '0px' }}>
            Ground Plan Specification
          </h2>

          <Form.Item
            label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Upload Ground Plan</span>}
          >
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleFileChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <div style={{ display: 'flex', width: '600px', justifyContent: 'space-between' }}>
            <Form.Item
              label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Entrance Area</span>}
              name="user_input_entrance_symbol"
              rules={[{ required: true, message: 'Please enter the entrance symbol' }]}
            >
              <Input
                name="user_input_entrance_symbol"
                value={formData.user_input_entrance_symbol}
                onChange={handleInputChange}
                style={inputStyleMid}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Exit Area</span>}
              name="user_input_exit_symbol"
              rules={[{ required: true, message: 'Please enter the exit symbol' }]}
            >
              <Input
                name="user_input_exit_symbol"
                value={formData.user_input_exit_symbol}
                onChange={handleInputChange}
                style={inputStyleMid}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', width: '600px', justifyContent: 'space-between' }}>
            <Form.Item
              label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Special Area 01</span>}
              name="user_input_area_A"
              rules={[{ required: true, message: 'Please enter Area A' }]}
            >
              <Input
                name="user_input_area_A"
                value={formData.user_input_area_A}
                onChange={handleInputChange}
                style={inputStyleMid}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Special Area 02</span>}
              name="user_input_area_B"
              rules={[{ required: true, message: 'Please enter Area B' }]}
            >
              <Input
                name="user_input_area_B"
                value={formData.user_input_area_B}
                onChange={handleInputChange}
                style={inputStyleMid}
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span style={{ color: '#3a3a3c', fontSize: '16px' }}>Other Area</span>}
            name="user_input_other"
          >
            <Input
              name="user_input_other"
              value={formData.user_input_other}
              onChange={handleInputChange}
              style={inputStyleFull}
            />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Form.Item>
            <Button onClick={handleSubmit} style={{ color: '#ff7b00', borderColor: '#ff7b00' }} size="large">
              Clear Fields
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ background: '#ff7b00', marginLeft: '20px' }}
              size="large"
            >
              Analyze Event
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Modal visible={modalVisible} footer={null} closable={false}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <p>Submitting your event, please wait...</p>
          </div>
        ) : apiStatus === 'success' ? (
          <Result status="success" title="Event Created Successfully!" />
        ) : (
          <Result status="error" title="Event Submission Failed" />
        )}
      </Modal>
    </div>
  );
};

export default CreateEvent;
