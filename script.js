document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('forecast');
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

    function displayWeather(data) {
        // Extract relevant data from the 'data' object
        const city = data.city.name;
        const currentWeather = data.list[0];
        const forecast = data.list.slice(1, 6); // Get the next 5 days

        // Display current weather
        currentWeatherDiv.innerHTML = `
            <h2>${city}</h2>
            <p>Date: ${currentWeather.dt_txt}</p>
            <p>Temperature: ${currentWeather.main.temp} K</p>
            <p>Humidity: ${currentWeather.main.humidity} %</p>
            <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
        `;

        // Display forecast
        forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
        forecast.forEach(day => {
            forecastDiv.innerHTML += `
                <div class="forecast-item">
                    <p>Date: ${day.dt_txt}</p>
                    <p>Temperature: ${day.main.temp} K</p>
                    <p>Humidity: ${day.main.humidity} %</p>
                    <p>Wind Speed: ${day.wind.speed} m/s</p>
                </div>
            `;
        });
    }

    function saveToLocalStorage(city) {
        // Implement code to save the searched city to local storage
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            displaySearchHistory();
        }
    }

    function displaySearchHistory() {
        // Implement code to display search history
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistoryDiv.innerHTML = '<h2>Search History</h2>';
        searchHistory.forEach(city => {
            searchHistoryDiv.innerHTML += `<p class="history-item">${city}</p>`;
        });

        // Add event listeners to history items
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
