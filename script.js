//  general consts /
const billAmount = document.getElementById("bill");
const numberOfPeople = document.getElementById("people");
const tipRadios = document.querySelectorAll('input[name="tip"]');
const billPersonValue = document.querySelector(".bill-person-value");
const tipPersonValue = document.querySelector(".tip-person-value");
const totalPersonValue = document.querySelector(".total-person-value");
const finalAmountValue = document.querySelector(".final-amount-value");
const calculateButton = document.querySelector(".calculate-button");
const resetButton = document.querySelector(".reset-button");
let selectedTip = 0;

// mistake messages consts
const errorMsgBill = document.querySelector(".error-msg-bill");
const errorMsgPeople = document.querySelector(".error-msg-people");
const errorMsgTip = document.querySelector(".error-msg-tip");

// bill amount input and and correcting common errors (+ - sings, negatives nums etc.)
billAmount.addEventListener("keydown", function (e) {
  let key = e.key;

  // no input '+', '-', 'Add' и 'Subtract'
  if (key === "+" || key === "-" || key === "Add" || key === "Subtract") {
    e.preventDefault();
  }
});

billAmount.addEventListener("input", function (e) {
  let value = billAmount.value;
  let selectionStart = billAmount.selectionStart;

  const oldValue = value;
  value = value.replace(/[^0-9.,]/g, "");

  // no first 0 (zero), if no comma or point after its
  if (
    value.startsWith("0") &&
    value.length > 1 &&
    value[1] !== "." &&
    value[1] !== ","
  ) {
    value = value.slice(1);
    selectionStart--;
  }

  // only one point or comma
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
    selectionStart--;
  }

  // max 5 nums before to a point or comma
  if (parts[0].length > 5) {
    value = parts[0].slice(0, 5) + (parts[1] ? "." + parts[1] : "");
    selectionStart--;
  }

  // max 2 nums after a point or comma
  if (parts[1] && parts[1].length > 2) {
    value = parts[0] + "." + parts[1].slice(0, 2);
    selectionStart--;
  }

  if (value !== oldValue) {
    billAmount.value = value;
    billAmount.setSelectionRange(selectionStart, selectionStart);
  }

  // Bill amount - checking other mistakes
  if (parseFloat(billAmount.value) > 0) {
    errorMsgBill.style.visibility = "hidden";
    billAmount.style.outline = "none";
  }
});

// checking bill amount and mistake message
function validateBillAmount() {
  const bill = parseFloat(billAmount.value);
  if (isNaN(bill) || bill <= 0) {
    errorMsgBill.style.visibility = "visible";
    billAmount.style.outline = "1px solid var(--mistakeMessageColor)";
    return false;
  } else {
    errorMsgBill.style.visibility = "hidden";
    billAmount.style.outline = "none";
    return true;
  }
}

// tips % input
tipRadios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (radio.checked) {
      selectedTip = parseFloat(radio.value);
      errorMsgTip.style.visibility = "hidden";
    }
  });
});

// checking choosing tips %

function validateTipSelection() {
  let isSelected = false;
  tipRadios.forEach((radio) => {
    if (radio.checked) {
      isSelected = true;
    }
  });

  if (!isSelected) {
    errorMsgTip.style.visibility = "visible";
  } else {
    errorMsgTip.style.visibility = "hidden";
  }

  return isSelected;
}

// checking nums of people and mistake message
function validatePeopleCount() {
  const people = parseInt(numberOfPeople.value);
  if (isNaN(people) || people <= 0) {
    errorMsgPeople.style.visibility = "visible";
    numberOfPeople.style.outline = "1px solid var(--mistakeMessageColor)";
    return false;
  } else {
    errorMsgPeople.style.visibility = "hidden";
    numberOfPeople.style.outline = "none";
    return true;
  }
}

// "Calculate" button
calculateButton.addEventListener("click", function () {
  // checking functions for bill, people and tips
  const isBillValid = validateBillAmount();
  const isPeopleValid = validatePeopleCount();
  const isTipValid = validateTipSelection();

  if (isBillValid && isPeopleValid && isTipValid) {
    calculateBillPerPerson();
  }
});

// Functions for calculate amounts

function calculateBillPerPerson() {
  const bill = parseFloat(billAmount.value);
  const people = parseInt(numberOfPeople.value);

  const totalTip = (bill * selectedTip) / 100; // tips
  const tipPerPerson = (totalTip / people).toFixed(2); // tips for person
  const billPerPerson = (bill / people).toFixed(2); // bill for person

  // Total amount for person
  const totalPerPerson = (
    parseFloat(billPerPerson) + parseFloat(tipPerPerson)
  ).toFixed(2);

  // Total amount for all
  const finalAmountForAll = (people * totalPerPerson).toFixed(0);

  // Results display
  billPersonValue.textContent = `$${billPerPerson}`;
  tipPersonValue.textContent = `$${tipPerPerson}`;
  totalPersonValue.textContent = `$${totalPerPerson}`;
  finalAmountValue.textContent = `$${finalAmountForAll}`;
}

// Disabling error messages when the correct info is selected (before pressing Calculation button)

// Bill amount section
billAmount.addEventListener("focus", function () {
  errorMsgBill.style.visibility = "hidden";
  billAmount.style.outline = "none";
});

billAmount.addEventListener("input", function () {
  if (parseFloat(billAmount.value) > 0) {
    errorMsgBill.style.visibility = "hidden";
    billAmount.style.outline = "none";
  }
});

// numbers of people section
numberOfPeople.addEventListener("focus", function () {
  errorMsgPeople.style.visibility = "hidden";
  numberOfPeople.style.outline = "none";
});

numberOfPeople.addEventListener("change", function () {
  if (parseInt(numberOfPeople.value) > 0) {
    errorMsgPeople.style.visibility = "hidden";
    numberOfPeople.style.outline = "none";
  }
});

// tips section
tipRadios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (radio.checked) {
      errorMsgTip.style.visibility = "hidden";
    }
  });
});

// Reset button
resetButton.addEventListener("click", function () {
  resetValues();
});

function resetValues() {
  billAmount.value = "";
  numberOfPeople.value = "";
  tipRadios.forEach((radio) => (radio.checked = false));
  billPersonValue.textContent = "$0.00";
  tipPersonValue.textContent = "$0.00";
  totalPersonValue.textContent = "$0.00";
  finalAmountValue.textContent = "$0.00";
  errorMsgBill.style.visibility = "hidden";
  billAmount.style.outline = "none";
  errorMsgPeople.style.visibility = "hidden";
  numberOfPeople.style.outline = "none";
  errorMsgTip.style.visibility = "hidden";
  selectedTip = 0;
}
