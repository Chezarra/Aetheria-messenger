let pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

let channel;
const chat = document.getElementById("chat");

function log(text){
    chat.textContent += "\n" + text;
}

/* ===== получение канала ===== */
pc.ondatachannel = e => {
    channel = e.channel;
    setupChannel();
};

function setupChannel(){

    channel.onopen = () => {
        log("✅ Соединение установлено");
    };

    channel.onmessage = e => {
        log("Друг: " + e.data);
    };

    channel.onclose = () => {
        log("❌ Соединение закрыто");
    };
}

/* ===== СОЗДАТЬ ===== */
async function createOffer(){

    channel = pc.createDataChannel("chat");
    setupChannel();

    pc.onicecandidate = e=>{
        if(!e.candidate){
            offer.value =
            JSON.stringify(pc.localDescription);
        }
    };

    const offerDesc = await pc.createOffer();
    await pc.setLocalDescription(offerDesc);

    log("📡 Offer создан");
}

/* ===== ПОДКЛЮЧИТЬСЯ ===== */
async function joinRoom(){

    const offerDesc =
        new RTCSessionDescription(
            JSON.parse(offer.value)
        );

    await pc.setRemoteDescription(offerDesc);

    pc.onicecandidate = e=>{
        if(!e.candidate){
            answer.value =
            JSON.stringify(pc.localDescription);
        }
    };

    const answerDesc = await pc.createAnswer();
    await pc.setLocalDescription(answerDesc);

    log("📡 Answer создан");
}

/* ===== ПРИНЯТЬ ANSWER ===== */
answer.onchange = async ()=>{

    const answerDesc =
        new RTCSessionDescription(
            JSON.parse(answer.value)
        );

    await pc.setRemoteDescription(answerDesc);

    log("🤝 Соединение завершается...");
};

/* ===== ОТПРАВКА ===== */
function sendMessage(){

    if(!channel || channel.readyState !== "open"){
        log("⚠️ Канал ещё не открыт");
        return;
    }

    const msg = message.value;

    channel.send(msg);
    log("Ты: " + msg);

    message.value="";
}
