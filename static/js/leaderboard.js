// Function to update the table based on the selected month
function updateTable(month, data) {
  const tableBody = document.querySelector("#leaderboard-body");
  const rows = data[month] || [];
  tableBody.innerHTML = ""; // Clear existing rows

  rows.forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.baseLLM}</td>
      <td>${row.trainingDataCutoffDate}</td>
      <td class="action-type">${row.actionType}</td>
      <td class="binary-kl">${row.binaryKL}</td>
      <td class="quad-kl">${row.quadKL}</td>
      <td class="first-level">${row.firstLevelPre}</td>
      <td class="first-level">${row.firstLevelRec}</td>
      <td class="first-level">${row.firstLevelF1}</td>
      <td class="second-level">${row.secondLevelPre}</td>
      <td class="second-level">${row.secondLevelRec}</td>
      <td class="second-level">${row.secondLevelF1}</td>
    `;
    tr.style.backgroundColor = idx % 2 === 0 ? "#ffffff" : "#f0f0f0";
    tableBody.appendChild(tr);
  });
}

// Function to update the selected month text
function updateSelectedMonth(value, data) {
  const months = Object.keys(data);
  const month = months[value];
  const selectedMonth = document.getElementById("selected-month");
  selectedMonth.textContent = `${month}`;
  updateTable(month, data);
}

// Function to toggle visibility of columns and headers
function toggleColumnVisibility(className, isVisible) {
  // Toggle data columns
  document.querySelectorAll(`.${className}`).forEach((el) => (el.style.display = isVisible ? "" : "none"));

  // Toggle headers
  document.querySelectorAll(`th.${className}`).forEach((el) => (el.style.display = isVisible ? "" : "none"));
}

// Function to toggle all checkboxes
function toggleAllCheckboxes(isChecked) {
  const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]:not(#toggle-all)');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = isChecked;
    toggleColumnVisibility(checkbox.id.replace("toggle-", ""), isChecked);
  });
}

// Function to update the "Select All / Deselect All" label
function updateSelectAllLabel() {
  const allCheckboxes = Array.from(
    document.querySelectorAll('.checkbox-container input[type="checkbox"]:not(#toggle-all)')
  );
  const allChecked = allCheckboxes.every((checkbox) => checkbox.checked);

  // Update the "toggle-all" checkbox state based on the individual checkboxes
  document.getElementById("toggle-all").checked = allChecked;
}

// Add event listener for the slider
const slider = document.getElementById("month-slider");
slider.addEventListener("input", (e) => {
  updateSelectedMonth(e.target.value, data);
});

// Add event listeners for individual column checkboxes
document.querySelectorAll('.checkbox-container input[type="checkbox"]:not(#toggle-all)').forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    toggleColumnVisibility(checkbox.id.replace("toggle-", ""), checkbox.checked);
    updateSelectAllLabel();
  });
});

// Add event listener for the "Select All / Deselect All" checkbox
document.getElementById("toggle-all").addEventListener("change", (e) => {
  const isChecked = e.target.checked;
  toggleAllCheckboxes(isChecked);
  updateSelectAllLabel();
});

// Load JSON data and populate the table
let data; // Declare data in the global scope

document.addEventListener("DOMContentLoaded", () => {
  fetch("static/js/data.json") // Path to your JSON file
    .then((response) => response.json())
    .then((jsonData) => {
      data = jsonData; // Assign the fetched data to the global variable
      const months = Object.keys(data);
      slider.max = months.length - 1; // Set the slider max value based on the number of months
      slider.value = slider.max; // Set the slider to the first (newest) month
      updateSelectedMonth(slider.value, data); // Initialize the table with the default month
    })
    .catch((error) => {
      console.error("Error loading JSON data:", error);
    });
});
