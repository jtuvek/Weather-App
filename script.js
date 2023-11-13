document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const searchHistoryDiv = document.getElementById('search-history');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const cityName = cityInput.value.trim();
        if (cityName) {
            getCoordinatesAndWeather(cityName);
        }
    });

    function getCoordinatesAndWeather(city) {
        const apiKey = 'e3cc80e747ac2d6ed947b53878651b5e';
        const coordinateUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        fetch(coordinateUrl)
            .then(response => response.json())
            .then(data => {
                const { lat, lon } = data.coord;
                getWeatherData(lat, lon);
                saveToLocalStorage(city);
            })
            .catch(error => console.error('Error fetching coordinates:', error));
    }

    function getWeatherData(lat, lon) {
        const apiKey = 'e3cc80e747ac2d6ed947b53878651b5e';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function kelvinToFahrenheit(kelvin) {
        return ((kelvin - 273.15) * 9/5) + 32;
    }
    

    function displayWeather(data) {
        const forecastDiv = document.getElementById('forecast');
        forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
    
        const uniqueDays = new Set();
    
        data.list.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayOfWeek = getDayOfWeek(date);
            const temperatureFahrenheit = kelvinToFahrenheit(day.main.temp);
    
            if (!uniqueDays.has(dayOfWeek)) {
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');
                forecastItem.innerHTML = `
                    <p>Day: ${dayOfWeek}</p>
                    <p>Date: ${day.dt_txt}</p>
                    <p>Temperature: ${temperatureFahrenheit.toFixed(2)} °F</p>
                    <p>Humidity: ${day.main.humidity} %</p>
                    <p>Wind Speed: ${day.wind.speed} m/s</p>
                `;
                forecastDiv.appendChild(forecastItem);
                uniqueDays.add(dayOfWeek);
            }
        });
    }
    

    function getDayOfWeek(dateString) {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return 'Invalid Date';
        }
        const options = { weekday: 'long' };
        return date.toLocaleDateString('en-US', options);
    }
    
    
    function saveToLocalStorage(city) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            displaySearchHistory();
        }
    }

    function displaySearchHistory() {
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistoryDiv.innerHTML = '<h2>Search History</h2>';
        searchHistory.forEach(city => {
            searchHistoryDiv.innerHTML += `<p class="history-item">${city}</p>`;
        });

        const historyItems = document.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            item.addEventListener('click', function () {
                getCoordinatesAndWeather(item.textContent);
            });
        });
    }

    // Load search history from local storage when the page loads
    displaySearchHistory();
});
