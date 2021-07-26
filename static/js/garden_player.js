let inited = false;
let delay;
let chorus;
let source;
let audioContext;

window.player = {}

function init() {
    //create an audio context and load an example audio file
    initAudioContext().then(function() {
        //create an instance of Tuna by passing the AudioContext we use
        const tuna = new Tuna(audioContext);
        //create a new Tuna delay instance
        delay = new tuna.Delay({
            delayTime: 10 //a short delayTime to create a slap-back delay
        });

        chorus = new tuna.Chorus({
            rate: 5.5,
            feedback: 0.2,
            delay: 0.0045,
            bypass: 0
        });
        //connect the source to the Tuna delay
        source.connect(delay);
        //connect delay as a standard web audio node to the audio context destination
        delay.connect(audioContext.destination);

        source.connect(chorus);
        chorus.connect(audioContext.destination);
        //start playing!
        source.start(audioContext.currentTime);

        inited = true;
    });
}

/*
    This is just the boilerplate needed to load an audio file, create the audio context and provide the dry/wet button functionality
*/

function initAudioContext() {
    return new Promise(function(resolve, reject) {
        const AC = "AudioContext" in window ? AudioContext : "webkitAudioContext" in window ? webkitAudioContext : document.write("Web Audio not supported");
        audioContext = new AC();
        source = audioContext.createBufferSource();
        const format = checkAudioFormat();
        const xhr = new XMLHttpRequest();

        xhr.open("GET", "/sounds/london." + format);
        xhr.responseType = "arraybuffer";
        xhr.onload = function(e) {
            audioContext.decodeAudioData(e.target.response, function(b) {
                source.buffer = b;
                source.loop = true;
                resolve();
            });
        }
        xhr.send(null);

        xhr.open("GET", "/sounds/seoul." + format);
        xhr.responseType = "arraybuffer";
        xhr.onload = function(e) {
            audioContext.decodeAudioData(e.target.response, function(b) {
                source.buffer = b;
                source.loop = true;
                resolve();
            });
        }
        xhr.send(null);
    })

}

/*
    Check file format to use
*/

function checkAudioFormat () {
    const elem = document.createElement('audio');
    if (elem.canPlayType) {
        // if (elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
        //     return "ogg";
        // }
        if (elem.canPlayType('audio/mpeg; codecs="mp3"').replace(/^no$/, '')) {
            return "mp3";
        }
    }
    return false;
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