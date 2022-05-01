
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

let userForm = $('#user-form');
let searchInput = $('#searchInput');
let searchButton = $('#searchButton');
if (localStorage.getItem('recentSearches') === null) {
  localStorage.setItem('recentSearches', 'Austin,TX');
}

populateRecentSearches();
const previousSearchButtons = $('.previous-searches');
previousSearchButtons.on('click', function (event) {
  event.preventDefault();
  document.getElementById('currentForecast').innerHTML = '';
  document.getElementById('fiveDayForecast').innerHTML = '';
  let val = $(event.target).text();
  let valLength = val.length;
  console.log('AboutToSetLocalStorageFor: ' + val);
  if (val !== '') {
    localStorage.setItem('recentSearches', localStorage.getItem('recentSearches') + '|' + val);
  }

  if ((val.charAt(valLength - 3) !== ',') && (val.charAt(valLength - 4) !== ',')) {
    alert('Please enter search as City, State Code')
    searchInput.val('');
  } else {
    const apiKey = '7e1a24ad7b21da55ee7e5b079e9bdaca';
    let baseWeatherURL = 'https://api.openweathermap.org/data/2.5/onecall';
    let baseGeoURL = 'https://api.openweathermap.org/geo/1.0/direct';
    let geoEndpoint = baseGeoURL + '?q=' + val + ',US&appid=' + apiKey;
    console.log('endpoint' + geoEndpoint);
    fetch(geoEndpoint)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let weatherEndpoint = baseWeatherURL + '?lat=' + data[0].lat + '&lon=' + data[0].lon + '&appid=' + apiKey;
        console.log('WEATHER_EP: ' + weatherEndpoint);
        return fetch(weatherEndpoint);
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log('DATA: ' + JSON.stringify(data));
        getTodaysWeather(data.current);
        getForecast(data.daily);
      })
  }


})
searchButton.on('click', function (event) {
  event.preventDefault();
  document.getElementById('currentForecast').innerHTML = '';
  document.getElementById('fiveDayForecast').innerHTML = '';
  let val = searchInput.val();
  let valLength = val.length;
  console.log('AboutToSetLocalStorageFor: ' + val);
  if (val !== '') {
    localStorage.setItem('recentSearches', localStorage.getItem('recentSearches') + '|' + val);
  }

  if ((val.charAt(valLength - 3) !== ',') && (val.charAt(valLength - 4) !== ',')) {
    alert('Please enter search as City, State Code')
    searchInput.val('');
  } else {
    const apiKey = '7e1a24ad7b21da55ee7e5b079e9bdaca';
    let baseWeatherURL = 'https://api.openweathermap.org/data/2.5/onecall';
    let baseGeoURL = 'https://api.openweathermap.org/geo/1.0/direct';
    let geoEndpoint = baseGeoURL + '?q=' + val + ',US&appid=' + apiKey;
    console.log('endpoint' + geoEndpoint);
    fetch(geoEndpoint)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let weatherEndpoint = baseWeatherURL + '?lat=' + data[0].lat + '&lon=' + data[0].lon + '&appid=' + apiKey;
        console.log('WEATHER_EP: ' + weatherEndpoint);
        return fetch(weatherEndpoint);
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log('DATA: ' + JSON.stringify(data));
        getTodaysWeather(data.current);
        getForecast(data.daily);
      })
  }


});

function populateRecentSearches() {

  const recentSearches = localStorage.getItem('recentSearches');
  let recentSearchesArr;

  if (recentSearches !== '' && recentSearches !== null && recentSearches !== undefined) {

    recentSearchesArr = recentSearches.split('|');
  }

  if (Array.isArray(recentSearchesArr)) {
    let uniqueRecentSearchesArr = [...new Set(recentSearchesArr)];
    uniqueRecentSearchesArr.sort();
    for (let x = 0; x < uniqueRecentSearchesArr.length; x++) {
      const recentSearchButton = document.createElement('button');
      recentSearchButton.innerHTML= uniqueRecentSearchesArr[x];
      recentSearchButton.setAttribute('class','list-group-item list-group-item-action previous-searches');
      let parentSection = document.getElementById('savedLocations');
      parentSection.appendChild(recentSearchButton);
      
      

    }
  }
}


function getTodaysWeather(currentData) {

  const tempInt = parseInt(currentData.temp);
  const convertedTemp = (tempInt - 273.15) * 9 / 5 + 32;
  const roundedString = convertedTemp.toFixed(2).toString();
  let dailyConditions = ['Temp: ' + roundedString + String.fromCharCode(176) + 'F', 'UV Index: ' + currentData.uvi, 'Wind Speed: ' + currentData.wind_speed + ' MPH', 'Humidity: ' + currentData.humidity + '%'];
  for (let x = 0; x < dailyConditions.length; x++) {
    console.log('Entering loop');
    // create your LI tags dynamically
    let currentCondition = dailyConditions[x];
    let parentDiv = document.getElementById('currentForecast');
    let ul = document.createElement('ul');
    ul.setAttribute('class', 'list-group');
    ul.setAttribute('id', 'dailyConditionsUL');
    parentDiv.appendChild(ul);
    let li = document.createElement('li');
    li.innerHTML = currentCondition;
    ul.appendChild(li);

  }
}
//5 day forecast function
function getForecast(forecastData) {
  for (let x = 1; x < 6; x++) {
    let currentDay = forecastData[x];
    let d = new Date(0);
    d.setUTCSeconds(currentDay.dt);
    let noTimeDate = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear()
    const tempInt = parseInt(currentDay.temp.day);
    const convertedTemp = (tempInt - 273.15) * 9 / 5 + 32;
    let roundedString = convertedTemp.toFixed(2).toString();
    const wind = currentDay.wind_speed
    const humidity = currentDay.humidity;
    let col = document.createElement('div');
    col.setAttribute('class', 'col-md-2');
    let card = document.createElement('div');
    card.setAttribute('class', 'card');
    card.setAttribute('style', 'width: 18rem');
    let cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body');
    let dt = document.createElement('p');
    let pTemp = document.createElement('p');
    let pWind = document.createElement('p');
    let pHumidity = document.createElement('p');
    let parent = document.getElementById('fiveDayForecast');
    parent.appendChild(col);
    col.appendChild(card)
    card.appendChild(cardBody);
    dt.innerHTML = noTimeDate;
    pTemp.innerHTML = 'Temp: ' + roundedString + String.fromCharCode(176) + 'F';
    pWind.innerHTML = 'Wind: ' + wind + ' MPH';
    pHumidity.innerHTML = 'Humidity: ' + humidity + ' %';
    cardBody.appendChild(dt);
    cardBody.appendChild(pTemp);
    cardBody.appendChild(pWind);
    cardBody.appendChild(pHumidity);
  }

}







