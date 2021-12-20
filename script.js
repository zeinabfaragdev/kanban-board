const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
const addBtnContainer = document.querySelectorAll(".add-btn-group");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("listArrays")) {
    listArrays = JSON.parse(localStorage.listArrays);
  } else {
    listArrays = [
      ["Release the course", "Sit back and relax"],
      ["Work on projects", "Listen to music"],
      ["Being cool", "Getting stuff done"],
      ["Being uncool"],
    ];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  localStorage.setItem("listArrays", JSON.stringify(listArrays));
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
    updatedOnLoad = true;
  }

  listColumns.forEach((column, i) => {
    column.textContent = "";
    listArrays[i].forEach((item, j) => {
      createItemEl(column, i, item, j);
    });
  });
  updateSavedColumns();
}

function updateItem(index, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[index].textContent) {
      selectedArray.splice(index, 1);
    } else {
      selectedArray[index] = selectedColumnEl[index].textContent;
    }
    updateDOM();
  }
}

function showInputBox(col) {
  addBtns[col].style.display = "none";
  addBtnContainer[col].style.justifyContent = "flex-end";
  saveItemBtns[col].style.display = "flex";
  addItemContainers[col].style.display = "flex";
}

function addToColumn(col) {
  const itemText = addItems[col].textContent;
  if (itemText.trim() !== "") {
    listArrays[col].push(itemText);
  }
  addItems[col].textContent = "";
  updateDOM();
}
function hideInputBox(col) {
  addBtns[col].style.display = "flex";
  addBtnContainer[col].style.justifyContent = "space-between";
  saveItemBtns[col].style.display = "none";
  addItemContainers[col].style.display = "none";
  addToColumn(col);
}

function rebuildArrays() {
  listColumns.forEach((column, i) => {
    listArrays[i] = Array.from(column.children).map(
      (child) => child.textContent
    );
  });
  updateDOM();
}

function drag(e) {
  dragging = true;
  draggedItem = e.target;
}

function dragEnter(col) {
  listColumns[col].classList.add("over");
  currentColumn = col;
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  listColumns.forEach((col) => {
    col.classList.remove("over");
  });

  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;

  rebuildArrays();
}

updateDOM();
