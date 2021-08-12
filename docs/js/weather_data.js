const getWeatherData = async function() {

    // const data = await fetch('https://symphonicgarden.thesymphonicgarden.workers.dev/?https://www.02ws.co.il/02wsjson.txt', {
    //     method: 'get',
    //     headers: {
    //         // 'x-foo': 'bar',
    //         // 'x-bar': 'foo',
    //         // 'x-cors-headers': JSON.stringify({
    //         //     // allows to send forbidden headers
    //         //     // https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
    //         //     // 'cookies': 'x=123'
    //         // })
    //     },
    //     mode: 'no-cors'
    // })
    // // allows to read all headers (even forbidden headers like set-cookies)
    // const headers = JSON.parse(data.headers.get('cors-received-headers'))
    // console.log(data)
    // console.log(data.json())
    //
    // const currentJson = JSON.parse(data.body).jws.current;
    // let result = {}
    // try {
    //     result.date = currentJson.date1; //
    //     result.humidity = currentJson.humidity; // 43 (should be treated as percentage
    //     result.windDir = currentJson.winddir;
    //     result.windSpeed = currentJson.windspd;
    //     result.temp = currentJson.temp; //Mountain temp
    //     result.solarRadiation = currentJson.solarradiation // 997
    //     result.uv = currentJson.uv // 7.7
    //     result.bigDust = currentJson.pm10 // Big dust
    //     result.smallDust = currentJson.pm25 // Small dust
    // } catch (err) {
    //     console.error("Cant fetch weather data")
    //     console.error(err)
    // } finally {
    //     return result
    // }
}