// script.js
// ORGA(β版) メイン制御

const GAS_WEB_APP_URL = "ここにGASのWebアプリURLを貼り付ける";

const RESULT_CHARACTER_IMAGES = {
explorer: "images/result_explorer.png",
craftsman: "images/result_craftsman.png",
supporter: "images/result_supporter.png",
guardian: "images/result_guardian.png"
};

const state = {
currentScreen: "screen-u01",
currentQuestionIndex: 0,
questionOrder: [],
answers: {},
answerId: null,
diagnosisResult: null
};

document.addEventListener("DOMContentLoaded", () => {
setupEventListeners();

if (isDevResultMode()) {
showDevResult();
return;
}

showScreen("screen-u01");
sendAccessEvent("page_view");
});

function setupEventListeners() {
document.getElementById("start-button").addEventListener("click", () => {
showScreen("screen-u02");
});

document.getElementById("begin-button").addEventListener("click", () => {
startDiagnosis();
});

document.getElementById("next-question-button").addEventListener("click", () => {
goToNextQuestion();
});

document.getElementById("to-about-button").addEventListener("click", () => {
showScreen("screen-u06");
});

document.getElementById("to-survey-button").addEventListener("click", () => {
showScreen("screen-u07");
});

document.getElementById("survey-submit-button").addEventListener("click", () => {
submitSurvey();
});

document.getElementById("back-to-top-button").addEventListener("click", () => {
resetDiagnosis();
showScreen("screen-u01");
});
}

function showScreen(screenId) {
const screens = document.querySelectorAll(".screen");

screens.forEach((screen) => {
screen.classList.remove("active");
});

const targetScreen = document.getElementById(screenId);

if (targetScreen) {
targetScreen.classList.add("active");
state.currentScreen = screenId;
window.scrollTo({ top: 0, behavior: "smooth" });
}
}

function startDiagnosis() {
state.answerId = generateAnswerId();
sendAccessEvent("diagnosis_start");

state.currentQuestionIndex = 0;
state.answers = {};
state.diagnosisResult = null;
state.questionOrder = shuffleArray([...QUESTIONS]);

showScreen("screen-u03");
renderQuestion();
}

function renderQuestion() {
const question = state.questionOrder[state.currentQuestionIndex];
const questionNumber = state.currentQuestionIndex + 1;
const totalQuestions = state.questionOrder.length;
const progressPercent = Math.round((questionNumber / totalQuestions) * 100);

document.getElementById("question-number").textContent = `Q${questionNumber} / ${totalQuestions}`;
document.getElementById("question-text").textContent = question.text;
document.getElementById("progress-text").textContent = `${progressPercent}%`;
document.getElementById("progress-bar").style.width = `${progressPercent}%`;

const optionsContainer = document.getElementById("options-container");
optionsContainer.innerHTML = "";

const shuffledOptions = shuffleArray([...question.options]);

shuffledOptions.forEach((option) => {
const button = document.createElement("button");
button.className = "option-button";
button.textContent = option.text;

button.addEventListener("click", () => {
selectOption(question.id, option.direction, button);
});

optionsContainer.appendChild(button);
});

const nextButton = document.getElementById("next-question-button");
nextButton.disabled = true;
}

function selectOption(questionId, direction, selectedButton) {
state.answers[questionId] = direction;

const optionButtons = document.querySelectorAll(".option-button");

optionButtons.forEach((button) => {
button.classList.remove("selected");
});

selectedButton.classList.add("selected");
document.getElementById("next-question-button").disabled = false;
}

function goToNextQuestion() {
const isLastQuestion = state.currentQuestionIndex >= state.questionOrder.length - 1;

if (isLastQuestion) {
showLoadingAndCalculate();
return;
}

state.currentQuestionIndex += 1;
renderQuestion();
}

function showLoadingAndCalculate() {
showScreen("screen-u04");

state.diagnosisResult = calculateDiagnosisResult();

setTimeout(() => {
renderResult();
showScreen("screen-u05");
sendDiagnosisData();
sendAccessEvent("diagnosis_complete");
}, 1500);
}

function calculateDiagnosisResult() {
let axis1Score = 0;
let axis2Score = 0;

QUESTIONS.forEach((question) => {
const answer = state.answers[question.id];

if (answer === "positive") {
if (question.axis === "axis1") {
axis1Score += question.score;
}

if (question.axis === "axis2") {
axis2Score += question.score;
}
}
});

const totalScore = Math.round(axis1Score * 0.7 + axis2Score * 0.3);
const resultKey = judgeResultType(axis1Score, axis2Score);
const resultData = RESULTS[resultKey];

return {
answer_id: state.answerId,
answers: state.answers,
axis1_score: axis1Score,
axis2_score: axis2Score,
total_score: totalScore,
result_key: resultKey,
result_type: resultData.typeName,
result_data: resultData
};
}

function judgeResultType(axis1Score, axis2Score) {
if (axis1Score >= 50 && axis2Score >= 50) {
return "explorer";
}

if (axis1Score >= 50 && axis2Score < 50) {
return "craftsman";
}

if (axis1Score < 50 && axis2Score >= 50) {
return "supporter";
}

return "guardian";
}

function renderResult() {
const result = state.diagnosisResult;
const resultData = result.result_data;

document.getElementById("result-type").textContent = resultData.typeName;
const displayScore = Math.max(result.total_score, 50);
document.getElementById("total-score").textContent = `総合適応指数：${displayScore}点`;
document.getElementById("result-catch-copy").textContent = resultData.catchCopy;
document.getElementById("result-description").textContent = resultData.description;

renderResultCharacter(result.result_key);
renderList("result-strengths", resultData.strengths);
renderList("result-cautions", resultData.cautions);
}

function renderResultCharacter(resultKey) {
const imageElement = document.getElementById("result-character-image");

if (!imageElement) {
return;
}

const imagePath = RESULT_CHARACTER_IMAGES[resultKey];

if (!imagePath) {
imageElement.removeAttribute("src");
imageElement.style.display = "none";
return;
}

imageElement.src = imagePath;
imageElement.style.display = "block";
}

function renderList(elementId, items) {
const list = document.getElementById(elementId);
list.innerHTML = "";

items.forEach((item) => {
const li = document.createElement("li");
li.textContent = item;
list.appendChild(li);
});
}

function buildDiagnosisPayload() {
const result = state.diagnosisResult;

return {
dataType: "diagnosis",
timestamp: createTimestamp(),
answer_id: result.answer_id,
answers: {
q01: state.answers.Q01 || "",
q02: state.answers.Q02 || "",
q03: state.answers.Q03 || "",
q04: state.answers.Q04 || "",
q05: state.answers.Q05 || "",
q06: state.answers.Q06 || "",
q07: state.answers.Q07 || "",
q08: state.answers.Q08 || "",
q09: state.answers.Q09 || "",
q10: state.answers.Q10 || "",
q11: state.answers.Q11 || "",
q12: state.answers.Q12 || "",
q13: state.answers.Q13 || "",
q14: state.answers.Q14 || "",
q15: state.answers.Q15 || "",
q16: state.answers.Q16 || ""
},
axis1_score: result.axis1_score,
axis2_score: result.axis2_score,
total_score: result.total_score,
result_type: result.result_type
};
}

async function sendDiagnosisData() {
const payload = buildDiagnosisPayload();

try {
await postToGas(payload);
} catch (error) {
console.error("診断回答データ保存エラー:", error);
}
}

async function sendAccessEvent(eventType) {
const payload = {
dataType: "access",
timestamp: createTimestamp(),
event_type: eventType,
answer_id: state.answerId || ""
};

try {
await postToGas(payload);
} catch (error) {
console.error("アクセス計測データ保存エラー:", error);
}
}

function collectSurveyData() {
return {
result_match: getCheckedValue("result_match"),
recommend_level: getCheckedValue("recommend_level"),
age_group: getCheckedValue("age_group"),
company_size: getCheckedValue("company_size"),
job_type: getCheckedValue("job_type"),
career_change_intent: getCheckedValue("career_change_intent")
};
}

function validateSurvey(surveyData) {
return Object.values(surveyData).every((value) => value !== null && value !== "");
}

async function submitSurvey() {
const surveyData = collectSurveyData();

if (!validateSurvey(surveyData)) {
alert("すべての設問に回答してください。");
return;
}

const payload = {
dataType: "survey",
timestamp: createTimestamp(),
answer_id: state.answerId,
...surveyData
};

try {
const response = await postToGas(payload);

if (response.status === "success") {
showScreen("screen-u08");
} else {
alert("アンケート保存に失敗しました。時間をおいて再度お試しください。");
}
} catch (error) {
console.error("アンケート保存エラー:", error);
alert("アンケート保存に失敗しました。通信環境を確認してください。");
}
}

async function postToGas(payload) {
if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL === "ここにGASのWebアプリURLを貼り付ける") {
console.warn("GAS_WEB_APP_URLが未設定です。", payload);
return { status: "success", message: "GAS未設定のため仮成功" };
}

await fetch(GAS_WEB_APP_URL, {
method: "POST",
mode: "no-cors",
headers: {
"Content-Type": "text/plain;charset=utf-8"
},
body: JSON.stringify(payload)
});

return { status: "success", message: "送信完了" };
}

function getCheckedValue(name) {
const checked = document.querySelector(`input[name="${name}"]:checked`);
return checked ? checked.value : null;
}

function generateAnswerId() {
const now = new Date();

const datePart =
now.getFullYear().toString() +
padZero(now.getMonth() + 1) +
padZero(now.getDate());

const timePart =
padZero(now.getHours()) +
padZero(now.getMinutes()) +
padZero(now.getSeconds());

const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

return `ORGA_${datePart}_${timePart}_${randomPart}`;
}

function createTimestamp() {
const now = new Date();

return (
now.getFullYear() +
"-" +
padZero(now.getMonth() + 1) +
"-" +
padZero(now.getDate()) +
" " +
padZero(now.getHours()) +
":" +
padZero(now.getMinutes()) +
":" +
padZero(now.getSeconds())
);
}

function padZero(number) {
return String(number).padStart(2, "0");
}

function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
const randomIndex = Math.floor(Math.random() * (i + 1));
[array[i], array[randomIndex]] = [array[randomIndex], array[i]];
}

return array;
}

function resetDiagnosis() {
state.currentScreen = "screen-u01";
state.currentQuestionIndex = 0;
state.questionOrder = [];
state.answers = {};
state.answerId = null;
state.diagnosisResult = null;

const radioButtons = document.querySelectorAll('input[type="radio"]');

radioButtons.forEach((radio) => {
radio.checked = false;
});
}

function isDevResultMode() {
const params = new URLSearchParams(window.location.search);
return params.get("dev") === "result";
}

function showDevResult() {
const params = new URLSearchParams(window.location.search);
const type = params.get("type") || "explorer";

const allowedTypes = ["explorer", "craftsman", "supporter", "guardian"];
const resultKey = allowedTypes.includes(type) ? type : "explorer";

const resultData = RESULTS[resultKey];

state.answerId = "DEV_RESULT_MODE";
state.diagnosisResult = {
answer_id: state.answerId,
answers: {},
axis1_score: 80,
axis2_score: 80,
total_score: 80,
result_key: resultKey,
result_type: resultData.typeName,
result_data: resultData
};

renderResult();
showScreen("screen-u05");
}
