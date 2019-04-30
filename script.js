const btns = document.querySelector(".calculator_body").querySelectorAll("button");

const beep= new Audio();
beep.src="beep.mp3";

if('serviceWorker' in navigator) {
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('/sw.js')
        .then(req => {
          console.log('SW Registered!', req)
        }).catch(err => {
      console.log('SW registration failed', err)
        })
    })
}

btns.forEach( btn => {
    btn.addEventListener("keydown", event => {
        btn.classList.add("active");
    });
    btn.addEventListener("keyup", event => {
        btn.classList.remove("active");
    });
})

let keys = document.querySelector(".calculator_body");
let display = document.querySelector(".calculator_result");
let memory = document.querySelector(".calculator_memory");
let calculator = document.querySelector(".calculator");

function numberKey(displayedNum, keyContent, previousKeyType){
    if (displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate') {
        display.textContent = keyContent;
    } else {
        display.textContent = displayedNum + keyContent;
    }
    calculator.dataset.previousKeyType = 'number';
}

function decimalKey(displayedNum ,previousKeyType){
    if (previousKeyType === 'operator'){
        display.textContent = 0 + '.';
    } else {
        display.textContent = displayedNum + '.';
    }
    calculator.dataset.previousKeyType = 'decimal';
}

function backspaceKey(displayedNum){
    display.textContent = displayedNum.length > 1 ? displayedNum.slice(0, displayedNum.length -1) : 0;
    calculator.dataset.previousKeyType = 'backspace';
}

function signchangeKey(displayedNum){
    display.textContent = -Number(displayedNum);
    calculator.dataset.previousKeyType = 'signchange';
}

function resetKey(){
    display.textContent = 0;
    memory.textContent = "";
}

function arithmeticOperatorKey(displayedNum, memoryContent, previousKeyType, action){
    if(previousKeyType !== 'operator'){
        newDisplayContent = Math.round(eval(memoryContent + displayedNum) * 100) / 100;
        if(action === 'add'){
            memory.textContent += displayedNum + '+';
        } else if(action === 'subtract'){
            memory.textContent += displayedNum + '-';
        } else if(action === 'multiply'){
            memory.textContent += displayedNum + '*';
        } else if(action === 'divide'){
            memory.textContent += displayedNum + '/';
        } else if(action === 'remainder'){
            memory.textContent += displayedNum + '%';
        }
        display.textContent = newDisplayContent;
    } else {
        if(action === 'add'){
            memory.textContent = memoryContent.slice(0, memoryContent.length -1) + '+';
        } else if(action === 'subtract'){
            memory.textContent = memoryContent.slice(0, memoryContent.length -1) + '-';
        } else if(action === 'multiply'){
            memory.textContent = memoryContent.slice(0, memoryContent.length -1) + '*';
        } else if(action === 'divide'){
            memory.textContent = memoryContent.slice(0, memoryContent.length -1) + '/';
        } else if(action === 'remainder'){
            memory.textContent = memoryContent.slice(0, memoryContent.length -1) + '%';
        }
    }
    calculator.dataset.previousKeyType = 'operator';

}

function equalsKey(displayedNum, memoryContent, previousKeyType){
    if (previousKeyType === 'number' || previousKeyType === 'decimal'   || previousKeyType ===  'signchange') {
        display.textContent = Math.round(eval(memoryContent + displayedNum) * 100)/100;
        memory.textContent = '';
    } else if ( previousKeyType === 'operator' ) {
        display.textContent = eval(memoryContent.slice(0, memoryContent.length -1));
        memory.textContent = '';
    }
    calculator.dataset.previousKeyType = 'calculate';
}

keys.addEventListener('click', e => {
    beep.play();
    if (e.target.matches('button')) {
        const key = e.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        const displayedNum = display.textContent;
        const previousKeyType = calculator.dataset.previousKeyType ;
        let memoryContent = memory.textContent;

        if (!action) {
            numberKey(displayedNum, keyContent, previousKeyType);

        } else if (action === 'decimal') {
            decimalKey(displayedNum ,previousKeyType);

        } else if (action === 'backspace') {
            backspaceKey(displayedNum);

        } else if (action === 'signchange') {
            signchangeKey(displayedNum);

        } else if (action === 'reset') {
            resetKey();

        }  else if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide' || action === 'remainder') {
            arithmeticOperatorKey(displayedNum, memoryContent, previousKeyType, action);

        } else if (action === 'calculate') {
            equalsKey(displayedNum, memoryContent, previousKeyType);

        } 
    }
})
