let inited = false;
let delay;
let chorus;
let source;

window.player = {}

function init() {
    makeChannel(-)
}

function makeChannel(name, url, pan=0) {
    const channel = new Tone.Channel({
        pan
    }).toDestination();
    const player = new Tone.Player({
        url: `https://tonejs.github.io/audio/berklee/${url}.mp3`,
        loop: true
    }).sync().start(0);
    player.connect(channel);

    // add a UI element
    ui({
        name,
        tone: channel,
        parent: document.querySelector("#content")
    });
}

window.player.init = function() {
    console.log("Loaded")
    const start = document.getElementById("all");
    const dry = document.getElementById("wind");
    const wet = document.getElementById("wind_speed");
    const quiet = document.getElementById("quiet");
    dry.disabled = true;
    wet.disabled = true;
    quiet.disabled = true;

    start.addEventListener("click", function(e) {
        if (!inited) init();
        dry.disabled = false;
        quiet.disabled = false;
        wet.disabled = false;
        start.disabled = true;
    });

    quiet.addEventListener("click", function(e) {
        if (!inited) init();
        source.stop()
        quiet.disabled = true;
        start.disabled = false;
        dry.disabled = true;
        wet.disabled = true;
        quiet.disabled = true;
        inited = false;
    });

    dry.addEventListener("click", function(e) {
        if (!inited) init();
        if (delay) delay.bypass = !delay.bypass;
    });

    wet.addEventListener("click", function(e) {
        if (!inited) init();
        if (chorus) chorus.bypass = false;
    });
}