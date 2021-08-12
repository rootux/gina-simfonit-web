const getWeatherData = async function() {

    // const currentJson = JSON.parse(data.body).jws.current;
    let result = {}
    try {
        // result.date = currentJson.date1; //
        // result.humidity = currentJson.humidity; // 43 (should be treated as percentage
        // result.windDir = currentJson.winddir;
        // result.windSpeed = currentJson.windspd;
        // result.temp = currentJson.temp; //Mountain temp
        // result.solarRadiation = currentJson.solarradiation // 997
        // result.uv = currentJson.uv // 7.7
        // result.bigDust = currentJson.pm10 // Big dust
        // result.smallDust = currentJson.pm25 // Small dust
    } catch (err) {
        console.error("Cant fetch weather data")
        console.error(err)
    } finally {
        return result
    }
}