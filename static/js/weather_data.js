const getWeatherData = async () => {

    const data = await fetch('https://symphonicgarden.thesymphonicgarden.workers.dev/', {
        method: 'get',
        headers: {
        },
        mode: 'cors'
    })
    const currentJson = await data.json();
    const current = currentJson.jws.current;
    let result = {}
    try {
        result.date = current.date1;
        result.humidity = current.hum; // 43 (should be treated as percentage
        result.windDir = current.winddir;
        result.windSpeed = current.windspd;
        result.temp = current.temp; //Mountain temp
        result.solarRadiation = current.solarradiation // 997
        result.uv = current.uv // 7.7
        result.bigDust = current.pm10 // Big dust
        result.smallDust = current.pm25 // Small dust
    } catch (err) {
        console.error("Cant fetch weather data")
        console.error(err)
    } finally {
        return result
    }
}