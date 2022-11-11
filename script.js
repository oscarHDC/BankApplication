'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

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

/* -------------------THIS METHOD PRINT IN THE RESPECTIVE LABEL THE DEPOSITS, WITHDRAWS AND INTEREST---------------  */
const calcDisplaySummary = function (acc) {
  const inMovs = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${inMovs.toFixed(2)}$`;

  const outMovs = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outMovs.toFixed(2))}$`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(deposit => deposit > 1)
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = `${interest.toFixed(2)}$`;
};

/* -------------------THIS METHOD CALCULATES THE BALANCE OF THE MOVEMENTS AND PRINT IT IN THE BALANCE LABEL ---------------  */
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0); //Creating the balance of the user in order to can do transfers
  labelBalance.textContent = `${acc.balance}$`;
};

/*-------------------THIS METHOD CREATES THE USERNAMES FOR THE USERS -------------------*/
/* The user name is formed by the 1st char of its name and usernames */
const createUserName = function (accs) {
  accs.forEach(function (user) {
    //Getting the 1st chars'name and chars'usernames of each user
    const username = user.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.charAt(0))
      .join('');
    user.userName = username; //Assign the userName to the object user
  });
};

createUserName(accounts);

/*------------------- THIS METHOD ADD THE MOVEMENTS OF THE USER TO THE MOVEMENT'S CONTAINER------------------- */
const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; //In order to sort the movements

  containerMovements.innerHTML = ''; //It clears the movement container

  movs.forEach(function (mov, i) {
    //Looping the movements of the user
    const type = mov > 0 ? 'deposit' : 'withdrawal'; //Depending on the value, the CSS class will be different(deposit is green, and withdrawl is red)

    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth()}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    //Creating the html movement element
    const html = `<div class="movements__row"> 
    <div class="movements__type movements__type--${type}">${i + 1} deposit</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)}$</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html); //afterbegin stablish in which order the html will be add
  });
};

const updateUI = function (acc) {
  //Display movement
  displayMovements(acc);
  //Display balance
  calcPrintBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

////////////////////////////////////////////
let currentAccount;
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth()}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

////////////////////////////////////////////

/* ------------------ LOG IN ----------------- */
btnLogin.addEventListener('click', function (event) {
  //Prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    owner => owner.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log(currentAccount);
    //If property pin exists(it means that account isnt undefined)
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner //Taking only the name of the owner
        .split(' ')[0]
    }`;
    containerApp.style.opacity = 100; //Making the app form fade in

    //Clear the input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur(); //Getting ride of the focus with style

    updateUI(currentAccount);
  }
});

/* ------------------ TRANSFERS FUNCIONALITY ---------------- */
btnTransfer.addEventListener('click', function (ev) {
  ev.preventDefault(); //Preventing the submit behaviour
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.userName === inputTransferTo.value);
  //Cleaning inputs
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiver &&
    amount <= currentAccount.balance &&
    receiver?.userName !== currentAccount.userName
  ) {
    //Doing transfer
    receiver.movements.push(amount);
    currentAccount.movements.push(-amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());
    //Upload the current account info
    updateUI(currentAccount);
  }
});

/* ------------- LOAN FUNCIONALITY -------------- */
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Condition to get a Loan
    //Adding movement
    currentAccount.movements.push(amount);

    //Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    //Updating UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
});

/* ------------- DELETE ACCOUNT FUNCIONALITY -------------- */

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      //Getting the index of the account
      acc => acc.userName === inputCloseUsername.value
    );

    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
    //Cleaning inputs
    inputClosePin.value = inputCloseUsername.value = '';
  }
});

/* ------------- SORT FUNCIONALITY -------------- */
let sortStage = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sortStage); //In roder to get back to unsort movements
  sortStage = !sortStage;
});
