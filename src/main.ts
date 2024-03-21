import './style.css'



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>To Do List</h1>
 <div class="input-text-container"> <input type="text" id="create-checkmark" value=""/>
 <label class="input-placeholder" for="create-checkmark">Enter the text</label></div>
  <div class="list"></div>
`

// Define the type for a checkmark
interface Checkmark {
  text: string;
  checked: boolean;
}

// Get the list element
const list = document.querySelector<HTMLDivElement>('.list') as HTMLDivElement;

// Get the input element for creating new checkmarks
const inputCreate = document.getElementById('create-checkmark') as HTMLInputElement;

// Get the checkmarks from localStorage or initialize an empty array
let checkmarks: Checkmark[] = JSON.parse(localStorage.getItem('checkmarks') || '[]');

// Function to remove a checkmark with animation
function removeCheckmark(index: number) {
  const checkboxDiv = document.getElementById(`checkmark-${index}`)?.parentNode as HTMLElement;
  if (checkboxDiv) {
    checkboxDiv.classList.add('remove');
    setTimeout(() => {
      checkmarks.splice(index, 1);
      localStorage.setItem('checkmarks', JSON.stringify(checkmarks));
      renderCheckmarks();
    }, 300);
  }
}

// Function to render the checkmarks with animations
function renderCheckmarks() {
  list.innerHTML = '';
  checkmarks.forEach((checkmark, index) => {
      const checkmarkDiv = document.createElement('div');
      checkmarkDiv.classList.add('add'); // Add class for scaling animation
      checkmarkDiv.innerHTML = `
          <input id="checkmark-${index}" name="checkmark-${index}" type="checkbox" value="${checkmark.text}" ${checkmark.checked ? 'checked' : ''}/>
          <label class="${checkmark.checked ? 'checked' : ''}" for="checkmark-${index}">${checkmark.text}</label>
          <button class="remove-button" data-index="${index}">X</button>
      `;
      list.appendChild(checkmarkDiv);

      // Add event listener to toggle the checked state
      const checkbox = checkmarkDiv.querySelector<HTMLInputElement>('input[type="checkbox"]');
      checkbox?.addEventListener('change', () => {
          checkmark.checked = checkbox.checked;
          localStorage.setItem('checkmarks', JSON.stringify(checkmarks));
      });

      // Add event listener to remove the item
      const removeButton = checkmarkDiv.querySelector<HTMLButtonElement>('.remove-button');
      removeButton?.addEventListener('click', () => {
          removeCheckmark(index);
      });

      // Trigger reflow to apply the scaling animation
      void checkmarkDiv.offsetWidth;
      checkmarkDiv.classList.remove('add'); // Remove class to start the animation
  });
}

// Event listener for creating a new checkmark
inputCreate?.addEventListener('keyup', (e) => {
  if ((e as KeyboardEvent).key === 'Enter') {
      const newText = inputCreate.value.trim();
      if (newText) {
          checkmarks.push({ text: newText, checked: false });
          localStorage.setItem('checkmarks', JSON.stringify(checkmarks));
          inputCreate.value = '';
          renderCheckmarks();
      }
  }
});

// Initial rendering of checkmarks
renderCheckmarks();
