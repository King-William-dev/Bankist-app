'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
        <div class="movements__value">${mov}</div>
    </div>
       
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//CREATING USERNAMES

const createUserNames = function (accounts) {
  accounts.forEach(function(acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
    })
    .join('');
  })
};

createUserNames(accounts);
// console.log(accounts);

//Update UI
const updateUI = function (acc) {
  //display Current Balance
  bankBalance(currentAccount);
  //display Movements
  displayMovements(currentAccount.movements);
  //display Summary
  displaySummary(currentAccount);
}

//DISPLAY BANK BALANCE

const bankBalance = function (acc) {
  acc.balance = acc.movements.reduce(function(acc, mov) {
    return acc + mov;
  }, 0)
  labelBalance.textContent = `${acc.balance}€`; 
}



//DISPLAY SUMMARY

const displaySummary = function (acc) {
  //deposits
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((mov, curr)=>mov + curr, 0)
    labelSumIn.textContent = `${incomes}€`
  //withdrawals
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((mov, curr)=>mov + curr, 0)
    labelSumOut.textContent = `${Math.abs(outcome)}€`
  //Interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * acc.interestRate/100)
    .reduce((mov, curr)=>mov + curr, 0)
    labelSumInterest.textContent = `${interest}€`
}




//LOGIN USER
//ADD EVENT LISTENER TO LOGIN BUTTON

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  //find account
  currentAccount = accounts.find(acc=>acc.userName === inputLoginUsername.value)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
  //welcome message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`
  }
  //clear Input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur(); 
  //change UI opacity
  containerApp.style.opacity = 100;

  updateUI(currentAccount);

})

//HANDLING TRANSFERS

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc=>acc.userName === inputTransferTo.value)
  //validating accounts
  if ( amount > 0 && currentAccount.balance >= amount && receiverAcc && receiverAcc.userName !== currentAccount.userName) {
    //effect the transfers
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //update the UI
    updateUI(currentAccount);
  }
  //clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';
})

//CLOSE ACCOUNT

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc=>acc.userName === inputCloseUsername.value)
  if (currentAccount?.pin === Number(inputClosePin.value)) {
    console.log('correct credentials');
  }
})



