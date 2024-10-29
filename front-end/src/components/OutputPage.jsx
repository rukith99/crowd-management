import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Image, Statistic, Button, Row, Col, Modal, Form, Input, Select, message } from 'antd';
import ReactMarkdown from "react-markdown";
import { createClient } from '@supabase/supabase-js';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const supabaseUrl = 'https://natrlcbqqexhazwcmovd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHJsY2JxcWV4aGF6d2Ntb3ZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTQwMTE3NiwiZXhwIjoyMDQ0OTc3MTc2fQ.VlHoE88TFgB6_GYKMcwABC3PYIaZIZ5HfPhg7cV_ayg';

const supabase = createClient(
  supabaseUrl, supabaseKey
);

const OutputPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareForm] = Form.useForm();

  const location = useLocation();
  const { data } = location.state || {};

  const eventTypeOptions = [
    { value: 'Educational', label: 'Educational' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Political', label: 'Political' },
    { value: 'Religious', label: 'Religious' },
    { value: 'Sport', label: 'Sport' },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showShareModal = () => {
    setIsShareModalVisible(true);
  };

  const handleShareCancel = () => {
    setIsShareModalVisible(false);
    shareForm.resetFields();
  };

  const handleShareOk = (values) => {
    message.success('Emails sent successfully!');
    setIsShareModalVisible(false);
    shareForm.resetFields();
  };

  const handleOk = async () => {
    setIsSubmitting(true);

    try {
      const { data: insertData, error } = await supabase
        .from('events')
        .insert([
          {
            title: eventTitle,
            type: eventType,
            status: Status,
            imageUrl: imageUrl,
            prediction: Predictions,
            suggestion: Suggestions,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      message.success('Event saved successfully!');
      setIsModalVisible(false);
    } catch (error) {
      message.error(`Error saving event: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  if (!data) {
    return <div style={{ color: '#fff', textAlign: 'center' }}>No data available</div>;
  }

  const { Predictions, Status, Suggestions, HeatmapImageUrl } = data;
  const imageUrl = `http://127.0.0.1:5000${HeatmapImageUrl}`;

  const inputStyleMid = {
    width: '100%',
    backgroundColor: '#efefef',
    color: '#191919',
    height: '40px',
  };

  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#fff',
      color: '#191919',
      minHeight: '100vh',
      boxSizing: 'border-box',
      borderRadius: '12px',
    }}>

      <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
        <Col>
          <div style={{ width: '400px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <Title level={1} style={{ textAlign: 'left', color: '#191919', marginTop: '0px', marginBottom: '0px' }}>Event Predictions</Title>
            </div>
            <div style={{ backgroundColor: '#BFF4BE', padding: '8px', color: 'green', borderRadius: '8px' }}>
              {Status === "Succes" || Status === "Succes" ? "Succes" : Status}
            </div>
          </div>
        </Col>
        <Col>
          <Button
            type="primary"
            size='large'
            style={{ color: '#ff7b00', borderColor: '#ff7b00', backgroundColor: '#fff', marginRight: '20px' }}
            onClick={showShareModal}
          >
            Share with Other Personnel
          </Button>
          <Button
            type="primary"
            size='large'
            style={{ backgroundColor: '#ff7600', borderColor: '#ff7600' }}
            onClick={showModal}
          >
            Save Event
          </Button>
        </Col>
      </Row>

      {HeatmapImageUrl && (
        <div style={{ width: '100%', display: 'block', textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <strong style={{ fontSize: '24px', color: '#191919' }}>Possible Crowd Density Heatmap</strong>
          </div>
          <div>
            <Image
              src={imageUrl}
              alt="Event Heatmap"
              style={{
                width: '100%',
                border: '2px solid #777',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '40px' }}>
        <Statistic
          title="Fatalities"
          value={Predictions[0]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        <Statistic
          title="Injuries"
          value={Predictions[1]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        <Statistic
          title="Possible Maximum Entrances at Peak Time"
          value={Predictions[2]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        <Statistic
          title="Possible Maximum Exits at Peak Time"
          value={Predictions[3]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        <Statistic
          title="Population at Special Place 01"
          value={Predictions[4]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        <Statistic
          title="Population at Special Place 02"
          value={Predictions[5]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
        <Statistic
          title="Population at Other Places"
          value={Predictions[6]}
          valueStyle={{ color: '#191919' }}
          style={{ backgroundColor: '#efefef', padding: '20px', borderRadius: '8px', marginBottom: '20px', flexBasis: '49%', fontWeight: 'bold' }}
        />
      </div>

      <div
        style={{
          padding: '20px',
          backgroundColor: '#f9f9fb',
          borderRadius: '8px',
          marginBottom: '20px',
          marginTop: '20px'
        }}
      >
        <Paragraph style={{ color: '#191919' }}>
          <div style={{ display: 'block', marginTop: '20px' }}>
            <div style={{ marginBottom: '20px'}}>
              <strong style={{ fontSize: '24px' }}>Event Analysis</strong>
            </div>
            <div style={{ fontSize: '16px' }}>
              <ReactMarkdown>{Suggestions}</ReactMarkdown>
            </div>
          </div>
        </Paragraph>
      </div>

      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false}
        centered
      >
        <Title level={3} style={{ textAlign: 'left', color: '#191919', marginTop: '0px', marginBottom: '24px' }}>Save Event</Title>
        <Form {...layout} onFinish={handleOk}>
          <div style={{ display: 'block' }}>
            <Text style={{ color: '#191919', fontSize: '14px' }}>Event Title</Text>
            <Form.Item rules={[{ required: true, message: 'Please input the event title!' }]}>
              <Input value={eventTitle} style={inputStyleMid} onChange={(e) => setEventTitle(e.target.value)} />
            </Form.Item>
          </div>
          <div style={{ display: 'block' }}>
            <Text style={{ color: '#191919', fontSize: '14px' }}>Event Type</Text>
            <Form.Item rules={[{ required: true, message: 'Please select the event type!' }]}>
              <Select value={eventType} style={inputStyleMid} onChange={(value) => setEventType(value)}>
                {eventTypeOptions.map((option) => (
                  <Option value={option.value} key={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" htmlType="submit" size='large' style={{ width: '100%', backgroundColor: '#ff7600', borderColor: '#ff7600' }} loading={isSubmitting}>
              Complete Saving
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isShareModalVisible}
        onCancel={handleShareCancel}
        footer={null}
        maskClosable={false}
        centered
      >
        <Title level={3} style={{ textAlign: 'left', color: '#191919', marginTop: '0px', marginBottom: '24px' }}>Share with Other Personnel</Title>
        <Form form={shareForm} layout="vertical" onFinish={handleShareOk}>
          <Form.Item
            label="Security Personnel Email"
            name="securityEmail"
            rules={[
              { required: true, message: 'Please input the email address!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input placeholder="Enter email address" style={inputStyleMid}/>
          </Form.Item>
          <Form.Item
            label="Emergency Responders Email"
            name="emergencyEmail"
            rules={[
              { required: true, message: 'Please input the email address!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input placeholder="Enter email address" style={inputStyleMid}/>
          </Form.Item>
          <Form.Item
            label="Venue Operators Email"
            name="venueEmail"
            rules={[
              { required: true, message: 'Please input the email address!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input placeholder="Enter email address" style={inputStyleMid}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size='large' style={{ width: '100%', backgroundColor: '#ff7600', borderColor: '#ff7600' }}>
              Send Emails
            </Button>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default OutputPage;
