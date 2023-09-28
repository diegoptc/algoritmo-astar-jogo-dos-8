export function drawMatrix(matrix: any[][]) {
  const matrixContainer = document.getElementById('matrix')!
  matrixContainer.innerHTML = '';
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const element = document.createElement('div');
      element.setAttribute('data-value', matrix[i][j]);
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

export function drawStats(g: number, h: number, f: number, i: number) {
  document.getElementById('gValue')!.innerHTML = g+'';
  document.getElementById('hValue')!.innerHTML = h+'';
  document.getElementById('fValue')!.innerHTML = f+'';
  document.getElementById('iValue')!.innerHTML = i+'';
}

export function showMessage(title: string, message: string) {
  const modal = document.getElementById('modal')! as HTMLDialogElement;
  document.querySelector('#modal h3')!.innerHTML = title;
  document.querySelector('#modal p')!.innerHTML = message;

  modal.showModal();
}