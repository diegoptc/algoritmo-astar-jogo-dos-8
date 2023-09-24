export function drawMatrix(matrix: any[][]) {
  const matrixContainer = document.getElementById('matrix')!
  matrixContainer.innerHTML = '';
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const element = document.createElement('div');
      element.classList.add('card', 'text-xl', 'font-bold', 'text-black', 'p-12');
      if (matrix[i][j] != 0) {
        element.innerHTML = matrix[i][j];
        element.classList.add('bg-[#8f7a51]', 'shadow-inner', 'shadow-2xl');
      }
      matrixContainer?.appendChild(element);
    }
  } 
}

export function disabledActions() {
  const shuffleButton = document.getElementById('shuffleButton')! as HTMLButtonElement;
  shuffleButton.disabled = true;
  

  const startButton = document.getElementById('startButton')! as HTMLButtonElement;
  startButton.disabled = true;
}

export function enabledActions() {
  const shuffleButton = document.getElementById('shuffleButton')! as HTMLButtonElement;
  shuffleButton.disabled = false;

  
  const startButton = document.getElementById('startButton')! as HTMLButtonElement;
  startButton.disabled = false;
}