const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxjRu9hwPrsuv60Sk1Dejh5YK_qM8So1x2cKFN1gl_1uAmLqwH2SnAIA_nyk1gL3NjZ/exec";

const form = document.querySelector("#surveyForm");
const submitButton = form.querySelector(".submit-button");
const formStatus = document.querySelector("#formStatus");
const thankYou = document.querySelector("#thankYou");

// "Other" radio → enable text input
const bgOtherRadio = document.getElementById("bgOtherRadio");
const bgOtherInput = document.getElementById("bgOtherInput");
const intOtherRadio = document.getElementById("intOtherRadio");
const intOtherInput = document.getElementById("intOtherInput");

bgOtherRadio.addEventListener("change", () => {
  bgOtherInput.disabled = false;
  bgOtherInput.focus();
});

const bgRadios = document.querySelectorAll('input[name="background"]');
bgRadios.forEach((r) => {
  if (r !== bgOtherRadio) {
    r.addEventListener("change", () => {
      bgOtherInput.disabled = true;
      bgOtherInput.value = "";
    });
  }
});

intOtherRadio.addEventListener("change", () => {
  intOtherInput.disabled = false;
  intOtherInput.focus();
});

const intRadios = document.querySelectorAll('input[name="interest"]');
intRadios.forEach((r) => {
  if (r !== intOtherRadio) {
    r.addEventListener("change", () => {
      intOtherInput.disabled = true;
      intOtherInput.value = "";
    });
  }
});

// Validation error messages
const errorMessages = {
  background: "請選擇你的專業背景。",
  helpfulness: "請評價培訓內容對你的幫助程度。",
  difficulty: "請評價你對內容的理解程度。",
  interest: "請選擇你感興趣的主題。",
};

function setError(field, message) {
  const element = document.querySelector(`[data-error-for="${field}"]`);
  if (element) element.textContent = message || "";
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.classList.toggle("is-loading", isLoading);
  submitButton.querySelector(".button-text").textContent = isLoading ? "提交中..." : "提交問卷";
}

function setStatus(message, type = "") {
  formStatus.textContent = message;
  formStatus.className = `form-status${type ? ` is-${type}` : ""}`;
}

function getFormData() {
  const data = new FormData(form);

  let background = String(data.get("background") || "").trim();
  let bgOther = String(data.get("bgOther") || "").trim();
  if (background === "其他" && bgOther) {
    background = `其他：${bgOther}`;
  }

  let interest = String(data.get("interest") || "").trim();
  let intOther = String(data.get("intOther") || "").trim();
  if (interest === "其他" && intOther) {
    interest = `其他：${intOther}`;
  }

  return {
    background,
    helpfulness: String(data.get("helpfulness") || "").trim(),
    difficulty: String(data.get("difficulty") || "").trim(),
    interest,
    comments: String(data.get("comments") || "").trim(),
  };
}

function validate(data) {
  const errors = {};

  if (!data.background) errors.background = errorMessages.background;
  if (!data.helpfulness) errors.helpfulness = errorMessages.helpfulness;
  if (!data.difficulty) errors.difficulty = errorMessages.difficulty;
  if (!data.interest) errors.interest = errorMessages.interest;

  return errors;
}

async function submitSurvey(data) {
  if (GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")) {
    throw new Error("Google Apps Script URL is not configured.");
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Submission failed.");
  }

  return { ok: true };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("");
  clearErrors();

  const data = getFormData();
  const errors = validate(data);

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([field, message]) => setError(field, message));
    setStatus("請先填寫所有必答題（標示 *）。", "error");
    const firstError = document.querySelector(`[data-error-for="${Object.keys(errors)[0]}"]`);
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  try {
    setLoading(true);
    await submitSurvey(data);
    form.hidden = true;
    thankYou.hidden = false;
    thankYou.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    setStatus("暫時未能提交，請稍後再試或聯絡主辦方。", "error");
    console.error(error);
  } finally {
    setLoading(false);
  }
});
