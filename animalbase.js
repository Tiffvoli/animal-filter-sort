"use strict";

window.addEventListener("DOMContentLoaded", start);
let HTML = {};
let allAnimals = [];

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0
};

function start() {
  console.log("ready");
  let selected_filter = "*";
  // TODO: Add event-listeners to filter and sort buttons
  document
    .querySelectorAll("[data-action='filter']")
    .forEach(button => button.addEventListener("click", filterButton));
  document.querySelectorAll("[data-action='sort']").forEach(btn => {
    btn.addEventListener("click", sortButton);
  });

  loadJSON();
}

function filterButton() {
  console.log("filter button");
  console.log(this);

  const filter = this.dataset.filter;

  setFilter(filter);
}

function setFilter(filter) {
  if (filter == "cat") {
    const onlyCats = allAnimals.filter(isCat);
    displayList(onlyCats);
  }
  if (filter == "dog") {
    const onlyDogs = allAnimals.filter(isDog);
    displayList(onlyDogs);
  }
  if (filter == "*") {
    displayList(allAnimals);
  }
}

function isCat(animal) {
  return animal.type == "cat";
}

function isDog(animal) {
  return animal.type == "dog";
}

function sortAnimalsByData(data, sort_direction) {
  let result;
  let sort = document.querySelectorAll("[data-action='sort']");
  sort.forEach((e, i) => {
    e.style.textDecoration = "";
    e.innerText = ["Name", "Type", "Description", "Age"][i];
  });
  document.querySelector(`[data-sort='${data}']`).style.textDecoration =
    "underline";

  if (sort_direction === "asc") {
    document.querySelector(`[data-sort='${data}']`).innerText += "↑";
    result = allAnimals.sort(compareAscFunction);
  } else if (sort_direction === "desc") {
    document.querySelector(`[data-sort='${data}']`).innerText += "↓";
    result = allAnimals.sort(compareDescFunction);
  }

  function compareAscFunction(a, b) {
    if (a[data] < b[data]) return -1;
    else if (a[data] === b[data]) return 0;
    else return 1;
  }
  function compareDescFunction(a, b) {
    if (a[data] > b[data]) return -1;
    else if (a[data] === b[data]) return 0;
    else return 1;
  }
  return result;
}

function sortButton(e) {
  const selected_sort = e.target.dataset.sort;
  const selected_sort_direction = e.target.dataset.sortDirection;
  displayList(sortAnimalsByData(selected_sort, selected_sort_direction));
  if (selected_sort_direction === "asc")
    e.target.dataset.sortDirection = "desc";
  else if (selected_sort_direction === "desc")
    e.target.dataset.sortDirection = "asc";
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  // TODO: This might not be the function we want to call first

  displayList(allAnimals);
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document
    .querySelector("template#animal")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

//filter functions
function filterAnimalType(type) {
  const result = allAnimals.filter(filterFunction);

  function filterFunction(animals) {
    if (animal.type === type) return true;
    else return false;
  }
  return result;
}
