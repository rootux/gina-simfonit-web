let inited = false;
let channels = []
let buttons = {}
window.player = {}

let soundIntro = "/sounds/intro.mp3"
let soundA = "/sounds/T1.mp3"
let soundB = "/sounds/T2.mp3"
let soundC = "/sounds/T3.mp3"
let soundD = "/sounds/TBass.mp3"
let soundE = "/sounds/v10.mp3"

let introPlayer;
let isIntro = true;
let introEffects;

const buttonNames = ["start",
    "wind", "radiation",
    "dust", "temperature", "humidity",
    ];

// Linear conversion
const mapRange = (oldValue, oldMin, oldMax, newMin, newMax) => {
    const oldRange = (oldMax - oldMin)
    const newRange = (newMax - newMin)
    return (((oldValue - oldMin) * newRange) / oldRange) + newMin
}

function setSliders(weather) {
    getById('dust_slider').attributes.value.value = weather.bigDust;
    getById('humidity_slider').attributes.value.value = weather.humidity;
    getById('temperature_slider').attributes.value.value = weather.temperature;
    getById('wind_slider').attributes.value.value = weather.windSpeed;
    getById('radiation_slider').attributes.value.value = weather.solarRadiation;
}

async function getWeatherAsEffects(weather) {
    return {
        solarRadiation: mapRange(weather.solarRadiation, 0, 1000, 750, 220), // 0 is night time. autofilter
        //windDirection: mapWindDir(weather.windDir); //0 - 50. Panning
        windSpeed: mapRange(weather.windSpeed, 0, 50, 0, 1),
        bigDust: mapRange(weather.bigDust, 0, 300, 0, 1), //Distortion
        humidity: mapRange(weather.humidity, 0, 100, 0, 1), // 100 cause it's Percentage
        temperature: mapRange(weather.temperature, -20, 50, 0, 30), // -20 to 50 degrees //TODO: -20 might not be a good no reverb time - perhaps a different mapping is needed where 25 degrees is normal
    }
}

async function init() {
    document.getElementById("loadingSounds").style.display = ""
    const weather = await getWeatherData();
    setWeatherText(weather);
    const weatherAsEffects = await getWeatherAsEffects(weather);
    setSliders(weather);
    console.log(weather);
    if(isIntro) {
        channels.push(makeChannel(soundIntro, false));
        initIntroEffects(weatherAsEffects);
    } else {
        channels.push(makeChannel(soundA, false));
        channels.push(makeChannel(soundB, false));
        channels.push(makeChannel(soundC, false));
        channels.push(makeChannel(soundD, false));
        channels.push(makeChannel(soundE, false));
    }
    setAllButtonsToActive();
    inited = true;
    Tone.loaded().then(() => {
        document.getElementById("loadingSounds").style.display = "none"
        console.log("Loaded all sounds")
    })
}

function setWeatherText(weather) {
    document.getElementById('weather_data').innerText = `Wind direction: " + ${weather.windDir}
    Speed: ${weather.windSpeed}
    Dust: ${weather.bigDust}
    `
}

function setAllButtonsToActive(){
    Object.keys(buttons).forEach((button) => {
        buttons[button].disabled = false;
        buttons[button].classList.add('active');
    })
}

function setAllButtonsToInactiveBut(btnToKeepActive) {
    Object.keys(buttons).forEach((button) => {
        if(button !== btnToKeepActive) {
            buttons[button].disabled = true;
            buttons[button].classList.remove('active');
        }
    })
}

function initIntroEffects(weatherAsEffects) {
    introEffects = new Array(5).fill(0).map(() => ({}));
    const autoFilter = new Tone.AutoFilter("20n");//weatherAsEffects.solarRadiation);
    autoFilter.wet = 0;
    autoFilter.toDestination();
    //new Tone.Source().chain(autoFilter, Tone.Master);
    introEffects[0] = {effect: autoFilter, status: false};
    const distortion = new Tone.Distortion(weatherAsEffects.bigDust)//.toDestination();
    distortion.wet = 0;
    distortion.toDestination();
    introEffects[1] = {effect: distortion, status: false};
    //const reverb = new Tone.Reverb({preDelay: 10, decay: 30});
    const reverb = new Tone.JCReverb(0.2);
    reverb.wet = 1;
    reverb.toDestination();
    introEffects[2] = {effect: reverb, status: false};
}

function startIntroEffect(channelIndex) {
    let introChannel = introEffects[channelIndex];
    if(!introChannel.status) {
        //introChannel.effect.wet.rampTo(1, 3); // 1 second
        introPlayer.connect(introChannel.effect);
        introChannel.effect.wet = 1;
        //const oscillator = new Tone.Oscillator().connect(introChannel.effect).start();

        //introChannel.effect.start();
    }else {
        introChannel.effect.wet = 0;
        //introChannel.effect.wet.rampTo(0, 3); // 1 second
        introPlayer.disconnect(introChannel.effect);
        //introChannel.effect.stop();
    }
    introChannel.status = !introChannel.status;
}

function makeChannel(url, mute, pan=0) {
    const channel = new Tone.Channel({
        pan,
        mute
    }).toDestination();
    if(isIntro) {
        introPlayer = new Tone.Player({
            url,
            loop: true,
            autostart: true
        }).sync();
        introPlayer.connect(channel);
    }else {
        const player = new Tone.Player({
            url,
            loop: true,
            autostart: true
        }).sync();
        player.connect(channel);
    }

    return channel;
}

function getById(id) {
    return document.getElementById(id);
}

window.player.init = function() {
    console.log("Loading sounds")
    init()
    Object.values(buttonNames).forEach((button) => {
        buttons[button] = getById(button);
    })
    setAllButtonsToInactiveBut("start")

    buttons.start.addEventListener("click", async function(e) {
        await Tone.start()
        if (!inited) await init();
        Tone.Transport.start()
        setAllButtonsToActive()
        buttons.start.disabled = true;
    });

    // buttons.quiet.addEventListener("click", function(e) {
    //     if(buttons.start.disabled) {
    //         Tone.Transport.start()
    //         setAllButtonsToActive()
    //     }else {
    //         Tone.Transport.pause();
    //         setAllButtonsToInactiveBut()
    //     }
    // });

    setClickHandler(buttons.radiation, 0);
    setClickHandler(buttons.dust, 1);
    setClickHandler(buttons.temperature, 2);

    setClickHandler(buttons.wind, 3);
    setClickHandler(buttons.humidity, 4);

}

function setClickHandler(btn, channelIndex) {
    btn.addEventListener("click", function(e) {
        const isActive = btn.classList.contains('active');
        if(!isActive) {
            btn.classList.add('active')
        } else {
            btn.classList.remove('active')
        }
        if(isIntro) {
            startIntroEffect(channelIndex);
        }else {
            channels[channelIndex].set({solo: isActive});
        }
    });
}