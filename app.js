let pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});

let channel;

const chat = document.getElementById("chat");

const nicknameInput = document.getElementById("nickname");

function log(text){
    const chatDiv = document.getElementById("chat");
    const msg = document.createElement("div");
    msg.textContent = text;
    chatDiv.appendChild(msg);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

/* ===== вывод сообщений в "бабблах" ===== */
function appendMessage(text, sender) {
    const chatDiv = document.getElementById("chat");
    const msg = document.createElement("div");
    msg.classList.add("message", sender); // "you" или "friend"
    msg.textContent = text;
    chatDiv.appendChild(msg);
    chatDiv.scrollTop = chatDiv.scrollHeight;
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
        appendMessage(e.data, "friend");
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
            offer.value = JSON.stringify(pc.localDescription);
        }
    };

    const offerDesc = await pc.createOffer();
    await pc.setLocalDescription(offerDesc);

    log("📡 Offer создан");
}

/* ===== ПОДКЛЮЧИТЬСЯ ===== */
async function joinRoom(){
    const offerDesc = new RTCSessionDescription(JSON.parse(offer.value));
    await pc.setRemoteDescription(offerDesc);

    pc.onicecandidate = e=>{
        if(!e.candidate){
            answer.value = JSON.stringify(pc.localDescription);
        }
    };

    const answerDesc = await pc.createAnswer();
    await pc.setLocalDescription(answerDesc);

    log("📡 Answer создан");
}

/* ===== ПРИНЯТЬ ANSWER ===== */
answer.onchange = async ()=>{
    const answerDesc = new RTCSessionDescription(JSON.parse(answer.value));
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
    const nick = nicknameInput.value || "Ты"; // если ник не введён, будет "Ты"

    appendMessage(nick + ": " + msg, "you");
    channel.send(nick + ": " + msg); // отправляем ник вместе с сообщением
    message.value="";
}
msg.classList.add("message", sender);
chatDiv.appendChild(msg);

// маленькая пауза, чтобы сработал CSS transition
setTimeout(() => {
    msg.classList.add("show");
}, 10);
function appendMessage(text, sender) {
    const chatDiv = document.getElementById("chat");
    const msg = document.createElement("div");
    msg.classList.add("message", sender); // "you" или "friend"
    msg.textContent = text;
    chatDiv.appendChild(msg);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}
channel.onmessage = e => {
    appendMessage(e.data, "friend");
};
