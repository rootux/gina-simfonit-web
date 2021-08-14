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

let isIntro = true;

const buttonNames = ["start", "quiet",
    "wind", "earth", "radiation",
    "dust", "temperature", "humidity",
    ];

async function init() {
    document.getElementById("loadingSounds").style.display = ""
    const weather = await getWeatherData();
    console.log(weather);
    if(isIntro) {
        channels.push(makeChannel(soundIntro, false));
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

function makeChannel(url, mute, pan=0) {
    const channel = new Tone.Channel({
        pan,
        mute
    }).toDestination();
    const player = new Tone.Player({
        url,
        loop: true,
        autostart:true
    }).sync();
    player.connect(channel);
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

    buttons.quiet.addEventListener("click", function(e) {
        if(buttons.start.disabled) {
            Tone.Transport.start()
            setAllButtonsToActive()
        }else {
            Tone.Transport.pause();
            setAllButtonsToInactiveBut("quiet")
        }
    });

    setClickHandler(buttons.wind, 0);
    setClickHandler(buttons.earth, 1);
    setClickHandler(buttons.radiation, 2);
    setClickHandler(buttons.dust, 3);

}

function setClickHandler(btn, channelIndex) {
    btn.addEventListener("click", function(e) {
        const isActive = btn.classList.contains('active');
        if(!isActive) {
            btn.classList.add('active')
        } else {
            btn.classList.remove('active')
        }
        channels[channelIndex].set({solo: isActive});
    });
}