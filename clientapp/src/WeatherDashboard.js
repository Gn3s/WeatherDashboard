import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment';

const WeatherDashboard = ({ updateInterval = 60000 }) => {
    const [weatherData, setWeatherData] = useState([]);

    const colorMap = {
        'New York': '#8884d8',
        'London': '#82ca9d'
    };

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await axios.get('http://localhost:5153/api/weather');
                const data = response.data.map(entry => ({
                    city: entry.city,
                    temperature: parseFloat((entry.temperature - 273.15).toFixed(2)),  // Convert Kelvin to Celsius and round to 2 decimal places
                    time: moment(entry.lastUpdateTime).utc().format('HH:mm:ss') // Convert to UTC format
                }));
                setWeatherData(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
        const intervalId = setInterval(fetchWeatherData, updateInterval); // Update every minute
        return () => clearInterval(intervalId);
    }, [updateInterval]);

    const CustomTooltip = ({ payload, label, active }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    {payload.map((entry, index) => (
                        <p key={`item-${index}`} className="label" style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value}°C`}
                        </p>
                    ))}
                </div>
            );
        }

        return null;
    };

    // Function to reduce the number of ticks on the X-axis
    const getFilteredData = (data) => {
        const filteredData = [];
        const interval = Math.ceil(data.length / 10); // Show only 10 ticks
        for (let i = 0; i < data.length; i += interval) {
            filteredData.push(data[i]);
        }
        return filteredData;
    };

    const cityDataMap = Object.keys(colorMap).reduce((acc, city) => {
        acc[city] = getFilteredData(weatherData.filter(entry => entry.city === city));
        return acc;
    }, {});

    const renderCustomLegend = () => {
        return (
            <div style={{ marginTop: 30 }}>
                {Object.keys(colorMap).map(city => (
                    <div key={city} style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                        <svg width="10" height="10">
                            <rect width="10" height="10" fill={colorMap[city]} />
                        </svg>
                        <span style={{ marginLeft: 5 }}>{city}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <h2>Weather Dashboard</h2>
            <LineChart width={800} height={400} data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ angle: -45, textAnchor: 'end' }} interval="preserveStartEnd" />
                <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderCustomLegend} />
                {Object.keys(cityDataMap).map(city => (
                    <Line
                        key={city}
                        type="monotone"
                        data={cityDataMap[city]}
                        dataKey="temperature"
                        name={city}
                        stroke={colorMap[city]}
                        dot
                    />
                ))}
            </LineChart>
        </div>
    );
};

export default WeatherDashboard;
