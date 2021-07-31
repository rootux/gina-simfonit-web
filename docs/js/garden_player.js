let inited = false;
let channels = []
let buttons = {}
window.player = {}

let soundA = "/sounds/seoul.mp3"
let soundB = "/sounds/london.mp3"
let soundC = "/sounds/tokyo.mp3"

async function init() {
    channels.push(makeChannel(soundA, false));
    channels.push(makeChannel(soundB, false));
    channels.push(makeChannel(soundC, false));
    setAllButtonsToActive();
    inited = true;
}

function setAllButtonsToActive(){
    buttons.windDir.classList.add('active');
    buttons.windSpeed.classList.add('active');
    buttons.waterStatus.classList.add('active');
}

function setAllButtonsToInactive() {

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

function setBtns(state) {
    const windDir = getById("wind_dir");
    const windSpeed = getById("wind_speed");
    const quiet = getById("quiet");
    const waterStatus = getById("water_status");
    windDir.disabled = state;
    quiet.disabled = state;
    windSpeed.disabled = state;
    waterStatus.disabled = state;
}

window.player.init = function() {
    console.log("Loaded")
    buttons.start = getById("all");
    buttons.windDir = getById("wind_dir");
    buttons.windSpeed = getById("wind_speed");
    buttons.waterStatus = getById("water_status");
    buttons.quiet = getById("quiet");
    setBtns(true);

    buttons.start.addEventListener("click", async function(e) {
        await Tone.start()
        if (!inited) await init();
        Tone.Transport.start()
        setBtns(false);
        buttons.start.disabled = true;
    });

    buttons.quiet.addEventListener("click", function(e) {
        Tone.Transport.stop();
        buttons.start.disabled = false;
        setBtns(true);
    });

    setClickHandler(buttons.windDir, 0);
    setClickHandler(buttons.windSpeed, 1);
    setClickHandler(buttons.waterStatus, 2);
}

function setClickHandler(btn, channelIndex) {
    btn.addEventListener("click", function(e) {
        const isActive = btn.classList.contains('active');
        if(!isActive) {
            btn.classList.add('active')
        } else {
            btn.classList.remove('active')
        }
        channels[channelIndex].set({mute: isActive});
    });
}