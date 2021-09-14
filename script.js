'use strict';

/////////////////////////////////////////////////
// ///////////////////        BANKIST APP           ////////////////////////// /////////

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-08-22T10:51:36.790Z',
    '2021-09-05T17:01:17.194Z',
    '2021-09-06T23:36:17.929Z',
    '2021-09-12T10:51:36.790Z',
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
    '2021-08-29T16:33:06.386Z',
    '2021-09-05T14:43:26.374Z',
    '2021-09-08T18:49:59.371Z',
    '2021-09-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-08-29T16:33:06.386Z',
    '2021-09-05T14:43:26.374Z',
    '2021-09-08T18:49:59.371Z',
    '2021-09-11T12:01:20.894Z',
  ],
  currency: 'CAD',
  locale: 'en-CA',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90, -200, 100, -50],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-08-29T16:33:06.386Z',
    '2021-09-05T14:43:26.374Z',
    '2021-09-08T18:49:59.371Z',
    '2021-09-11T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'hi-IN',
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

//////////////   Formated way to use of dates in movements    //////////
  const  formatMovementDate= function(date, locale){
  const calcDaysPassed = (date1, date2)=> 
  Math.round(Math.abs((date2 - date1)/ (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if(daysPassed === 0) return "Today";
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <=7) return `${daysPassed} days ago `;

    // const day = `${date.getDate()}`.padStart(2 , 0);
    // const month = `${date.getMonth()+ 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${month}/${day}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
};

////////////// Using Initializing Number Format /////////////
const formatCur = function(value, locale, currency){
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);

}

// Showing all the movements in the UI
  const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    
    const  date = new Date(acc.movementsDates[i]);
    const  displayDate= formatMovementDate(date, acc.locale);

    const numsFormat= formatCur(mov, acc.locale, acc.currency);

  const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
       <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${numsFormat}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


// Now we are adding the balance to the dom
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent= `${formatCur(acc.balance, acc.locale, acc.currency)}`;
};

/////////  Adding the Income, out and interest   /////////
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCur(incomes, acc.locale, acc.currency)}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCur(Math.abs(out), acc.locale, acc.currency)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatCur(interest, acc.locale, acc.currency)}`;
};


// We are creating a user name for all accounts
const createUsernames= function(accs){          
  accs.forEach(acc =>{
    acc.username= acc.owner.
    toLowerCase().
    split(' ').
    map(name => name[0]).
    join('');
  });
};

 createUsernames(accounts);
 console.log(accounts);

 
 // Function to run all (function) to update  UI
const updateUI= function(acc){
  // Displaying the movements
  displayMovements(acc);

  // Displaying the balance
  calcDisplayBalance(acc);

  // Displaying the summary
  calcDisplaySummary(acc);
  
};

///////////////////////////////////////
// Setting the timer fucntion for UI //

const startLogoutTimer = function(){
  // Set the time for 5 min
  let time = 120;

  const tick = function() {
    const min = String(Math.floor(time / 60)).padStart(2 ,  0);
    const sec = String(time % 60).padStart(2, 0);
    
    // In each call, print the remaining time in UI
    labelTimer.textContent= `${min}:${sec}`;

    // When 0 seconds stop the timer and log out user
    if(time === 0){
      clearInterval(timer);
      containerApp.style.opacity= 0;
      labelWelcome.textContent= 'Log in to get started';
    }
    
    // Decrease 1 second
    time--;

  };

 tick();

  // Call the timer for every second
  const timer= setInterval(tick, 1000);
  return timer;
};

//////// Global variables to use in all funtions
let currentAccount;
let timer;

/////////////////  Event Listener for login ////////////////

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //  Now we are going to update a date function in app
    const now = new Date();

      // Using of intl date to update date according to user country
     const options= {
       hour: 'numeric',
       minute: 'numeric',
       day: 'numeric',
       month: 'numeric',
       year: 'numeric'
     };
    //   We can get local date according to browser by navigator.language;

     labelDate.textContent= new Intl.DateTimeFormat(currentAccount.locale, options)
     .format(now);
     console.log(labelDate.textContent);
    
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Start logout timer
    if(timer) clearInterval(timer);
    timer= startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

///////////////  Event listener for Transfer //////////////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // update a transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
   // Start logout timer if we do any transfer
   if(timer) clearInterval(timer);
   timer= startLogoutTimer();

});


  ////////////// EventListener for Loan amount ////////////

 btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
      
      // We are using a setTimout to delay the loan process
      setTimeout(() => {

      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
  
      // Update UI
      updateUI(currentAccount);
    }, 2500);
    }
    // Now if we use loan property  timer starts again
    if(timer) clearInterval(timer);
   timer= startLogoutTimer();
  

  inputLoanAmount.value = '';
});

////////////  Event listener to close account /////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});


// Implementing the sort function
// let sorted = false;
// btnSort.addEventListener('click', function(event){
//   event.preventDefault();
//   displayMovements(currentAccount.movements, !sorted);
//   sorted = !sorted;
//   // console.log(sorted);
// })

///////////////////////////END OF BANKIST APP///////////////////////////

















