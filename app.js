const messageInput = document.getElementById("message");
const gaugeFill = document.getElementById("gauge-fill");
const angerScore = document.getElementById("anger-score");
const toneLabel = document.getElementById("tone-label");
const warmthScore = document.getElementById("warmth-score");
const professionalScore = document.getElementById("professional-score");
const rewriteBox = document.getElementById("rewrite");
const copyButton = document.getElementById("copy-button");
const detectedWords = document.getElementById("detected-words");
const highlightPreview = document.getElementById("highlight-preview");
const rewriteMode = document.getElementById("rewrite-mode");
const courtesySlider = document.getElementById("courtesy");
const courtesyValue = document.getElementById("courtesy-value");
const gaugeScale = document.getElementById("gauge-scale");
const incidentPreset = document.getElementById("incident-preset");
const toneGoal = document.getElementById("tone-goal");
const tipsContent = document.getElementById("tips-content");
const clarityScore = document.getElementById("clarity-score");
const specificityScore = document.getElementById("specificity-score");
const requestScore = document.getElementById("request-score");
const readabilityScore = document.getElementById("readability-score");
const resetButton = document.getElementById("reset-button");
const themeToggle = document.getElementById("theme-toggle");
const languageToggle = document.getElementById("language-toggle");
const gaugeScaleLabels = gaugeScale.querySelectorAll("span");
const historyList = document.getElementById("history-list");
const clearHistoryButton = document.getElementById("clear-history");
const saveHistoryButton = document.getElementById("save-history-button");
const shareButton = document.getElementById("share-button");
const emailButton = document.getElementById("email-button");
const whatsappButton = document.getElementById("whatsapp-button");
const telegramButton = document.getElementById("telegram-button");
const instagramButton = document.getElementById("instagram-button");
const beforeMessage = document.getElementById("before-message");
const afterMessage = document.getElementById("after-message");
const whyChanged = document.getElementById("why-changed");
const messageCount = document.getElementById("message-count");

const intensifiers = ["very", "really", "extremely", "so", "too", "absolutely", "completely", "seriously"];

const politeWords = ["please", "thank you", "thanks", "appreciate", "kindly", "sorry", "understand", "could", "would"];



const aggressiveWords = [
    "idiot", "stupid", "useless", "shut up", "hate",
    "damn", "hell", "ridiculous", "pathetic", "lazy",
    "liar", "liars", "fool"
];

const confrontationalPhrases = [
    "stop ignoring me",
    "completely unfair",
    "fix this right now",
    "you never listen",
    "you always",
    "nobody is actually listening",
    "turned into an argument",
    "stop dismissing my concerns"
];

const blamePhrases = [
    "you made me", "this is your fault", "because of you", "you caused this",
    "take responsibility", "giving me excuses"
];

const dismissivePhrases = [
    "whatever", "who cares", "it doesn't matter", "you don't care", "gets ignored"
];

const pressurePhrases = [
    "do it now", "answer me now", "respond now", "how many times do I have to",
    "repeat myself over and over again", "handle it later",
    "another promise that will not be followed"
];


function updateCommunicationTips(text) {
    if (!text.trim()) {
        tipsContent.textContent = currentLanguage === "sw" ? "Vidokezo vitaonekana unapoandika." : "Tips will appear here as you type.";
        return;
    }

    const lower = text.toLowerCase();
    const tips = [];

    if (confrontationalPhrases.some(phrase => lower.includes(phrase))) {
        tips.push(currentLanguage === "sw" ? "Jaribu kubadilisha maneno ya makabiliano kuwa ombi maalum." : "Try replacing confrontational phrases with a specific request.");
    }

    if (blamePhrases.some(phrase => lower.includes(phrase))) {
        tips.push(currentLanguage === "sw" ? "Zingatia hali na athari zake badala ya kumlaumu mtu." : "Focus on the situation and its impact instead of assigning blame.");
    }

    if (dismissivePhrases.some(phrase => lower.includes(phrase))) {
        tips.push(currentLanguage === "sw" ? "Epuka maneno ya kupuuza na eleza unachohitaji kwa uwazi." : "Avoid dismissive wording and explain what you need clearly.");
    }

    if (pressurePhrases.some(phrase => lower.includes(phrase))) {
        tips.push(currentLanguage === "sw" ? "Mpe mwingine nafasi ya kujibu badala ya kumwekea shinikizo." : "Give the other person room to respond instead of creating pressure.");
    }

    if ((text.match(/!/g) || []).length >= 2) {
        tips.push(currentLanguage === "sw" ? "Punguza alama nyingi za mshangao ili ujumbe uwe mtulivu zaidi." : "Consider reducing repeated exclamation marks to make the message feel calmer.");
    }

    if (tips.length === 0) {
        tips.push(currentLanguage === "sw" ? "Ujumbe wako hauna viashiria vikubwa vya lugha. Weka ombi lako wazi na maalum." : "Your message has no major language signals. Keep the request clear and specific.");
    }

    tipsContent.innerHTML = tips.map(tip => "• " + escapeHtml(tip)).join("<br>");
}

function updateMessageQuality(text) {
    if (!text.trim()) {
        clarityScore.textContent = "0%";
        specificityScore.textContent = "0%";
        requestScore.textContent = "0%";
        readabilityScore.textContent = "0%";
        return;
    }

    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    const requestWords = currentLanguage === "sw" ? ["tafadhali", "unaweza", "naomba", "tuma", "nipe", "toa", "shiriki", "saidia", "nahitaji", "ninataka", "ombi", "nijulishe"] : ["please", "could", "would", "can", "send", "give", "provide", "share", "help", "need", "want", "request", "let me know"];
    const specificWords = currentLanguage === "sw" ? ["leo", "kesho", "tarehe", "muda", "wakati", "kwa sababu", "lini", "wapi", "nini", "jinsi", "mwisho"] : ["today", "tomorrow", "deadline", "date", "time", "because", "when", "where", "what", "how"];

    let clarity = 60;
    let specificity = 55;
    let request = 45;

    if (sentences.length > 0 && sentences.length <= 4) clarity += 15;
    if (words.length >= 5 && words.length <= 80) clarity += 15;
    if (words.length > 120) clarity -= 15;
    if (specificWords.some(word => text.toLowerCase().includes(word))) specificity += 20;
    if (words.length >= 10) specificity += 10;
    if (requestWords.some(word => text.toLowerCase().includes(word))) request += 35;
    if (text.includes("?")) request += 10;

    const avgSentenceLength = sentences.length ? words.length / sentences.length : words.length;
    let readability = 85;
    if (avgSentenceLength > 25) readability -= 20;
    if (avgSentenceLength > 35) readability -= 20;
    if (words.length < 4) readability -= 15;

    clarity = Math.min(Math.max(clarity, 0), 100);
    specificity = Math.min(Math.max(specificity, 0), 100);
    request = Math.min(Math.max(request, 0), 100);
    readability = Math.min(Math.max(readability, 0), 100);

    clarityScore.textContent = clarity + "%";
    specificityScore.textContent = specificity + "%";
    requestScore.textContent = request + "%";
    readabilityScore.textContent = readability + "%";
}

function updateMessageCount(text) {
    const value = text.trim();
    const words = value ? value.split(/\s+/).filter(Boolean).length : 0;
    const characters = text.length;
    messageCount.textContent = currentLanguage === "sw" ? "Maneno: " + words + " · Herufi: " + characters : "Words: " + words + " · Characters: " + characters;
}

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem("deescalationHistory") || "[]");
    } catch (error) {
        return [];
    }
}

function saveHistory() {
    const message = messageInput.value.trim();
    const rewrite = rewriteBox.textContent.trim();

    if (!message || !rewrite || rewrite === (currentLanguage === "sw" ? "Ujumbe wako ulioboreshwa utaonekana hapa." : "Your polished message will appear here.")) {
        return;
    }

    const history = getHistory();

    history.unshift({
        id: Date.now(),
        message: message,
        rewrite: rewrite,
        timestamp: new Date().toLocaleString()
    });

    localStorage.setItem(
        "deescalationHistory",
        JSON.stringify(history.slice(0, 10))
    );

    renderHistory();
}

function renderHistory() {
    const history = getHistory();

    if (history.length === 0) {
        historyList.innerHTML =
            '<div class="history-empty">' + (currentLanguage === "sw" ? "Hakuna ujumbe uliohifadhiwa bado." : "No saved messages yet.") + '</div>';
        return;
    }

    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-message">${escapeHtml(item.message)}</div>
            <div class="history-rewrite">${escapeHtml(item.rewrite)}</div>
            <div class="history-meta">${escapeHtml(item.timestamp)}</div>
            <div class="history-actions">
                <button type="button" onclick="loadHistoryItem(${item.id})">${currentLanguage === "sw" ? "Tumia ujumbe" : "Use message"}</button>
                <button type="button" onclick="deleteHistoryItem(${item.id})">${currentLanguage === "sw" ? "Futa" : "Delete"}</button>
            </div>
        </div>
    `).join("");
}

function loadHistoryItem(id) {
    const item = getHistory().find(entry => entry.id === id);

    if (!item) {
        return;
    }

    messageInput.value = item.message;
    updateMessageCount(messageInput.value);
    analyzeMessage(messageInput.value);
    messageInput.focus();
}

function deleteHistoryItem(id) {
    const history = getHistory().filter(item => item.id !== id);

    localStorage.setItem(
        "deescalationHistory",
        JSON.stringify(history)
    );

    renderHistory();
}

function updateBeforeAfter(text, rewrite) {
    if (!text.trim()) {
        beforeMessage.textContent = currentLanguage === "sw" ? "Ujumbe wako wa awali utaonekana hapa." : "Your original message will appear here.";
        afterMessage.textContent = currentLanguage === "sw" ? "Ujumbe wako ulioboreshwa utaonekana hapa." : "Your polished message will appear here.";
        whyChanged.innerHTML = currentLanguage === "sw" ? "Uchambuzi utaonekana hapa." : "Analysis will appear here.";
        return;
    }

    beforeMessage.textContent = text;
    afterMessage.textContent = rewrite;

    const lower = text.toLowerCase();
    const reasons = [];

    if (aggressiveWords.some(word => lower.includes(word))) {
        reasons.push(currentLanguage === "sw" ? "Maneno ya matusi au ukali yamepunguzwa." : "Reduced insulting or aggressive wording.");
    }

    if (confrontationalPhrases.some(phrase => lower.includes(phrase))) {
        reasons.push(currentLanguage === "sw" ? "Kauli za makabiliano zimebadilishwa kuwa maneno tulivu zaidi." : "Replaced confrontational phrases with calmer wording.");
    }

    if (blamePhrases.some(phrase => lower.includes(phrase))) {
        reasons.push(currentLanguage === "sw" ? "Lugha ya kulaumu imeelekezwa kwenye hali na athari zake." : "Shifted blame-focused language toward the situation and its impact.");
    }

    if (dismissivePhrases.some(phrase => lower.includes(phrase))) {
        reasons.push(currentLanguage === "sw" ? "Maneno ya kupuuza yamebadilishwa kuwa mawasiliano yaliyo wazi zaidi." : "Replaced dismissive wording with clearer communication.");
    }

    if (pressurePhrases.some(phrase => lower.includes(phrase))) {
        reasons.push(currentLanguage === "sw" ? "Shinikizo limepunguzwa ili kumpa mwingine nafasi ya kujibu." : "Reduced pressure so the other person has room to respond.");
    }

    if ((text.match(/!/g) || []).length >= 2) {
        reasons.push(currentLanguage === "sw" ? "Alama za mshangao zilizorudiwa zimepunguzwa ili ujumbe uwe mtulivu zaidi." : "Reduced repeated exclamation marks to make the message feel calmer.");
    }

    const words = text.split(/\s+/);
    const capsWords = words.filter(word =>
        word.length >= 3 &&
        word === word.toUpperCase() &&
        /[A-Z]/.test(word)
    );

    if (capsWords.length > 0) {
        reasons.push(currentLanguage === "sw" ? "Matumizi ya HERUFI KUBWA ZOTE yamepunguzwa kwa sababu yanaweza kufanya ujumbe uonekane mkali zaidi." : "Reduced ALL CAPS wording because it can feel more intense.");
    }

    if (reasons.length === 0) {
        reasons.push(currentLanguage === "sw" ? "Maana kuu imehifadhiwa huku uwazi, mtindo na weledi vikiboreshwa." : "Preserved the main meaning while improving clarity, tone, and professionalism.");
    }

    whyChanged.innerHTML =
        "<ul>" +
        reasons.map(reason => "<li>" + escapeHtml(reason) + "</li>").join("") +
        "</ul>";
}

let currentLanguage = "sw";

const languageText = {
    en: {
        button: "🇰🇪 Kiswahili",
        title: "Digital De-escalation Assistant",
        subtitle: "Analyze tone. Reduce intensity. Communicate better.",
        warmth: "Warmth",
        professionalism: "Professionalism",
        whyScore: "Why this score?",
        messagePlaceholder: "Type or paste your message here...",
        message: "Your message",
        highlightPlaceholder: "Highlighted language signals will appear here.",
        aggressiveEmpty: "No aggressive language detected.",
        tipsPlaceholder: "Tips will appear here as you type.",
        languageSignals: "Language signals",
        intensity: "Intensity",
        situation: "Situation",
        general: "General",
        personal: "Personal / Relationship",
        school: "School / Lecturer",
        work: "Workplace",
        customer: "Customer Service",
        social: "Social Media",
        conflict: "Conflict / Complaint",
        toneGoal: "Tone goal",
        deescalate: "De-escalate",
        response: "Get a response",
        apologize: "Apologize",
        professional: "Stay professional",
        relationship: "Protect the relationship",
        firm: "Be firm but respectful",
        rewriteStyle: "Rewrite style",
        balanced: "Balanced",
        formal: "Formal",
        casual: "Casual Friendly",
        courtesy: "Courtesy",
        calmRewrite: "Calm rewrite",
        beforeAfter: "Before & After",
        beforeAfterText: "See how the assistant changed your message and why.",
        before: "Before",
        after: "After",
        whyChanged: "Why this changed",
        history: "History",
        historyText: "Your recent analyzed messages are stored only in this browser.",
        clearHistory: "Clear history",
        copy: "Copy polished message",
        save: "Save to history",
        share: "Share polished message",
        email: "📧 Email",
        whatsapp: "💬 WhatsApp",
        telegram: "✈️ Telegram",
        instagram: "📸 Instagram",
        reset: "Clear / Reset",
        messageQuality: "Message quality",
        communicationTips: "Communication tips",
        clarity: "Clarity",
        specificity: "Specificity",
        requestClarity: "Request clarity",
        readability: "Readability",
  privacyDashboard: "Privacy Dashboard",
  privacySubtitle: "See how this assistant handles your messages and data.",
  privacyLocal: "🟢 Local only",
  privacyLocalAnalysis: "Local analysis",
  privacyLocalAnalysisText: "Your message is analyzed directly in this browser.",
  privacyNoCloud: "No cloud processing",
  privacyNoCloudText: "Your messages are not sent to a cloud AI service.",
  privacyNoApi: "No API key",
  privacyNoApiText: "The assistant does not require an AI API key to analyze messages.",
  privacyHistory: "Browser history",
  privacyHistoryText: "Saved messages stay in this browser until you clear them.",
  privacyYourData: "Your data",
  privacyChecking: "Checking local history...",
  privacyClearHistory: "Clear saved history",
        whyChanged: "Why this changed"
    },
    sw: {
        button: "🇬🇧 English",
        title: "Msaidizi wa Kupunguza Migogoro ya Mawasiliano",
        subtitle: "Changanua mtindo wa ujumbe. Punguza ukali. Wasiliana vizuri.",
        warmth: "Ukaribu",
        professionalism: "Weledi",
        whyScore: "Kwa nini alama hii?",
        messagePlaceholder: "Andika au bandika ujumbe wako hapa... ",
        message: "Ujumbe wako",
        highlightPlaceholder: "Viashiria vya lugha vilivyoangaziwa vitaonekana hapa.",
        aggressiveEmpty: "Hakuna lugha kali iliyogunduliwa.",
        tipsPlaceholder: "Vidokezo vitaonekana unapoandika.",
        languageSignals: "Viashiria vya lugha",
        intensity: "Kiwango cha ukali",
        situation: "Hali",
        general: "Kwa ujumla",
        personal: "Binafsi / Mahusiano",
        school: "Shule / Mhadhiri",
        work: "Mahali pa kazi",
        customer: "Huduma kwa wateja",
        social: "Mitandao ya kijamii",
        conflict: "Mgogoro / Malalamiko",
        toneGoal: "Lengo la mtindo",
        deescalate: "Kupunguza mgogoro",
        response: "Kupata jibu",
        apologize: "Kuomba msamaha",
        professional: "Kubaki kitaalamu",
        relationship: "Kulinda uhusiano",
        firm: "Kuwa thabiti kwa heshima",
        rewriteStyle: "Mtindo wa uandishi",
        balanced: "Mizani",
        formal: "Rasmi",
        casual: "Kirafiki",
        courtesy: "Heshima",
        calmRewrite: "Ujumbe uliotulia",
        beforeAfter: "Kabla na Baada",
        beforeAfterText: "Angalia jinsi msaidizi alivyobadilisha ujumbe wako na kwa nini.",
        before: "Kabla",
        after: "Baada",
        whyChanged: "Kwa nini umebadilishwa",
        history: "Historia",
        historyText: "Ujumbe wako wa hivi karibuni umehifadhiwa kwenye kivinjari hiki pekee.",
        clearHistory: "Futa historia",
        copy: "Nakili ujumbe ulioboreshwa",
        save: "Hifadhi kwenye historia",
        share: "Shiriki ujumbe ulioboreshwa",
        email: "📧 Barua pepe",
        whatsapp: "💬 WhatsApp",
        telegram: "✈️ Telegram",
        instagram: "📸 Instagram",
        reset: "Futa / Anza upya",
        messageQuality: "Ubora wa ujumbe",
        communicationTips: "Vidokezo vya mawasiliano",
        clarity: "Uwazi",
        specificity: "Umaalum",
        requestClarity: "Uwazi wa ombi",
        readability: "Urahisi wa kusoma",
  privacyDashboard: "Dashibodi ya Faragha",
  privacySubtitle: "Angalia jinsi msaidizi huyu anavyoshughulikia ujumbe na data yako.",
  privacyLocal: "🟢 Kwenye kifaa pekee",
  privacyLocalAnalysis: "Uchanganuzi wa kwenye kifaa",
  privacyLocalAnalysisText: "Ujumbe wako huchanganuliwa moja kwa moja kwenye kivinjari hiki.",
  privacyNoCloud: "Hakuna uchakataji wa mtandaoni",
  privacyNoCloudText: "Ujumbe wako hautumwi kwa huduma ya AI ya mtandaoni.",
  privacyNoApi: "Hakuna API key",
  privacyNoApiText: "Msaidizi hauhitaji AI API key kuchanganua ujumbe.",
  privacyHistory: "Historia ya kivinjari",
  privacyHistoryText: "Ujumbe uliohifadhiwa hubaki kwenye kivinjari hiki hadi uufute.",
  privacyYourData: "Data yako",
  privacyChecking: "Inaangalia historia ya kwenye kifaa...",
  privacyClearHistory: "Futa historia iliyohifadhiwa",
        whyChanged: "Kwa nini umebadilishwa"
    }
};

function applyLanguage() {
    document.body.classList.toggle("swahili-mode", currentLanguage === "sw");
    const t = languageText[currentLanguage];
    const qualityTitle = document.getElementById("message-quality-title");
    const clarityLabel = document.getElementById("clarity-label");
    const specificityLabel = document.getElementById("specificity-label");
    const requestLabel = document.getElementById("request-label");
    const readabilityLabel = document.getElementById("readability-label");
    const whyChangedTitle = document.getElementById("why-changed-title");
    const communicationTipsTitle = document.getElementById("communication-tips-title");

    document.querySelector("header h1").textContent = t.title;
    document.querySelector("header p").textContent = t.subtitle;
    document.getElementById("message").placeholder = t.messagePlaceholder;
    document.getElementById("warmth-label").textContent = t.warmth;
    document.getElementById("professionalism-label").textContent = t.professionalism;
    document.getElementById("score-explanation-title").textContent = t.whyScore;
    document.querySelector('label[for="message"]').textContent = t.message;
    document.getElementById("highlight-preview").textContent = t.highlightPlaceholder;
    document.getElementById("detected-words").textContent = t.aggressiveEmpty;
    document.getElementById("tips-content").textContent = t.tipsPlaceholder;

    const headings = document.querySelectorAll("h2");
    headings.forEach(heading => {
        const value = heading.textContent.trim();

        if (value === "Language signals" || value === "Viashiria vya lugha") heading.textContent = t.languageSignals;
        if (value === "Intensity" || value === "Kiwango cha ukali") heading.textContent = t.intensity;
        if (value === "Calm rewrite" || value === "Ujumbe uliotulia") heading.textContent = t.calmRewrite;
        if (value === "Before & After" || value === "Kabla na Baada") heading.textContent = t.beforeAfter;
        if (value === "History" || value === "Historia") heading.textContent = t.history;
    });

    document.querySelector('label[for="incident-preset"]').textContent = t.situation;
    document.querySelector('label[for="tone-goal"]').textContent = t.toneGoal;
    document.querySelector('label[for="rewrite-mode"]').textContent = t.rewriteStyle;
    document.querySelector('label[for="courtesy"]').textContent = t.courtesy;

    const presetLabels = {
        general: t.general,
        personal: t.personal,
        school: t.school,
        work: t.work,
        customer: t.customer,
        social: t.social,
        conflict: t.conflict
    };

    Array.from(incidentPreset.options).forEach(option => {
        if (presetLabels[option.value]) option.textContent = presetLabels[option.value];
    });

    const goalLabels = {
        deescalate: t.deescalate,
        response: t.response,
        apologize: t.apologize,
        professional: t.professional,
        relationship: t.relationship,
        firm: t.firm
    };

    Array.from(toneGoal.options).forEach(option => {
        if (goalLabels[option.value]) option.textContent = goalLabels[option.value];
    });

    const modeLabels = {
        balanced: t.balanced,
        formal: t.formal,
        casual: t.casual
    };

    Array.from(rewriteMode.options).forEach(option => {
        if (modeLabels[option.value]) option.textContent = modeLabels[option.value];
    });

    document.querySelector(".before-after-header p").textContent = t.beforeAfterText;
    document.querySelector(".before-card h3").textContent = t.before;
    document.querySelector(".after-card h3").textContent = t.after;
    document.querySelector(".why-card h3").textContent = t.whyChanged;

    document.querySelector(".history-header p").textContent = t.historyText;
    const privacyDashboard = document.getElementById("privacy-dashboard");
    const privacyHeader = privacyDashboard ? privacyDashboard.querySelector(".privacy-header h2") : null;
    const privacySubtitle = privacyDashboard ? privacyDashboard.querySelector(".privacy-header p") : null;
    const privacyStatus = privacyDashboard ? privacyDashboard.querySelector(".privacy-status") : null;
    const privacyCards = privacyDashboard ? privacyDashboard.querySelectorAll(".privacy-card") : [];
    const privacyDataTitle = privacyDashboard ? privacyDashboard.querySelector(".privacy-controls h3") : null;
    const privacyHistoryStatus = document.getElementById("privacy-history-status");
    const privacyClearButton = document.getElementById("privacy-clear-history");

    if (privacyHeader) privacyHeader.textContent = t.privacyDashboard;
    if (privacySubtitle) privacySubtitle.textContent = t.privacySubtitle;
    if (privacyStatus) privacyStatus.textContent = t.privacyLocal;
    if (privacyCards.length >= 4) {
        privacyCards[0].querySelector("h3").textContent = t.privacyLocalAnalysis;
        privacyCards[0].querySelector("p").textContent = t.privacyLocalAnalysisText;
        privacyCards[1].querySelector("h3").textContent = t.privacyNoCloud;
        privacyCards[1].querySelector("p").textContent = t.privacyNoCloudText;
        privacyCards[2].querySelector("h3").textContent = t.privacyNoApi;
        privacyCards[2].querySelector("p").textContent = t.privacyNoApiText;
        privacyCards[3].querySelector("h3").textContent = t.privacyHistory;
        privacyCards[3].querySelector("p").textContent = t.privacyHistoryText;
    }
    if (privacyDataTitle) privacyDataTitle.textContent = t.privacyYourData;
    if (privacyHistoryStatus) privacyHistoryStatus.textContent = getHistory().length ? (currentLanguage === "sw" ? getHistory().length + " ujumbe umehifadhiwa kwenye kivinjari hiki." : getHistory().length + " saved message(s) in this browser.") : t.privacyChecking;
    if (privacyClearButton) privacyClearButton.textContent = t.privacyClearHistory;
    clearHistoryButton.textContent = t.clearHistory;
    copyButton.textContent = t.copy;
    saveHistoryButton.textContent = t.save;
    shareButton.textContent = t.share;
    emailButton.textContent = t.email;
    whatsappButton.textContent = t.whatsapp;
    telegramButton.textContent = t.telegram;
    instagramButton.textContent = t.instagram;
    resetButton.textContent = t.reset;
    languageToggle.textContent = t.button;
    if (qualityTitle) qualityTitle.textContent = t.messageQuality;
    if (clarityLabel) clarityLabel.textContent = t.clarity;
    if (specificityLabel) specificityLabel.textContent = t.specificity;
    if (requestLabel) requestLabel.textContent = t.requestClarity;
    if (readabilityLabel) readabilityLabel.textContent = t.readability;
    if (whyChangedTitle) whyChangedTitle.textContent = t.whyChanged;
    if (communicationTipsTitle) communicationTipsTitle.textContent = t.communicationTips;

    const scaleLabels = currentLanguage === "sw"
        ? ["Tulivu", "Kidogo", "Wastani", "Juu", "Juu sana"]
        : ["Calm", "Slight", "Moderate", "High", "Very High"];

    updateMessageCount(messageInput.value);
    renderHistory();
    updateBeforeAfter(messageInput.value, rewrite.textContent);

    gaugeScaleLabels.forEach((label, index) => {
        label.textContent = scaleLabels[index];
    });
}

languageToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "en" ? "sw" : "en";
    applyLanguage();
    analyzeMessage(messageInput.value);
});



const privacyClearHistoryButton = document.getElementById("privacy-clear-history");
if (privacyClearHistoryButton) {
    privacyClearHistoryButton.addEventListener("click", () => {
        localStorage.removeItem("deescalationHistory");
        renderHistory();
        const status = document.getElementById("privacy-history-status");
        if (status) status.textContent = languageText[currentLanguage].privacyChecking;
        applyLanguage();
    });
}
applyLanguage();
function analyzeMessage(text) {
    if (!text.trim()) {
        gaugeFill.style.width = "0%";
        gaugeFill.style.background = "#22c55e";
        gaugeFill.style.boxShadow = "none";

        angerScore.textContent = "0%";
        angerScore.style.color = "#16a34a";

        toneLabel.textContent = currentLanguage === "sw" ? "Hakuna ujumbe uliochanganuliwa" : "No message analyzed";
        toneLabel.style.color = "#667085";

        warmthScore.textContent = "0%";
        professionalScore.textContent = "0%";

        detectedWords.textContent = currentLanguage === "sw" ? "Hakuna lugha kali iliyogunduliwa." : "No aggressive language detected.";
        highlightPreview.textContent =
            currentLanguage === "sw" ? "Viashiria vya lugha vilivyoangaziwa vitaonekana hapa." : "Highlighted language signals will appear here.";
        rewriteBox.textContent =
            currentLanguage === "sw" ? "Ujumbe wako ulioboreshwa utaonekana hapa." : "Your polished message will appear here.";

        updateGaugeScale(0);
        return;
    }

    const lower = text.toLowerCase();

    const detected = aggressiveWords.filter(word =>
        lower.includes(word)
    );

    const confrontationalDetected =
        confrontationalPhrases.filter(phrase =>
            lower.includes(phrase)
        );

    const blameDetected = blamePhrases.filter(phrase => lower.includes(phrase));
const dismissiveDetected = dismissivePhrases.filter(phrase => lower.includes(phrase));
const pressureDetected = pressurePhrases.filter(phrase => lower.includes(phrase));

const allLanguageSignals = [
        ...detected.map(word => ({ label: word, type: "aggressive" })),
        ...confrontationalDetected.map(phrase => ({ label: phrase, type: "confrontational" })),
        ...blameDetected.map(phrase => ({ label: phrase, type: "blame" })),
        ...dismissiveDetected.map(phrase => ({ label: phrase, type: "dismissive" })),
        ...pressureDetected.map(phrase => ({ label: phrase, type: "pressure" }))
    ];

    if (allLanguageSignals.length > 0) {
        detectedWords.innerHTML =
            (currentLanguage === "sw" ? "Imegunduliwa: " : "Detected: ") +
            allLanguageSignals
                .map(signal =>
                    "<strong>" + escapeHtml(signal.label) + "</strong>"
                )
                .join(", ");

        let highlighted = escapeHtml(
            text.replace(/\*\*/g, "")
        );

        allLanguageSignals.forEach(signal => {
            const pattern = new RegExp(
                "(" + escapeRegExp(signal.label) + ")",
                "gi"
            );

            highlighted = highlighted.replace(
                pattern,
                "<mark>$1</mark>"
            );
        });

        highlightPreview.innerHTML = highlighted;
    } else {
        detectedWords.textContent =
            currentLanguage === "sw" ? "Hakuna lugha yenye tatizo iliyogunduliwa." : "No problematic language detected.";

        highlightPreview.textContent =
            currentLanguage === "sw" ? "Hakuna viashiria vya lugha vilivyogunduliwa." : "No language signals detected.";
    }
    let intensity = 0;

    aggressiveWords.forEach(word => {
        if (lower.includes(word)) {
            intensity += 12;
        }
    });

    intensifiers.forEach(word => {
        const regex = new RegExp("\\b" + word + "\\b", "gi");
        const matches = text.match(regex);

        if (matches) {
            intensity += matches.length * 4;
        }
    });

    intensity += Math.min(confrontationalDetected.length * 10, 30);
    intensity += Math.min(blameDetected.length * 8, 24);
    intensity += Math.min(dismissiveDetected.length * 7, 21);
    intensity += Math.min(pressureDetected.length * 7, 21);

    const words = text.split(/\s+/);

    const capsWords = words.filter(word =>
        word.length >= 3 &&
        word === word.toUpperCase() &&
        /[A-Z]/.test(word)
    );

    intensity += Math.min(capsWords.length * 7, 28);

    const exclamations = (text.match(/!/g) || []).length;
    const questions = (text.match(/\?/g) || []).length;

    intensity += Math.min(exclamations * 4, 20);
    intensity += Math.min(questions * 3, 15);

    intensity = Math.min(Math.max(intensity, 0), 100);

    let warmth = 50;

    politeWords.forEach(word => {
        const regex = new RegExp("\\b" + word + "\\b", "gi");
        const matches = text.match(regex);

        if (matches) {
            warmth += matches.length * 7;
        }
    });

    warmth -= Math.floor(intensity * 0.35);
    warmth = Math.min(Math.max(warmth, 0), 100);

    let professionalism = 70;

    professionalism -= Math.floor(intensity * 0.4);

    if (text.length > 500) {
        professionalism -= 5;
    }

    professionalism =
        Math.min(Math.max(professionalism, 0), 100);

    let label = currentLanguage === "sw" ? "Tulivu" : "Calm";

    if (intensity >= 70) {
        label = currentLanguage === "sw" ? "Ukali wa juu sana" : "Very high intensity";
    } else if (intensity >= 45) {
        label = currentLanguage === "sw" ? "Ukali wa juu" : "High intensity";
    } else if (intensity >= 25) {
        label = currentLanguage === "sw" ? "Ukali wa wastani" : "Moderate intensity";
    } else if (intensity >= 10) {
        label = currentLanguage === "sw" ? "Ukali kidogo" : "Slight intensity";
    }

    const toneColor = getToneColor(intensity);

    gaugeFill.style.width = intensity + "%";
    gaugeFill.style.background = toneColor;
    gaugeFill.style.boxShadow =
        "0 0 10px " + toneColor;

    angerScore.textContent = intensity + "%";
    angerScore.style.color = toneColor;

    toneLabel.textContent = label;
    toneLabel.style.color = toneColor;

    warmthScore.textContent = warmth + "%";
    professionalScore.textContent =
        professionalism + "%";

    warmthScore.style.color =
        getQualityColor(warmth);

    professionalScore.style.color =
        getQualityColor(professionalism);

    updateGaugeScale(intensity);
    updateScoreExplanation(text, intensity);
    updateCommunicationTips(text);
    updateMessageQuality(text);

    rewriteBox.textContent = generateRewrite(text, intensity);

    updateBeforeAfter(text, rewriteBox.textContent);

    updateMessageCount(messageInput.value);

courtesyValue.textContent =
        courtesySlider.value + "%";
}

function updateGaugeScale(intensity) {
    const labels =
        gaugeScale.querySelectorAll("span");

    labels.forEach(label => {
        label.classList.remove("active");
        label.style.background = "";
        label.style.color = "";
        label.style.boxShadow = "";
    });

    let index = 0;

    if (intensity >= 70) {
        index = 4;
    } else if (intensity >= 45) {
        index = 3;
    } else if (intensity >= 30) {
        index = 2;
    } else if (intensity >= 15) {
        index = 1;
    }

    if (labels[index]) {
        const color = getToneColor(intensity);

        labels[index].classList.add("active");
        labels[index].style.background = color;
        labels[index].style.color = "white";
        labels[index].style.boxShadow =
            "0 3px 10px " + color + "55";
    }
}

function getToneColor(intensity) {
    if (intensity >= 70) return "#dc2626";
    if (intensity >= 45) return "#ea580c";
    if (intensity >= 25) return "#ca8a04";
    return "#16a34a";
}

function getQualityColor(score) {
    if (score >= 70) return "#16a34a";
    if (score >= 40) return "#ca8a04";
    return "#dc2626";
}

function applySmartPreset(result, preset) {
    if (result.length <= 20) return result;

    result = result.replace(/[.!?]*$/, "");

    if (preset === "personal") {
        result += ". I value our relationship and would rather talk about this calmly and understand each other."
    } else if (preset === "school") {
        result += ". I would appreciate your guidance and clarification on how we can resolve this."
    } else if (preset === "work") {
        result += ". I would appreciate a clear and constructive way forward."
    } else if (preset === "customer") {
        result += ". I would appreciate your help in resolving this matter and knowing the next step."
    } else if (preset === "social") {
        result += ". I would prefer to keep the discussion respectful and focused on the issue."
    } else if (preset === "conflict") {
        result += ". I would like us to focus on the issue and find a practical way forward."
    }

    return result;
}

function generateRewrite(text, intensity) {

    const courtesy = Number(courtesySlider.value);

    let result = text.trim();

    if (!result) {
        return currentLanguage === "sw" ? "Ujumbe wako ulioboreshwa utaonekana hapa." : "Your polished message will appear here.";
    }

    if (currentLanguage === "sw") {
        let sw = text.trim();

        sw = sw.replace(/\s+/g, " ");
        sw = sw.replace(/!+/g, ".");
        sw = sw.replace(/\?{2,}/g, "?");

        const swReplacements = [
            [/\bwewe ni mjinga\b/gi, "Sikubaliani na namna jambo hili lilivyoshughulikiwa"],
            [/\bmjinga\b/gi, "mtu"],
            [/\bmpumbavu\b/gi, "mtu"],
            [/\bacha ujinga\b/gi, "tujaribu kuzungumza kwa utulivu"],
            [/\bwewe hunisikilizi\b/gi, "nahisi kuwa sijasikilizwa"],
            [/\bhujawahi kunisikiliza\b/gi, "nahisi kuwa hujanisikiliza kikamilifu"],
            [/\bunanipuuza\b/gi, "nahisi kuwa ujumbe wangu haujazingatiwa"],
            [/\bfanya hivi sasa\b/gi, "tafadhali tufanye hivi haraka iwezekanavyo"],
            [/\bjibu sasa\b/gi, "tafadhali nijibu unapopata nafasi"],
            [/\bnijibu sasa\b/gi, "tafadhali nijibu unapopata nafasi"],
            [/\bni kosa lako\b/gi, "nahisi kuwa kuna jambo tunahitaji kulitatua"],
            [/\bkwa sababu yako\b/gi, "kutokana na hali hii"],
            [/\bsijali\b/gi, "ningependa kuelewa jambo hili vizuri zaidi"],
            [/\bhaijalishi\b/gi, "ningependa tulizingatie jambo hili"],
            [/\btafadhali\b/gi, "tafadhali"]
        ];

        swReplacements.forEach(([pattern, replacement]) => {
            sw = sw.replace(pattern, replacement);
        });

        if (/\bwewe\b/gi.test(sw) && /\bhunisikilizi\b/gi.test(sw)) {
            sw = sw.replace(/\bwewe\b/gi, "");
            sw = sw.replace(/\s+/g, " ").trim();
        }

        if (toneGoal.value === "apologize") {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Samahani kwa namna ujumbe wangu ulivyowasilishwa, na nashukuru kwa uelewa wako";
        } else if (toneGoal.value === "relationship") {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Nathamini uhusiano wetu na ningependa tulizungumzie hili kwa utulivu na kuelewana";
        } else if (toneGoal.value === "response") {
            sw = sw.replace(/[.!?]*$/, "");
            if (!/\btafadhali\b/i.test(sw)) {
                sw += ". Tafadhali nijulishe mawazo yako unapopata nafasi";
            }
        } else if (toneGoal.value === "professional") {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Ningethamini majibu yako na mwongozo kuhusu hatua inayofuata";
        } else if (toneGoal.value === "firm") {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Ningependa tulishughulikie hili kwa uwazi na kwa heshima";
        } else if (intensity > 10 && !/\btafadhali\b/i.test(sw)) {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Tafadhali nijulishe mawazo yako unapopata nafasi";
        }

        if (incidentPreset.value === "personal") {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Nathamini uhusiano wetu na ningependa tuelewane kwa utulivu";
        } else if (incidentPreset.value === "school") {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Ningethamini mwongozo wako kuhusu jinsi tunavyoweza kutatua hili";
        } else if (incidentPreset.value === "work") {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Ningethamini njia iliyo wazi na yenye kujenga ya kusonga mbele";
        } else if (incidentPreset.value === "customer") {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Ningethamini msaada wako katika kutatua jambo hili na kunijulisha hatua inayofuata";
        } else if (incidentPreset.value === "social") {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Ningependa mazungumzo haya yabaki ya heshima na yalenge jambo lenyewe";
        } else if (incidentPreset.value === "conflict") {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Ningependa tulenge tatizo na tutafute njia nzuri ya kulitatua";
        }

        if (courtesy >= 80 && !/\btafadhali\b/i.test(sw)) {
            sw = sw.replace(/[.!?]*$/, "");
            sw += ". Asante kwa kuchukua muda kushughulikia jambo hili";
        }

        sw = sw.replace(/\s+([,.!?])/g, "$1");
        sw = sw.replace(/([.!?])\s*/g, "$1 ").trim();

        if (!/[.!?]$/.test(sw)) {
            sw += ".";
        }

        return sw;
    }
    const mode = rewriteMode.value;
    const preset = incidentPreset.value;
    const goal = toneGoal.value;

    result = result.replace(/\s+/g, " ");
    result = result.replace(/!+/g, ".");
    result = result.replace(/\?{2,}/g, "?");

    const replacements = [
        [/\bstop ignoring me\b/gi, "Could you please respond when you have a moment"],
        [/\byou are being completely unfair\b/gi, "I feel that this situation has been difficult"],
        [/\bfix this right now\b/gi, "Could we work on resolving this as soon as possible"],
        [/\bshut up\b/gi, "I'd appreciate a moment to explain"],
        [/\byou are stupid\b/gi, "I don't agree with your approach"],
        [/\byou're stupid\b/gi, "I don't agree with your approach"],
        [/\byou are an idiot\b/gi, "I don't agree with your approach"],
        [/\byou're an idiot\b/gi, "I don't agree with your approach"],
        [/\bidiot\b/gi, "person"],
        [/\bstupid\b/gi, "unhelpful"],
        [/\buseless\b/gi, "not helpful"],
        [/\bpathetic\b/gi, "disappointing"],
        [/\bridiculous\b/gi, "concerning"],
        [/\bliars?\b/gi, "people I disagree with"],
        [/\bfool\b/gi, "person"]
    ];

    replacements.forEach(([pattern, replacement]) => {
        result = result.replace(pattern, replacement);
    });

    result = result.replace(
        /\byou never\b/gi,
        "I feel that you haven't"
    );

    result = result.replace(
        /\byou always\b/gi,
        "I feel that this often happens"
    );

    result = result.replace(
        /\bwhy are you\b/gi,
        "Could you help me understand why you are"
    );

    result = result.replace(
        /\bdo this now\b/gi,
        "Could you please do this when possible"
    );

    result = result
        .split(/\s+/)
        .map(token => {
            const lettersOnly = token.replace(/[^A-Za-z]/g, "");

            if (
                lettersOnly.length >= 2 &&
                lettersOnly !== "I" &&
                lettersOnly === lettersOnly.toUpperCase()
            ) {
                return token.toLowerCase();
            }

            return token;
        })
        .join(" ");

    result = result.replace(
        /\s+([,.!?])/g,
        "$1"
    );

    result = result.replace(/([.!?])\s*/g, "$1 ").trim();

    result = result.replace(/([.!?]\s+)([a-z])/g, (match, punctuation, letter) => punctuation + letter.toUpperCase());

    if (mode === "formal") {
        result = result.replace(
            /^Could you help me understand/i,
            "I would appreciate clarification about"
        );

        result = result.replace(
            /\bPlease let me know your thoughts\b/i,
            "I would appreciate your response"
        );

        result = result.replace(
            /\bI feel that\b/gi,
            "I am concerned that"
        );
    }

    if (mode === "casual") {
        result = result.replace(
            /^Could you help me understand/i,
            "Hey, could you help me understand"
        );

        result = result.replace(
            /\bPlease let me know your thoughts\b/i,
            "Let me know what you think"
        );

        result = result.replace(
            /\bI feel that\b/gi,
            "I feel like"
        );
    }

    if (goal === "deescalate" && intensity > 10) {
        result = result
            .replace(/\bI am concerned that\b/gi, "I understand that")
            .replace(/\bI feel like\b/gi, "I feel")
            .replace(/\bI feel that\b/gi, "I feel")
            .replace(/\bbut\b/gi, "and");
    } else if (goal === "response" && result.length > 20) {
        result = result.replace(
            /[.!?]*$/,
            ""
        );
        if (!/\bplease\b/i.test(result)) {
            result += ". Please let me know your thoughts when you have a moment";
        }
    } else if (goal === "apologize" && intensity > 0) {
        result = result.replace(/[.!?]*$/, "");
        result += ". I am sorry for the way this came across, and I appreciate your understanding";
    } else if (goal === "professional") {
        result = result
            .replace(/\bI feel like\b/gi, "I believe")
            .replace(/\bI feel that\b/gi, "I believe")
            .replace(/\bHey,\s*/i, "");
    } else if (goal === "relationship" && intensity > 0) {
        result = result.replace(/[.!?]*$/, "");
        result += ". I value our relationship and would like us to handle this with understanding";
    } else if (goal === "firm" || toneGoal.selectedIndex === 5) {
        if (/^I feel that you haven't listened to me/i.test(result)) {
            result = result.replace(
                /^I feel that you haven't listened to me/i,
                "I need us to address this clearly"
            );
        } else {
            result = result.replace(
                /\bI feel like\b/gi,
                "I need"
            );
        }

        if (result.length > 20 && !/\bplease\b/i.test(result)) {
            result = result.replace(/[.!?]*$/, "");
            result += ". Please let me know how we can resolve this";
        }
    }
    result = applySmartPreset(result, preset);

    if (courtesy >= 80 && intensity > 10 && !/\bthank\b/i.test(result) && !/\bappreciat/i.test(result) && !/\bplease\b/i.test(result)) {
        result = result.replace(/[.!?]*$/, "");

        if (mode === "formal") {
            result += ". Thank you for taking the time to help me with this.";
        } else {
            result += ". I really appreciate your help with this.";
        }
    } else if (
        intensity > 10 && courtesy >= 40 &&
        courtesy < 80 &&
        result.length > 20 &&
        !/\bplease\b/i.test(result) &&
        !/\bthank/i.test(result)
    ) {
        result = result.replace(/[.!?]*$/, "");
        result += ". Please let me know your thoughts.";
    }

    result = result.replace(/\bI feel you haven't\b/gi, "I feel that you haven't");
    result = result.replace(/\bI feel you did not\b/gi, "I feel that you did not");
    result = result.replace(/\bI think you are\b/gi, "I feel that you are");
    result = result.replace(/\bI need you to\b/gi, "Could you please");
    result = result.replace(/\bYou are not listening to me\b/gi, "I feel that I am not being heard");
    result = result.replace(/\bYou don't understand\b/gi, "I feel that my concern may not be clear");
    if (result) { result = result.replace(/\bCould you please respond when you have a moment\./gi, "Could you please respond when you have a moment?"); result = result.replace(/\bCould we work on resolving this as soon as possible\./gi, "Could we work on resolving this as soon as possible?"); result = result.replace(/\bCould you help me understand why you are([^.!?]*)\./gi, "Could you help me understand why you are$1?"); if (!/[.!?]$/.test(result)) { result += "."; } }

    result = result.replace(/\byou haven't listen\b/gi, "you haven't listened");

    return result;
}
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeRegExp(text) {
    return text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}

messageInput.addEventListener("input", () => {
    updateMessageCount(messageInput.value);
    analyzeMessage(messageInput.value);
});

toneGoal.addEventListener("change", () => {
    analyzeMessage(messageInput.value);
});

incidentPreset.addEventListener("change", () => {
    analyzeMessage(messageInput.value);
});

rewriteMode.addEventListener("change", () => {
    analyzeMessage(messageInput.value);
});

courtesySlider.addEventListener("input", () => {
    updateMessageCount(messageInput.value);

courtesyValue.textContent =
        courtesySlider.value + "%";

    analyzeMessage(messageInput.value);
});

copyButton.addEventListener("click", async () => {
    const text = rewriteBox.textContent;

    if (
        !text ||
        text ===
            currentLanguage === "sw" ? "Ujumbe wako ulioboreshwa utaonekana hapa." : "Your polished message will appear here."
    ) {
        return;
    }

    try {
        await navigator.clipboard.writeText(text);

        copyButton.textContent = "Copied!";

        setTimeout(() => {
            copyButton.textContent =
                "Copy polished message";
        }, 1500);
    } catch (error) {
        alert(
            "Copy failed. Please select and copy the text manually."
        );
    }
});

updateMessageCount(messageInput.value);

courtesyValue.textContent =
    courtesySlider.value + "%";










function updateScoreExplanation(text, intensity) {
    const reasons = [];
    const lower = text.toLowerCase();

    const aggressiveFound = aggressiveWords.filter(word =>
        lower.includes(word)
    );

    const confrontationalFound =
        confrontationalPhrases.filter(phrase =>
            lower.includes(phrase)
        );

    if (confrontationalFound.length > 0) {
        reasons.push({
            type: "medium",
            text: currentLanguage === "sw" ? `Lugha ya makabiliano imegunduliwa: ${confrontationalFound.length} ${confrontationalFound.length === 1 ? "kauli" : "kauli"}` : `Confrontational language detected: ${confrontationalFound.length} phrase${confrontationalFound.length === 1 ? "" : "s"}`
        });
    }
    const intensifierFound = intensifiers.filter(word =>
        lower.includes(word)
    );

    const capsWords = text
        .split(/\s+/)
        .filter(word => {
            const letters = word.replace(/[^A-Za-z]/g, "");
            return letters.length >= 2 &&
                letters === letters.toUpperCase();
        });

    const exclamationCount = (text.match(/!/g) || []).length;
    const questionCount = (text.match(/\?/g) || []).length;

    aggressiveFound.forEach(word => {
        reasons.push({
            type: "high",
            text: currentLanguage === "sw" ? `Lugha kali: "${word}"` : `Aggressive language: "${word}"`
        });
    });

    if (intensifierFound.length > 0) {
        reasons.push({
            type: "medium",
            text: currentLanguage === "sw" ? `Maneno yanayoongeza ukali: ${intensifierFound.join(", ")}` : `Intensifying language: ${intensifierFound.join(", ")}`
        });
    }

    if (capsWords.length > 0) {
        reasons.push({
            type: "medium",
            text: currentLanguage === "sw" ? "HERUFI KUBWA ZOTE zinaweza kuongeza ukali unaotambuliwa" : "ALL CAPS can increase perceived intensity"
        });
    }

    if (exclamationCount >= 2) {
        reasons.push({
            type: "medium",
            text: currentLanguage === "sw" ? `Alama za mshangao zilizorudiwa zimegunduliwa (${exclamationCount})` : `Repeated exclamation marks detected (${exclamationCount})`
        });
    }

    if (questionCount >= 2) {
        reasons.push({
            type: "medium",
            text: currentLanguage === "sw" ? `Alama za kuuliza zilizorudiwa zimegunduliwa (${questionCount})` : `Repeated question marks detected (${questionCount})`
        });
    }

    if (reasons.length === 0) {
        reasons.push({
            type: "low",
            text: currentLanguage === "sw" ? "Hakuna viashiria vikubwa vya ukali vilivyogunduliwa" : "No strong intensity signals detected"
        });
    }

    const container = document.getElementById("score-reasons");

    container.innerHTML = reasons.map(reason => `
        <div class="score-reason ${reason.type}">
            <span class="reason-dot"></span>
            <span>${escapeHtml(reason.text)}</span>
        </div>
    `).join("");
}




































resetButton.addEventListener("click", () => { messageInput.value = ""; incidentPreset.selectedIndex = 0; toneGoal.selectedIndex = 0; rewriteMode.selectedIndex = 0; courtesySlider.value = 60; updateMessageCount(messageInput.value);

courtesyValue.textContent = "60%"; analyzeMessage(""); });





















themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const dark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = dark ? "☀️ Light mode" : "🌙 Dark mode";
});




saveHistoryButton.addEventListener("click", () => {
    saveHistory();
    saveHistoryButton.textContent = currentLanguage === "sw" ? "Imehifadhiwa!" : "Saved!";
    setTimeout(() => {
        saveHistoryButton.textContent = currentLanguage === "sw" ? "Hifadhi kwenye historia" : "Save to history";
    }, 1200);
});

clearHistoryButton.addEventListener("click", () => {
    localStorage.removeItem("deescalationHistory");
    renderHistory();
});

renderHistory();



shareButton.addEventListener("click", async () => {
    const text = rewriteBox.textContent.trim();

    if (!text || text === (currentLanguage === "sw" ? "Ujumbe wako ulioboreshwa utaonekana hapa." : "Your polished message will appear here.")) {
        return;
    }

    try {
        if (navigator.share) {
            await navigator.share({
                title: "Polished message",
                text: text
            });
        } else {
            await navigator.clipboard.writeText(text);
            shareButton.textContent = "Copied!";
            setTimeout(() => {
                shareButton.textContent = "Share polished message";
            }, 1500);
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            alert("Sharing failed. Please copy the polished message manually.");
        }
    }
});

emailButton.addEventListener("click", () => {
    const text = rewriteBox.textContent.trim();

    if (!text || text === (currentLanguage === "sw" ? "Ujumbe wako ulioboreshwa utaonekana hapa." : "Your polished message will appear here.")) {
        return;
    }

    const subject = encodeURIComponent("Polished message");
    const body = encodeURIComponent(text);

    window.location.href = "mailto:?subject=" + subject + "&body=" + body;
});



whatsappButton.addEventListener("click", () => {
    const text = rewriteBox.textContent.trim();

    if (!text || text === (currentLanguage === "sw" ? "Ujumbe wako ulioboreshwa utaonekana hapa." : "Your polished message will appear here.")) {
        return;
    }

    const url = "https://wa.me/?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
});



telegramButton.addEventListener("click", () => {
    const text = rewriteBox.textContent.trim();

    if (!text || text === (currentLanguage === "sw" ? "Ujumbe wako ulioboreshwa utaonekana hapa." : "Your polished message will appear here.")) {
        return;
    }

    const url = "https://t.me/share/url?url=&text=" + encodeURIComponent(text);
    window.open(url, "_blank");
});



instagramButton.addEventListener("click", async () => {
    const text = rewriteBox.textContent.trim();

    if (!text || text === (currentLanguage === "sw" ? "Ujumbe wako ulioboreshwa utaonekana hapa." : "Your polished message will appear here.")) {
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        window.open("https://www.instagram.com/", "_blank");
        instagramButton.textContent = "Copied — Instagram opened";
        setTimeout(() => {
            instagramButton.textContent = "📸 Instagram";
        }, 1800);
    } catch (error) {
        window.open("https://www.instagram.com/", "_blank");
    }
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js").then(() => {
            console.log("De-escalation PWA service worker registered.");
        }).catch(error => {
            console.error("Service worker registration failed:", error);
        });
    });
}
