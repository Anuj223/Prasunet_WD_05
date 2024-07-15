const city = document.querySelector(".city-input");
const Searchbtn = document.querySelector(".search-btn");
const Locationbtn = document.querySelector(".location-btn");
const weathercards = document.querySelector(".weather-cards")
const currentweather = document.querySelector(".current-weather")
const API_key = ; // palced a api key here


const createWeatherCard = (cityName,weatherItem,index) =>{
        if(index === 0){
                return `<div class="details">
                              <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                              <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                              <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
                              <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                        </div>
                        <div class="icon">
                                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon"
                                        <h4>${weatherItem.weather[0].description}</h4>
                        </div>`
        }else{
        return `<li class="cards">
                                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                                    <h4>Wind: ${weatherItem.wind.speed}</h4>
                                    <h4>Humidity: ${weatherItem.main.humidity}</h4>
                              </li>`
        }
}

const getWeatherDetails= (cityName,lat,lon) => {
        const weather_api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`

        fetch(weather_api).then(res => res.json()).then(data => {
        const unqForcecast =[];
        const fiveday = data.list.filter(forecast =>{
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if(!unqForcecast.includes(forecastDate)){
                        return unqForcecast.push(forecastDate);
                }
        })
        city.value = "";
        weathercards.innerHTML = "";
        currentweather.innerHTML ="";
        fiveday.forEach((weatherItem,index) => {
                if(index === 0)
                        currentweather.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
                else
               weathercards.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
        });

        }).catch(()=>{
                alert("An error ocurred while fetching the weather forecast");
        });

}

const getCityCoordinates = () =>{
        const cityName = city.value.trim();
        if(!cityName)
                return;
        const geo_api =`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`

        fetch(geo_api).then(res => res.json()).then(data => {
                if(!data.length) 
                        return alert(`An error ocuured while loading the city ${cityName}`);
                const { name,lat,lon } = data[0];
                getWeatherDetails(name,lat,lon);
        }).catch(()=>{
                alert("An error ocurred while fetching the data");
        })
}

Locationbtn.addEventListener("click",()=>{
        navigator.geolocation.getCurrentPosition(
                position =>{
                        const { latitude,longitude} = position.coords;
                        const REV_geo_url =`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`
                        fetch(REV_geo_url).then(res => res.json()).then(data => {
                                if(!data.length) 
                                        return alert(`An error ocuured while loading the city ${cityName}`);
                                const { name } = data[0];
                                getWeatherDetails(name,latitude,longitude);
                        }).catch(()=>{
                                alert("An error ocurred while fetching the city name");
                        })
                },
                error =>{
                        if(error.code === error.PERMISSION_DENIED){
                                alert("Location Permission Denied")
                        }
                        
                }
        )
})

Searchbtn.addEventListener("click",getCityCoordinates)
city.addEventListener("keyup",e => e.key === "Enter" && getCityCoordinates())