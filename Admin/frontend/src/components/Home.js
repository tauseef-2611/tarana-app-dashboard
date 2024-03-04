import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const Home = () => {
  const [stats, setStats] = useState({});
  const [mostPlayedCategoryData, setMostPlayedCategoryData] = useState({});

  useEffect(() => {
    // Fetch stats from the server
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error.message);
      }
    };

    // Fetch most played category data from the server
    const fetchMostPlayedCategoryData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/most-played-category`);
        setMostPlayedCategoryData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching most played category data:', error.message);
      }
    };

    fetchStats();
    fetchMostPlayedCategoryData();
  }, []);

  const mostPlayedCategoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="container mt-4">
      <Row>
      <Col md={4}>
    <Card>
      <Card.Body>
        <Card.Title>Total Music Count</Card.Title>
        <Card.Text className="display-4 font-weight-bold text-primary">{stats.totalMusicCount}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
  <Col md={4}>
    <Card>
      <Card.Body>
        <Card.Title>Total Playlist Count</Card.Title>
        <Card.Text className="display-4 font-weight-bold text-success">{stats.totalPlaylistCount}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
  <Col md={4}>
    <Card>
      <Card.Body>
        <Card.Title>Total Play Count</Card.Title>
        <Card.Text className="display-4 font-weight-bold text-danger">{stats.totalPlayCount}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
      </Row>
      


      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Most Played Category</Card.Title>
              {mostPlayedCategoryData.labels && mostPlayedCategoryData.data ? (
                      <div className="chart-container" style={{ height: '300px', position: 'relative' }}>

                <Doughnut
                  data={{
                    labels: mostPlayedCategoryData.labels,
                    datasets: [
                      {
                        data: mostPlayedCategoryData.data,
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.8)',
                          'rgba(54, 162, 235, 0.8)',
                          'rgba(255, 206, 86, 0.8)',
                          'rgba(75, 192, 192, 0.8)',
                          'rgba(153, 102, 255, 0.8)',
                        ],
                      },
                    ],
                  }}
                  options={mostPlayedCategoryChartOptions}
                />
                </div>
              ) : (
                <p>No most played category data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- Chart goes here --> */}
    </div>
  );
};

export default Home;
