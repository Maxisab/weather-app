//USE IP DATA FROM USER TO DISPLAY DEFAULT
const userLocation = (data) => {
  const { lat, lng } = data.location

  let latLon = `lat=${lat}&lon=${lng}`
  getWeatherData(latLon)
  getCityName(latLon)
  // console.log(data)
}

//FETCH IP LOCATION FOR DEFAULT VIEW
const getIPData = async (ip) => { 
  const url = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_2nKUG70FDc42eF0S1Wo7CraMOYU1K&ipAddress='
  fetch(url)
      .then(res => res.json())
      .then(data => userLocation(data))
}

//FETCH CITY COORDINATES DATA FROM OPENWEATHER
const getCityLocation = async (city) => {
  const url = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=fd275eec94ba2113fdf01b7e5cfb6818'
  fetch(url)
    .then(res => res.json())
    // .then(data => saveName()) 
    .then(data => cityCheck(data))
}

//FETCH WEATHER DATA FROM OPENWEATHER
const getWeatherData = async (latLon) => {
  const url = 'https://api.openweathermap.org/data/2.5/onecall?' + latLon + '&units=imperial&exclude=hourly,minutely&appid=fd275eec94ba2113fdf01b7e5cfb6818'
  fetch(url)
    .then(res => res.json())
    .then(data => populateWeather(data))
} 

//GRAB CITY FROM SEARCH AND SEND TO FETCH
const query = document.forms[0]
query.addEventListener('submit', function(e){
  e.preventDefault()
  const city = query.querySelector('input[type="text"]').value.trim()
  console.log(city)
  getCityLocation(city)
  document.querySelector('.city-list').innerHTML = ''
})

//GRAB LAT/LON FROM CITY 
const getLatLon = (data) => {
  const { lat, lon } = data[0]
  
  let latLon = `lat=${lat}&lon=${lon}`
  return latLon
}

//SELECT CITY FROM SEARCH DROPDOWN/CLEAR LI
const dropdownSelect = (e) => {
  document.querySelector('input').classList.remove('dropdown')
  document.querySelector('.city-list').classList.add('hidden')
  getWeatherData(e.target.getAttribute('data-latlon'))
  getCityName(e.target.getAttribute('data-latlon'))
  document.querySelector('.city-list').innerHTML = ''
}

//EVENT LISTENER FOR DROPDOWN
document.querySelector('.city-list').addEventListener('click', dropdownSelect)

//FUNCTION CREATES LI DYNAMICALLY FOR CITY-LIST UL
const createLi = (data) => {
  const { name, state, country, lat, lon } = data
  let ul = document.querySelector('.city-list')
  let li = document.createElement('li')
  li.classList.add('droplist')
  li.setAttribute('data-latlon', `lat=${lat}&lon=${lon}`)
  ul.appendChild(li)
  li.textContent =`${name}, ${state}, ${country}`
}

//DISPLAY LIST OF CITIES UNDER SEARCH
const cityList = (data) => {
  console.log(data)
  for(let i = 0; i < data.length; i++) {
    createLi(data[i])
  }
  document.querySelector('input').classList.add('dropdown')
  document.querySelector('.city-list').classList.remove('hidden')
}

//CHECK FOR MULTIPLE CITIES
const cityCheck = (data) => {
  //GRAB LAT/LON IF SEARCH RETURNS ONE CITY AND THEN RUN WEATHER FETCH
  if (data.length === 1) {
    const latLon = getLatLon(data)
    getWeatherData(latLon)
    getCityName(latLon)

    //MULTIPLE CITIES CHECK
  } else if (data.length > 1) {
    cityList(data)
  }
}

//GET NAME OF DAY FROM TIME STAMP
const getDayName = (dt) => {
  const dayIndex = new Date(dt*1000).getUTCDay()
    const dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let dayName = dayArray[dayIndex]
    return dayName
}

//POPULATE DAILY WEATHER INFO TO DOM
const dailyWeather = (data) => {
  console.log(data)
  for(let i = 0; i < data.daily.length-1; i++) {
    let j = i+1
    const { day, night } = data.daily[i].temp
    const { icon, description } = data.daily[i].weather[0]
    const { dt } = data.daily[i]
    document.querySelector('#name-'+ j).textContent = getDayName(dt)
    document.querySelector('#day-'+ j).textContent = `${day}${String.fromCharCode(176)}F / ${night}${String.fromCharCode(176)}F`
    document.querySelector('#dicon-'+ j).setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png')
    document.querySelector('#ddescription-'+ j).textContent = description
  }
}

//POPULATE WEATHER INFO TO DOM
const populateWeather = (data) => {
  const { temp } = data.current
  const { icon, description } = data.current.weather[0]
  document.querySelector('.ctemp').textContent = `${temp}F`
  document.querySelector('.cicon').setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '@2x.png')
  document.querySelector('.cdescription').textContent = description
  dailyWeather(data)
}

//GET CITY NAME FROM LAT/LON FOR USE IN DOM
const getCityName = async (latLon) => {
  const url = 'http://api.openweathermap.org/geo/1.0/reverse?' + latLon + '&limit=1&appid=fd275eec94ba2113fdf01b7e5cfb6818'
  fetch(url)
    .then(res => res.json()) 
    .then(data => cityName(data))
}

//POPULATE CITY NAME FROM GETCITYNAME FETCH
const cityName = (data) => {
  console.log(data)
  const { name, country, } = data[0]
  document.querySelector('.current-city').textContent = `${name}, ${country}`
}

getIPData()


  
  