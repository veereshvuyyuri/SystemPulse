import { useState, useEffect } from 'react';

// WMO Weather interpretation codes (http://www.wmo.int/pages/prog/www/IMOP/publications/CIMO-Guide/CIMO_Guide-7th_Edition-2008-PT.html)
const getWeatherIcon = (code) => {
    if (code === 0) return '☀️'; // Clear sky
    if (code >= 1 && code <= 3) return '⛅'; // Mainly clear, partly cloudy, and overcast
    if (code >= 45 && code <= 48) return '🌫️'; // Fog and depositing rime fog
    if (code >= 51 && code <= 55) return '🌧️'; // Drizzle: Light, moderate, and dense intensity
    if (code >= 56 && code <= 57) return '🌨️'; // Freezing Drizzle: Light and dense intensity
    if (code >= 61 && code <= 65) return '🌧️'; // Rain: Slight, moderate and heavy intensity
    if (code >= 66 && code <= 67) return '🌨️'; // Freezing Rain: Light and heavy intensity
    if (code >= 71 && code <= 75) return '❄️'; // Snow fall: Slight, moderate, and heavy intensity
    if (code === 77) return '❄️'; // Snow grains
    if (code >= 80 && code <= 82) return '🌦️'; // Rain showers: Slight, moderate, and violent
    if (code >= 85 && code <= 86) return '❄️'; // Snow showers slight and heavy
    if (code === 95) return '⛈️'; // Thunderstorm: Slight or moderate
    if (code >= 96 && code <= 99) return '⛈️'; // Thunderstorm with slight and heavy hail
    return '🌈'; // Unknown
};

const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Raining';
    if (code >= 71 && code <= 77) return 'Snowing';
    if (code >= 95) return 'Thunderstorm';
    return 'Unknown';
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
                );
                const data = await response.json();
                setWeather(data.current_weather);
            } catch (err) {
                console.error("Weather fetch error:", err);
                setError("Failed to load weather");
            } finally {
                setLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    // Default to New York if permission denied
                    fetchWeather(40.71, -74.01);
                }
            );
        } else {
            fetchWeather(40.71, -74.01);
        }
    }, []);

    if (loading) return <div className="flex-center" style={{ height: '100%', color: 'var(--text-secondary)' }}>Loading...</div>;
    if (error) return <div className="flex-center" style={{ height: '100%', color: '#f87171' }}>{error}</div>;

    const icon = getWeatherIcon(weather?.weathercode);
    const description = getWeatherDescription(weather?.weathercode);

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}>{icon}</span>
                <div style={{ lineHeight: 1 }}>
                    <div style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        {Math.round(weather?.temperature)}°
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
                        {description}
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                width: '100%',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>WIND</div>
                    <div style={{ color: '#bae6fd', fontWeight: '600' }}>{weather?.windspeed} <span style={{ fontSize: '0.8em' }}>km/h</span></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>DIRECTION</div>
                    <div style={{ color: '#bae6fd', fontWeight: '600' }}>{weather?.winddirection}°</div>
                </div>
            </div>
        </div>
    );
}
