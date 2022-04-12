//USE IP DATA FROM USER TO DISPLAY DEFAULT
// const userLocation = (data) => {

// }

//FETCH IP LOCATION FOR DEFAULT VIEW
const getIPData = async (ip) => { 
  const url = "https://geo.ipify.org/api/v2/country,city?apiKey=at_2nKUG70FDc42eF0S1Wo7CraMOYU1K" + ip
  fetch(url)
      .then(res => res.json())
      .then(data => userLocation(data))
}

//FETCH CITY COORDINATES DATA FROM OPENWEATHER
const getCityLocation = async (city) => {
  const url = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=fd275eec94ba2113fdf01b7e5cfb6818"
  fetch(url)
    .then(res => res.json())
    .then(data => cityCheck(data))
}

//FETCH WEATHER DATA FROM OPENWEATHER
const getWeatherData = async (latLon) => {
  const url = "https://api.openweathermap.org/data/2.5/onecall?" + latLon + "&units=imperial&exclude=hourly,minutely&appid=fd275eec94ba2113fdf01b7e5cfb6818"
  fetch(url)
    .then(res => res.json())
    .then(data => console.log(data))
} 

//GRAB CITY FROM SEARCH AND SEND TO FETCH
const query = document.forms[0]
query.addEventListener('submit', function(e){
  e.preventDefault()
  const city = query.querySelector('input[type="text"]').value.trim()
  console.log(city)
  getCityLocation(city)
})

//GRAB LAT/LON FROM CITY 
const getLatLon = (data) => {
  const { lat, lon } = data[0]
  
  let latLon = `lat=${lat}&lon=${lon}`
  return latLon
}

//SELECT CITY FROM SEARCH DROPDOWN
const dropdownSelect = (e) => {
  document.querySelector("input").classList.remove("dropdown")
  document.querySelector(".city-list").classList.add("hidden")
  console.log(e.target)
}

//EVENT LISTENER FOR DROPDOWN
document.querySelector(".city-list").addEventListener('click', dropdownSelect)

//DISPLAY LIST OF CITIES UNDER SEARCH
const cityList = (data) => {
  console.log(data)
  for(let i = 0; i < data.length; i++) {
  const { name, state, country } = data[i]
  document.querySelector(`#city-${i}`).textContent =`${name}, ${state}, ${country}`
  }
  document.querySelector("input").classList.add("dropdown")
  document.querySelector(".city-list").classList.remove("hidden")
}

//CHECK FOR MULTIPLE CITIES
const cityCheck = (data) => {
  //GRAB LAT/LON IF SEARCH RETURNS ONE CITY AND THEN RUN WEATHER FETCH
  if (data.length === 1) {
    const latLon = getLatLon(data)
    getWeatherData(latLon)

    //MULTIPLE CITIES CHECK
  } else if (data.length > 1) {
    cityList(data)
  }
}

// getCityLocation()