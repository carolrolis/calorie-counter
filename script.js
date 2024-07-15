const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;
// In programming, prefixing a variable with "is" or "has" is a common practice to signify that the variable represents a boolean value.
// Later on in the project, the value of isError will be updated if the user provides an invalid input.


function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}
// cleanInputString takes a "str" parameter, so it represents the budget input; it should have no +, no - and no whitespaces(\s).
// The expression between // represents a regular expression that looks for the said items in the inputs.
// A global flag, "/g", specifies a global match. A global match finds all matches (not only the first). Without it, it would replace the elements by the raw order +-\s.
// The .replace() method takes the value of the variable regex and replaces it with an empty string.


function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}
// In HTML, number inputs allow for exponential notation (such as 1e10). It should be considered an invalid input.
// The "e" in a number can also be and uppercase E. The insensitive flag, /i, makes the pattern case-insensitive.
// \d is a shorthand character class to match any digit, [0-9] in this case.
// The plus signs after \d means it can be more than one digit.
// The .match() method will return an array of match results – containing either the first match, or all matches if the global flag is used.  This match result will be used later.


function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
  <div class="input-container-input">
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  </div>
  <div class="input-container-input">
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />
  </div>`;
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}
// Template literals in JavaScript are enclosed by backticks (``) and allow for embedding expressions inside them using ${}. This makes it easy to construct strings with dynamic content.
// #${entryDropdown.value}: this part constructs a string to form an ID selector. entryDropdown.value gets the value of the selected option in the dropdown. For instance, if the selected value is "section1", entryDropdown.value will be "section1". #${entryDropdown.value} becomes #section1.
// .input-container: this part of the string is a class selector target the element within the element that has the selected ID.
// The combined string #${entryDropdown.value} .input-container becomes #section1 .input-container.
// document.querySelector('#section1 .input-container') selects the first element with the class input-container inside the element with the ID section1.
//
// targetInputContainer.querySelectorAll('input[type="text"]') selects all input elements of type text within the targetInputContainer.
// .length returns the number of elements in the NodeList returned by querySelectorAll.
// Adding 1 to the length calculates the new entry number, ensuring that the entries are numbered sequentially.
//
// Inside the HTMLString variable, the function will display new HTML content inside .input-containers, according to the entryDropdown.value
// There is one input of type text, where belongs the name of the new entry. There is another input of type number, where belongs the number of the calories of the entry.
//
// The insertAdjacentHtml method takes two arguments. The first is a string that specifies the position of the inserted element. The is a string containing the HTML to be inserted.
// targetInputContainer.insertAdjacentHTML('beforeend', HTMLString) inserts the constructed HTML string as the last child into the targetInputContainer.


function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return;
  }

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  output.classList.remove('hide');
}
// The first argument passed will be the browser event – e is a common name for this parameter. e.preventDefault() prevents form submission. This ensures that the form data is processed by JavaScript rather than being submitted to a server.
// isError is reset to false.
// Collects calories from each category of inputs - type number using querySelectorAll. Each variable stores a NodeList of number inputs for a specific meal or exercise.
// The function getCaloriesFromInputs is called for each set of inputs to calculate the total calories. The budgetCalories line assumes there is a single input for the calorie budget, which is passed as an array containing budgetNumberInput.
// If isError is set to true, "return" stops the function.
// consumedCalories sums the calories from breakfast, lunch, dinner, and snacks.
// remainingCalories calculates the difference between budgeted calories and consumed calories, adding the calories burned through exercise.
// surplusOrDeficit determines if there is a calorie surplus or deficit based on whether remainingCalories is negative(more consumed) or positive(more burned).
// Then, a HTML string is set to display the results of all the counted calories.
// The class of the span uses the surplusOrDeficit var and applies the .toLowerCase method so it converts to no uppercase characters.
// Math.abs ensures the remaining calories are displayed as a positive number, regardless of whether they indicate a deficit or surplus.

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
  return calories;
}
// calories variable is initialized to 0 and will be used to accumulate the total number of calories from the inputs.
// A for...of loop iterates over each element (declared variable - item) in the list(function argument).
// Storing in currVal, the function takes the value of the current input element (item) and removes any unwanted characters (as defined in the cleanInputString function).
// Storing in invalidInputMatch, the function checks if the cleaned input (currVal) matches any invalid patterns (as defined in the isInvalidInput function). If the input is invalid, it returns a match object; otherwise, it returns null.
// If the result stored in invalidInputMatch is truthy(invalid), it will display an alert message indicating the invalid input found.
// If it's an invalid input, isError is set to true and the function ends by "return null".
// Else, the "Number()" converts the string to a numeric value and adds it to calories var.

function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}
// Storing in inputContainers, querySelectorAll is used to get all elements with the class "input-container". Array.from() converts the NodeList into an actual array.
// A for...of loop iterates over each element (declared variable - container) in the inputContainers and replaces their .innerHTML with an empty string.
// Then, the function cleans the bugdet input and the output.innerText.
// .classList.add('hide') adds the class hide to the output element's list of classes, this action will make the output element invisible again on the page.


addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
// .addEventListener method takes two arguments. The first is the event to listen to. The second is the callback function, or the function that runs when the event is triggered.