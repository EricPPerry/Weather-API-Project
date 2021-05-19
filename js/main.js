const getData = async (city_name) => {

    const key = '7b3d4b67be408e9edb3095cced38b10a'
    
    console.log(isNaN(city_name))
    let current_response
    let forecast_response
    //Checks if value entered is NaN (which treats it like a word/city name) or a number (which treats it like a zipcode)
    //Pulls current weatherinfo
    if(isNaN(city_name)){
        current_response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&units=imperial&appid=${key}`)
    } else{
        current_response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${city_name}&units=imperial&appid=${key}`)
    }

    //Sets longitude/latitude to be used for 4-day forecast
    longitude = current_response.data.coord.lon
    latitude = current_response.data.coord.lat

    console.log(longitude)
    console.log(latitude)
    //pulls 4-day forecast
    forecast_response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&units=imperial&appid=${key}`)
    console.log(current_response.data)
    return create_weather([current_response.data, forecast_response.data])
}

//Has a list of cities, picks one to be used as the starter weather info when the page is loaded for the first time
const starter_weather = () => {
    let cities = [
    'London', 
    'New York City', 
    'Paris', 
    'Moscow', 
    'Tokyo',
    'Dubai',
    'Singapore',
    'Barcelona',
    'Boston'
    ]
    let random_city = cities[Math.floor(Math.random() * cities.length)];
    return random_city
}


//Sets references for class names that will be used in html inserts
const DOM_ELEMENTS = {
    current_weather_row: '.current-weather-row',
    forecast_row: '.forecast-row',
    weather_img_row: '.weather-img-row',
}


//uses that 3-character weather code the API uses, in order to determine weather-type and day/night status
//switch/case that sets image to be used, depending on what weather code is provided by api
const set_image = (weatherid) => {
    switch(weatherid){
        case '01d':{
            return `<img src="images/clearday.jpg" alt="weather image" class="img-fluid">`
        }

        case '01n':{
            return `<img src="images/clearnight.jpg" alt="weather image" class="img-fluid">`
        }

        case '02d':{
            return `<img src="images/slightcloud.jpg" alt="weather image" class="img-fluid">`
        }

        case '02n':{
            return `<img src="images/slightcloudnight.jpg" alt="weather image" class="img-fluid">`
        }

        case '03d':{
            return `<img src="images/slightcloud.jpg" alt="weather image" class="img-fluid">`
        }

        case '03n':{
            return `<img src="images/slightcloudnight.jpg" alt="weather image" class="img-fluid">`
        }

        case '04d':{
            return `<img src="images/cloudy.jpg" alt="weather image" class="img-fluid">`
        }

        case '04n':{
            return `<img src="images/slightcloudnight.jpg" alt="weather image" class="img-fluid">`
        }

        case '09d':{
            return `<img src="images/rain.jpg" alt="weather image" class="img-fluid">`
        }

        case '09n':{
            return `<img src="images/rain.jpg" alt="weather image" class="img-fluid">`
        }

        case '10d':{
            return `<img src="images/rain.jpg" alt="weather image" class="img-fluid">`
        }

        case '10n':{
            return `<img src="images/rain.jpg" alt="weather image" class="img-fluid">`
        }

        case '11d':{
            return `<img src="images/thunder.jpg" alt="weather image" class="img-fluid">`
        }

        case '11n':{
            return `<img src="images/thunder.jpg" alt="weather image" class="img-fluid">`
        }

        case '13d':{
            return `<img src="images/snow.jpg" alt="weather image" class="img-fluid">`
        }

        case '14n':{
            return `<img src="images/snownight.jpg" alt="weather image" class="img-fluid">`
        }

        case '50d':{
            return `<img src="images/fog.jpg" alt="weather image" class="img-fluid">`
        }

        case '50n':{
            return `<img src="images/fognight.jpg" alt="weather image" class="img-fluid">`
        }
    }
}


//Similar to set_image function, sets weather_text string to be inserted into HTML
const set_weather_text = (weathertextid) => {
    switch(weathertextid){
        case '01d':{
            return `Clear Sun`
        }

        case '01n':{
            return `Clear Night`
        }

        case '02d':{
            return `Few Clouds`
        }

        case '02n':{
            return `Few Clouds`
        }

        case '03d':{
            return `Cloudy`
        }

        case '03n':{
            return `Cloudy`
        }

        case '04d':{
            return `Heavy Clouds`
        }

        case '04n':{
            return `Heavy Clouds`
        }

        case '09d':{
            return `Rain`
        }

        case '09n':{
            return `Rain`
        }

        case '10d':{
            return `Rain`
        }

        case '10n':{
            return `Rain`
        }

        case '11d':{
            return `Thunderstorm`
        }

        case '11n':{
            return `Thunderstorm`
        }

        case '13d':{
            return `Snow`
        }

        case '14n':{
            return `Snow`
        }

        case '50d':{
            return `Fog`
        }

        case '50n':{
            return `Fog`
        }
    }
}

//sets up window with all weather info 
const create_weather = (response) => {
    //runs function to clear first, to get rid of any pre-existing info/html in relevant elements
    clear_data()
    document.getElementById('full-body-bg').classList.add('bg-secondary')
    



    current_response = response[0]
    weather_icon_status = current_response.weather[0].icon
    current_display_time = ''

    forecast_response = response[1].daily
    console.log(forecast_response)
    //based on api formatting, checks for status to either be d (daytime) or not (nighttime)
    if(weather_icon_status[2] == 'd'){
        current_display_time = 'daytime'
        console.log(weather_icon_status[0]+weather_icon_status[1])
        } else{
            current_display_time = 'nighttime'
            console.log(weather_icon_status)
        }
    
    const weather_img_html = set_image(weather_icon_status)
    const weather_text = set_weather_text(weather_icon_status)

    document.querySelector(DOM_ELEMENTS.weather_img_row).insertAdjacentHTML('beforeend', weather_img_html)
    
    //sets HTML for current weather based on current, min/max temps and weather icon
    const html = `
    <div class="col-12">
          <h4>Current Weather: ${weather_text}</h4>
        </div>
    <div class="row mb-3 mt-3">
    <div class="col-6"><h5>Location:</h5> ${current_response.name}</div>
    <div class="col-6"><h5>Humidity</h5> ${current_response.main.humidity}%</div>
    </div>
    <div class="row mb-3 mt-3">
    <div class="col-6"><h5>Current Temp:</h5> ${Math.round(current_response.main.temp)}&#730; F</div>
    <div class="col-6"><img src="https://openweathermap.org/img/wn/${weather_icon_status}@2x.png" alt="current weather" class="weather-preview mx-auto my-auto"></div>
    </div>
    <div class="row mb-3 mt-3">
    <div class="col-6"><h5>Hi</h5> ${Math.round(current_response.main.temp_max)}&#730; F</div>
    <div class="col-6"><h5>Lo</h5> ${Math.round(current_response.main.temp_min)}&#730; F</div>
    </div>
    `

    document.querySelector(DOM_ELEMENTS.current_weather_row).insertAdjacentHTML('beforeend', html)

    

    let forecast_counter = 0
    let day_name = ''
    for(element of forecast_response){
        if(forecast_counter == 0){
            day_name = 'Today'
        } else if(forecast_counter == 1){
            day_name = 'Tomorrow'
        } else{
            forecast_counter_pos = `+${forecast_counter} Day`
            day_name = forecast_counter_pos
        }
        let forecast_html = `
        <div>
        <div class="row border d-flex justify-content-center">
            ${day_name}
        </div>
        <div class="row border">
        <div class="col-6">
        <div class="col-12">
        Hi: ${Math.round(element.temp.max)}
        </div>
        <div class="col-12">
        Lo: ${Math.round(element.temp.min)}
        </div>
        </div>
        <div class="col-6">
        <div class="col-12">
        <img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="current weather" class="weather-preview img-fluid mx-auto d-block"></div></div></div></div>`
        document.querySelector(DOM_ELEMENTS.forecast_row).insertAdjacentHTML('beforeend',forecast_html)
        forecast_counter++
        if(forecast_counter >4){
            break
        }
    }
    

}

//Is called by 'Show Forecast' button, passes in user-provided string to generate weather with getData()
const load_data = () => {
    let query_city = document.getElementById("city_name").value
    getData(query_city)
}

//Clears existing data, is run at the beginning of each pull of weather info 
const clear_data = () => {
    document.querySelector(DOM_ELEMENTS.forecast_row).innerHTML = ''
    document.querySelector(DOM_ELEMENTS.weather_img_row).innerHTML = ''
    document.querySelector(DOM_ELEMENTS.current_weather_row).innerHTML = ''
}

//Generates weather for a random location upon first load of page
getData(starter_weather())