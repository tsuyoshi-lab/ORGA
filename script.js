// script.js
// ORGA(β版) メイン制御

// ===============================
// 開発モード設定
// ===============================
// true：開発モードON
// false：通常公開モード
const DEV_MODE = true;

// 開発時に直接表示したい画面
// "U01" トップページ
// "U02" 診断説明画面
// "U03" 質問画面
// "U04" 診断処理画面
// "U05" 結果表示画面
// "U06" ORGA解説画面
// "U07" アンケート画面
// "U08" 完了画面
const DEV_PAGE = "U05";

// U05 結果表示画面を確認する時の仮タイプ
// "pioneer"   開拓者タイプ
// "craftsman" 職人タイプ
// "supporter" 支援者タイプ
// "guardian"  守護者タイプ
const DEV_RESULT_KEY = "pioneer";

// ===============================
// GAS設定
// ===============================
const GAS_WEB_APP_URL = "ここにGASのWebアプリURLを貼り付ける";

// ===============================
// 状態管理
// ===============================
const state = {
  currentScreen: "screen-u01",
  currentQuestionIndex: 0,
  questionOrder: [],
  answers: {},
  answerId: null,
  diagnosisResult: null
};

// ===============================
// 初期処理
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();

  if (DEV_MODE) {
    initializeDevelopmentMode();
    return;
  }

  showScreen("screen-u01");
  sendAccessEvent("page_view");
});

// ===============================
// 開発モード初期化
// ===============================
function initializeDevelopmentMode() {
  console.warn("ORGA 開発モードで起動しています。公開時は DEV_MODE を false にしてください。");

  state.answerId = "DEV_MODE_ANSWER_ID";
  state.answers = createDummyAnswers();
  state.diagnosisResult = createDummyDiagnosisResult(DEV_RESULT_KEY);

  switch (DEV_PAGE) {
    case "U01":
      showScreen("screen-u01");
      break;

    case "U02":
      showScreen("screen-u02");
      break;

    case "U03":
      state.currentQuestionIndex = 0;
      state.questionOrder = shuffleArray([...QUESTIONS]);
      showScreen("screen-u03");
      renderQuestion();
      break;

    case "U04":
      showScreen("screen-u04");
      break;

    case "U05":
      renderResult();
      showScreen("screen-u05");
      break;

    case "U06":
      showScreen("screen-u06");
      break;

    case "U07":
      showScreen("screen-u07");
      break;

    case "U08":
      showScreen("screen-u08");
      break;

    default:
      showScreen("screen-u01");
      break;
  }
}

// ===============================
// 開発用ダミー回答
// ===============================
function createDummyAnswers() {
  return {
    Q01: "positive",
    Q02: "positive",
    Q03: "positive",
    Q04: "positive",
    Q05: "positive",
    Q06: "positive",
    Q07: "positive",
    Q08: "positive",
    Q09: "positive",
    Q10: "positive",
    Q11: "positive",
    Q12: "positive",
    Q13: "positive",
    Q14: "positive",
    Q15: "positive",
    Q16: "positive"
  };
}

// ===============================
// 開発用ダミー診断結果
// ===============================
function createDummyDiagnosisResult(resultKey) {
  const safeResultKey = RESULTS[resultKey] ? resultKey : "pioneer";
  const resultData = RESULTS[safeResultKey];

  return {
    answer_id: state.answerId || "DEV_MODE_ANSWER_ID",
    answers: state.answers,
    axis1_score: 80,
    axis2_score: 70,
    total_score: 77,
    result_key: safeResultKey,
    result_type: resultData.typeName,
    result_data: resultData
  };
}

// ===============================
// イベント設定
// ===============================
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

// ===============================
// 画面表示切替
// ===============================
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

// ===============================
// 診断開始
// ===============================
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

// ===============================
// 質問表示
// ===============================
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

// ===============================
// 回答選択
// ===============================
function selectOption(questionId, direction, selectedButton) {
  state.answers[questionId] = direction;

  const optionButtons = document.querySelectorAll(".option-button");

  optionButtons.forEach((button) => {
    button.classList.remove("selected");
  });

  selectedButton.classList.add("selected");

  document.getElementById("next-question-button").disabled = false;
}

// ===============================
// 次の質問へ
// ===============================
function goToNextQuestion() {
  const isLastQuestion = state.currentQuestionIndex >= state.questionOrder.length - 1;

  if (isLastQuestion) {
    showLoadingAndCalculate();
    return;
  }

  state.currentQuestionIndex += 1;
  renderQuestion();
}

// ===============================
// 診断処理
// ===============================
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

// ===============================
// 診断結果計算
// ===============================
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

// ===============================
// タイプ判定
// ===============================
function judgeResultType(axis1Score, axis2Score) {
  if (axis1Score >= 50 && axis2Score >= 50) {
    return "pioneer";
  }

  if (axis1Score >= 50 && axis2Score < 50) {
    return "craftsman";
  }

  if (axis1Score < 50 && axis2Score >= 50) {
    return "supporter";
  }

  return "guardian";
}

// ===============================
// 結果表示
// ===============================
function renderResult() {
  if (!state.diagnosisResult) {
    state.answerId = "DEV_MODE_ANSWER_ID";
    state.answers = createDummyAnswers();
    state.diagnosisResult = createDummyDiagnosisResult(DEV_RESULT_KEY);
  }

  const result = state.diagnosisResult;
  const resultData = result.result_data;

  document.getElementById("result-type").textContent = resultData.typeName;
  document.getElementById("total-score").textContent = `総合適応指数：${result.total_score}点`;
  document.getElementById("result-catch-copy").textContent = resultData.catchCopy;
  document.getElementById("result-description").textContent = resultData.description;

  renderList("result-strengths", resultData.strengths);
  renderList("result-cautions", resultData.cautions);
}

// ===============================
// リスト表示
// ===============================
function renderList(elementId, items) {
  const list = document.getElementById(elementId);
  list.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

// ===============================
// 診断データ作成
// ===============================
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

// ===============================
// 診断データ送信
// ===============================
async function sendDiagnosisData() {
  if (DEV_MODE) {
    console.warn("開発モードのため、診断データは送信しません。");
    return;
  }

  const payload = buildDiagnosisPayload();

  try {
    await postToGas(payload);
  } catch (error) {
    console.error("診断回答データ保存エラー:", error);
  }
}

// ===============================
// アクセスイベント送信
// ===============================
async function sendAccessEvent(eventType) {
  if (DEV_MODE) {
    console.warn("開発モードのため、アクセス計測データは送信しません。", eventType);
    return;
  }

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

// ===============================
// アンケートデータ取得
// ===============================
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

// ===============================
// アンケート入力確認
// ===============================
function validateSurvey(surveyData) {
  return Object.values(surveyData).every((value) => value !== null && value !== "");
}

// ===============================
// アンケート送信
// ===============================
async function submitSurvey() {
  const surveyData = collectSurveyData();

  if (!validateSurvey(surveyData)) {
    alert("すべての設問に回答してください。");
    return;
  }

  if (!state.answerId) {
    state.answerId = "DEV_MODE_ANSWER_ID";
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

// ===============================
// GAS送信
// ===============================
async function postToGas(payload) {
  if (DEV_MODE) {
    console.warn("開発モードのため、GAS送信は行いません。", payload);
    return { status: "success", message: "開発モードのため仮成功" };
  }

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

// ===============================
// ラジオボタン取得
// ===============================
function getCheckedValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : null;
}

// ===============================
// 回答ID生成
// ===============================
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

// ===============================
// タイムスタンプ生成
// ===============================
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

// ===============================
// ゼロ埋め
// ===============================
function padZero(number) {
  return String(number).padStart(2, "0");
}

// ===============================
// 配列シャッフル
// ===============================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
}

// ===============================
// 診断リセット
// ===============================
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
