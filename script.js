$(document).ready(function () {
  // DOM Element and Context Setup
  const $canvas = $("#signatureCanvas");
  const canvas = $canvas[0];
  const ctx = canvas.getContext("2d");

  const $searchButton = $("#searchAppIdButton");
  const $clearButton = $("#clearSignature");
  const $undoButton = $("#undoSignature");
  const $redoButton = $("#redoSignature");
  const $approveButton = $("#approveButton");
  const $messageBox = $("#messageBox");
  const $messageText = $("#messageText");
  const $appIdInput = $("#appIdInput");
  const $formContainer = $("#approvalFormContainer");
  const $successCard = $("#successCard");
  const $signedAppIdDisplay = $("#signedAppIdDisplay");
  const $signatureImage = $("#signatureImage");
  const $signatureSection = $("#signatureSection");
  const $statusContainer = $("#statusMessageContainer");
  const $statusText = $("#statusMessageText");
  const $agreementCheckbox = $("#agreementCheckbox");
  const $applicantNameDisplay = $("#applicantNameDisplay");
  const $currentDateDisplay = $("#currentDateDisplay");
  const $currentTimeDisplay = $("#currentTimeDisplay");
  const $agreementText = $("#agreementText");

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let currentAppId = null;
  let signatureHistory = [];
  let historyStep = -1;

  // Original button text
  const searchButtonOriginalText =
    '<i class="bi bi-search me-2"></i> ရှာဖွေမည်';

  // --- Canvas Functions (No Change) ---
  function resizeCanvas() {
    // ... (resizeCanvas function - same as previous fix)
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;

    const currentSignature = canvas.toDataURL();
    canvas.width = rect.width;
    canvas.height = 200;

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (currentSignature && currentSignature !== "data:,") {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = currentSignature;
    }
  }

  function getCoords(event) {
    // ... (getCoords function - no change)
    const rect = canvas.getBoundingClientRect();
    let x, y;
    const originalEvent = event.originalEvent || event;

    if (originalEvent.touches && originalEvent.touches.length > 0) {
      x = originalEvent.touches[0].clientX - rect.left;
      y = originalEvent.touches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }
    return { x, y };
  }

  function startDrawing(e) {
    // ... (startDrawing function - no change)
    e.preventDefault();
    isDrawing = true;
    const { x, y } = getCoords(e);
    [lastX, lastY] = [x, y];
  }

  function draw(e) {
    // ... (draw function - no change)
    if (!isDrawing) return;
    e.preventDefault();

    const { x, y } = getCoords(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
    // ... (stopDrawing function - no change)
    if (!isDrawing) return;
    isDrawing = false;
    saveSignatureState();
  }

  function isCanvasEmpty() {
    // ... (isCanvasEmpty function - no change)
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 0; i < pixelData.length; i += 4) {
      if (
        pixelData[i + 3] > 0 &&
        (pixelData[i] !== 255 ||
          pixelData[i + 1] !== 255 ||
          pixelData[i + 2] !== 255)
      ) {
        return false;
      }
    }
    return true;
  }

  function clearCanvas() {
    // ... (clearCanvas function - no change)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    signatureHistory = [];
    historyStep = -1;
    showMessage(
      "လက်မှတ် ရှင်းလင်းပြီးပါပြီ။ ကျေးဇူးပြု၍ ပြန်လည်လက်မှတ်ထိုးပါ။",
      "text-danger"
    );
  }

  // --- Undo/Redo Functions (No Change) ---
  function saveSignatureState() {
    // ... (saveSignatureState function - no change)
    historyStep++;
    if (historyStep < signatureHistory.length) {
      signatureHistory.length = historyStep;
    }
    signatureHistory.push(canvas.toDataURL());
  }

  function restoreSignatureState() {
    // ... (restoreSignatureState function - no change)
    if (historyStep >= 0 && signatureHistory[historyStep]) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = signatureHistory[historyStep];
    } else {
      clearCanvas();
    }
  }

  function undoSignature() {
    // ... (undoSignature function - no change)
    if (historyStep > 0) {
      historyStep--;
      restoreSignatureState();
    } else if (historyStep === 0) {
      clearCanvas();
    }
  }

  function redoSignature() {
    // ... (redoSignature function - no change)
    if (historyStep < signatureHistory.length - 1) {
      historyStep++;
      restoreSignatureState();
    }
  }

  // --- Message Handlers (No Change) ---
  function showMessage(text, color) {
    // ... (showMessage function - no change)
    $messageText.html(text);
    $messageText.removeClass().addClass(color);
    $messageBox.removeClass("d-none");

    setTimeout(() => {
      $messageBox.addClass("d-none");
    }, 5000);
  }

  function showStatusMessage(text, type) {
    // ... (showStatusMessage function - added alert-info and rounded-3 for modern look)
    $statusText.html(text);
    $statusText
      .removeClass()
      .addClass(`alert alert-${type} mb-0 small rounded-3`);
    $statusContainer.removeClass("d-none");
    $signatureSection.addClass("d-none");
    $agreementText.addClass("d-none");
  }

  // --- Mock API Data and Logic (No Change) ---
  const mockSignedData = {
    // ... (mockSignedData object - no change)
    "APP-100001": {
      signature:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICA... (Mock Signature Data 1)",
      applicantName: "ဦးအောင်ကျော်ကျော်",
      date: "Nov 15, 2023",
      time: "10:30:00",
    },
    "APP-200002": {
      signature:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICA... (Mock Signature Data 2)",
      applicantName: "ဒေါ်မြတ်နိုး",
      date: "Dec 01, 2023",
      time: "14:15:00",
    },
  };

  function mockCheckAppId(appId) {
    // ... (mockCheckAppId function - no change)
    return new Promise((resolve) => {
      setTimeout(() => {
        const formattedAppId = appId.toUpperCase();

        if (formattedAppId === "APP-123456") {
          resolve({
            status: "pending",
            message:
              '<i class="bi bi-info-circle-fill me-2"></i>ဤလျှောက်လွှာအမှတ်အတွက် ဒီဇိုင်းကို အတည်ပြုရန် ကျန်ရှိနေပါသည်။',
            is_signed: false,
            data: {
              applicantName: "ကိုကို",
              date: null,
              time: null,
            },
          });
        } else if (mockSignedData[formattedAppId]) {
          const signedInfo = mockSignedData[formattedAppId];
          resolve({
            status: "approved",
            message:
              '<i class="bi bi-check-circle-fill me-2"></i>ဤလျှောက်လွှာအမှတ်အတွက် ဒီဇိုင်းကို အတည်ပြုပြီးပါပြီ။ ထပ်မံလက်မှတ်ထိုးရန်မလိုအပ်ပါ။',
            is_signed: true,
            data: {
              applicantName: signedInfo.applicantName,
              date: signedInfo.date,
              time: signedInfo.time,
              signature_url: signedInfo.signature,
            },
          });
        } else if (
          formattedAppId === "APP-000000" ||
          formattedAppId === "000000"
        ) {
          resolve({
            status: "not_found",
            message:
              '<i class="bi bi-x-octagon-fill me-2"></i>**မှားယွင်းသော လျှောက်လွှာအမှတ် (APP ID)**။ ထိုနံပါတ်ဖြင့် မှတ်တမ်း မတွေ့ပါ။',
            is_signed: false,
            data: null,
          });
        } else {
          resolve({
            status: "pending",
            message:
              '<i class="bi bi-info-circle-fill me-2"></i>ဤလျှောက်လွှာအမှတ်အတွက် ဒီဇိုင်းကို အတည်ပြုရန် ကျန်ရှိနေပါသည်။',
            is_signed: false,
            data: {
              applicantName: "ဧည့်သည်",
              date: null,
              time: null,
            },
          });
        }
      }, 1000);
    });
  }

  // --- Event Handlers ---
  async function searchAppIdStatus() {
    const appId = $appIdInput.val().trim();
    currentAppId = null;

    $statusContainer.addClass("d-none");
    $signatureSection.addClass("d-none");
    $messageBox.addClass("d-none");
    $successCard.addClass("d-none");
    $formContainer.removeClass("d-none");

    // Button ၏ စာသားကို ပြောင်းလဲခြင်း
    $searchButton
      .prop("disabled", true)
      .html(
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>ရှာဖွေနေသည်...'
      );

    if (!appId) {
      showMessage(
        '<i class="bi bi-exclamation-triangle-fill me-2"></i> ကျေးဇူးပြု၍ **လျှောက်လွှာအမှတ် (APP ID)** ကို ထည့်သွင်းပါ။',
        "text-danger"
      );
      $searchButton.prop("disabled", false).html(searchButtonOriginalText);
      return;
    }

    const result = await mockCheckAppId(appId);
    // Button ၏ စာသားကို Icon အသစ်ဖြင့် ပြန်ပြောင်းခြင်း
    $searchButton.prop("disabled", false).html(searchButtonOriginalText);

    currentAppId = appId;

    // Reset agreement checkbox and button
    $agreementCheckbox.prop("checked", false);
    $approveButton.prop("disabled", true);

    if (result.status === "approved") {
      // လက်မှတ်ထိုးပြီးသား ID
      showStatusMessage(result.message, "success");
    } else if (result.status === "pending") {
      // လက်မှတ် မထိုးရသေးသော ID
      showStatusMessage(result.message, "info");
      $signatureSection.removeClass("d-none");
      $agreementText.removeClass("d-none");
      clearCanvas();

      // Set applicant details
      $applicantNameDisplay.text(result.data.applicantName);
      const now = new Date();
      $currentDateDisplay.text(
        now.toLocaleDateString("my-MM", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
      $currentTimeDisplay.text(
        now.toLocaleTimeString("my-MM", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      saveSignatureState();
    } else if (result.status === "not_found") {
      // မရှိသော ID
      showStatusMessage(result.message, "danger");
    }
  }

  function handleApprove() {
    // ... (handleApprove function - no change)
    if (!currentAppId) {
      showMessage(
        '<i class="bi bi-exclamation-triangle-fill me-2"></i> ကျေးဇူးပြု၍ **လျှောက်လွှာအမှတ် (APP ID)** ကို ရှာဖွေပါ။',
        "text-danger"
      );
      return;
    }

    if (isCanvasEmpty()) {
      showMessage(
        '<i class="bi bi-exclamation-triangle-fill me-2"></i> အတည်မပြုနိုင်ပါ။ ကျေးဇူးပြု၍ ဒီဇိုင်းအတည်ပြုရန် **ဒစ်ဂျစ်တယ်လက်မှတ်** ထိုးပါ။',
        "text-danger"
      );
      return;
    }

    if (!$agreementCheckbox.is(":checked")) {
      showMessage(
        '<i class="bi bi-exclamation-triangle-fill me-2"></i> ဆက်မလုပ်ဆောင်နိုင်ပါ။ စည်းကမ်းချက်များကို သဘောတူကြောင်း **အမှန်ခြစ်** ပေးပါ။',
        "text-danger"
      );
      return;
    }

    // --- Success Path ---
    const signatureDataURL = canvas.toDataURL("image/png");
    const applicantName = $applicantNameDisplay.text();
    const currentDate = $currentDateDisplay.text();
    const currentTime = $currentTimeDisplay.text();

    console.log("လျှောက်လွှာအမှတ် (APP ID):", currentAppId);

    // Save to mock API (or send to real API)
    mockSignedData[currentAppId.toUpperCase()] = {
      signature: signatureDataURL,
      applicantName: applicantName,
      date: currentDate,
      time: currentTime,
    };

    // 1. Form ကို ပိတ်မည်။
    $formContainer.addClass("d-none");

    // 2. အတည်ပြုချက်ကတ်ကို ဖြည့်စွက်မည်။
    $signedAppIdDisplay.text(currentAppId);
    $signatureImage.attr("src", signatureDataURL);

    // 3. အောင်မြင်ကြောင်း ကတ်ပြားကို ဖွင့်မည်။
    $successCard.removeClass("d-none");

    $messageBox.addClass("d-none");
  }

  // INITIALIZATION AND EVENT LISTENERS
  resizeCanvas();
  $(window).on("resize", resizeCanvas);

  $canvas.on("mousedown touchstart", startDrawing);
  $canvas.on("mousemove touchmove", draw);
  $(document).on("mouseup touchend touchcancel", stopDrawing);

  $searchButton.on("click", searchAppIdStatus);
  $clearButton.on("click", clearCanvas);
  $undoButton.on("click", undoSignature);
  $redoButton.on("click", redoSignature);
  $approveButton.on("click", handleApprove);

  // Enable/Disable approve button based on checkbox
  $agreementCheckbox.on("change", function () {
    $approveButton.prop("disabled", !this.checked);
  });

  // Initial disable of approve button
  $approveButton.prop("disabled", true);
});
