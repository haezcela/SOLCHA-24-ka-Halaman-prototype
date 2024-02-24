document.addEventListener('DOMContentLoaded', function() {
    // Retrieve farm name from localStorage
    var farmName = localStorage.getItem('farmName');

    // Update the h1 element with the farm name
    var farmNameElement = document.getElementById('farmName');
    if (farmNameElement && farmName) {
        farmNameElement.textContent = farmName + "'s Farm";
    }
    
    // Fetch weather data and update the page
    var latitude = localStorage.getItem('latitude');
    var longitude = localStorage.getItem('longitude');
    
    // Fetch weather data and update the page
    if (latitude && longitude) {
        fetchWeatherDataAndUpdate(latitude, longitude);
    }
});

function fetchWeatherDataAndUpdate(latitude, longitude) {
    var openWeatherMapAPIKey = '4bbc8c0707f55312541a493a5b8068ac'; 
    var forecastAPIUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + openWeatherMapAPIKey;
    var forecastList;
    fetch(forecastAPIUrl)
        .then(response => response.json())
        .then(data => {
            forecastList = data.list;
    
            // Group forecast data by day
            var groupedForecasts = {};
            forecastList.forEach(item => {
                var forecastTime = new Date(item.dt * 1000);
                var dayKey = forecastTime.toLocaleDateString();
                if (!groupedForecasts[dayKey]) {
                    groupedForecasts[dayKey] = [];
                }
                groupedForecasts[dayKey].push(item);
            });
    
            // Process and display forecast data for each day
            Object.keys(groupedForecasts).forEach((dayKey, index) => {
                var forecastsForDay = groupedForecasts[dayKey];
    
                sentencesArray = forecastsForDay.map(item => {
                    var forecastTime = new Date(item.dt * 1000);
                    var forecastConditions = item.weather[0].description;
                    var humidity = item.main.humidity;
                    return 'On ' + forecastTime.toLocaleDateString() + ' at ' + forecastTime.toLocaleTimeString() +
                        ', the weather will be ' + forecastConditions + ' with humidity of ' + humidity + '%.';
                });
    
                // Display forecast data for the day
                var forecastDisplay = document.createElement('div');
                forecastDisplay.innerHTML = '<h3>' + dayKey + '</h3>';
                sentencesArray.forEach(sentence => {
                    forecastDisplay.innerHTML += '<p>' + sentence + '</p>';
                });
    
                // Append forecast data to the corresponding day element
                var dayElementId = 'day' + (index + 1);
                var dayElement = document.getElementById(dayElementId);
                if (dayElement) {
                    dayElement.innerHTML = ''; // Clear previous content
                    dayElement.appendChild(forecastDisplay);
                }

            });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}
