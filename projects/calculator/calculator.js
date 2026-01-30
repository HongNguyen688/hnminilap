const input = document.getElementById("js_textinput");

//Add button value
function btnValue(value) {
  input.value += value;
}

// AC button
function clearAll() {
  input.value = "";
}

// C button (delete last number)
function deletelast() {
  input.value = input.value.slice(0, -1);
}

//Equal button
function equalBtn() {
  let userValue = input.value.trim();
  if (!userValue) return;

  userValue = userValue.replace(/%/g, "/100");

  try {
    let result = eval(userValue);
    if (isNaN(result) || !isFinite(result)) {
      input.value = "Error";
    } else {
      input.value = Number(result.toFixed(8)); // Limit to 8 decimal places
    }
  } catch (e) {
    // Silently ignore errors – keeps current input (perfect for incomplete expressions)
  }
}

// === KEYBOARD SUPPORT FOR CALCULATOR ===
document.addEventListener("keydown", function (event) {
  // Get the key that was pressed
  const key = event.key;

  // Numbers 0-9
  if (key >= "0" && key <= "9") {
    btnValue(key);
  }
  // Decimal point
  else if (key === "." || key === ",") {
    btnValue(".");
  }

  // Operators
  else if (key === "+") {
    btnValue("+");
  } else if (key === "-") {
    btnValue("-");
  } else if (key === "*" || key === "x" || key === "X") {
    btnValue("*");
  } else if (key === "/") {
    btnValue("/");
  } else if (key === "%") {
    btnValue("%");
  }

  // Enter key or = key → calculate result
  else if (key === "Enter" || key === "=") {
    equalBtn();
  }

  // Backspace → delete last character
  else if (key === "Backspace") {
    deletelast();
  }

  // Escape or 'c' or 'C' → clear all (AC)
  else if (key === "Escape" || key.toLowerCase() === "c") {
    clearAll();
  }

  // Delete key → also clear all (optional)
  else if (key === "Delete") {
    clearAll();
  }
});
