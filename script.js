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
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
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
    '2026-04-24T13:15:33.035Z',
    '2025-11-30T09:48:16.867Z',
    '2025-12-25T06:04:23.907Z',
    '2025-01-25T14:18:46.235Z',
    '2025-02-05T16:33:06.386Z',
    '2025-04-10T14:43:26.374Z',
    '2025-06-25T18:49:59.371Z',
    '2025-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const daysPassed = (date1, date2) =>
  Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

function getDisplayDate(now) {
  const daysPass = daysPassed(now, new Date());
  console.log('days pass:', daysPass);

  if (daysPass === 0) {
    return `Today`;
  } else if (daysPass === 1) {
    return 'yesterday';
  } else if (daysPass <= 7) {
    return `${daysPass} ago`;
  } else {
    let day = now.getDate();
    day = String(day).length === 1 ? `${day}`.padStart(2, 0) : day;
    let month = now.getMonth() + 1;
    month = String(month).length === 1 ? `${month}`.padStart(2, 0) : month;
    const year = now.getFullYear();

    console.log(month);

    return `${day}/${month}/${year}`;
  }
}

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  let movements = account.movements;

  let combined = account.movements.map((mov, index) => {
    return { movement: mov, date: account.movementsDates[index] };
  });

  console.log(combined);

  movements = combined;

  // return < 0 => return a , return > 0 => return b
  let movs = sort
    ? movements.slice().sort((a, b) => a.movement - b.movement)
    : movements;

  movs.forEach((movementObj, i) => {
    const type = movementObj.movement > 0 ? 'deposit' : 'withdrawal';
    let now = new Date(movementObj.date);
    const displayDate = getDisplayDate(now);

    const html = `
    <div class="movements__row">

      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${movementObj.movement.toFixed(2)}</div>

    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const euroTOUsd = 1.1;

const movementsUsd = movements.map(movement => {
  return movement * euroTOUsd;
});

const movementDesc = movements.map((mov, i) => {
  if (mov > 0) {
    return `Movement ${i + 1}: You Deposited ${mov}`;
  } else {
    return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
  }
});

function computeUsername(accounts) {
  accounts.forEach(acc => {
    const names = acc.owner.toLowerCase().split(' ');
    acc.username = names.map(name => name[0]).join('');
  });
}

computeUsername(accounts);

const deposits = movements.filter(mov => mov > 0);

console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);

console.log(withdrawals);

const calcBalance = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance} EUR`;
  console.log('balance: ', account.balance);
};

const calcMax = movements => {
  return movements.reduce(
    (acc, curr) => (acc < curr ? curr : acc),
    movements[0],
  );
};

console.log(calcMax(account1.movements));

const depositsInUsd = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroTOUsd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(depositsInUsd);

function calcDisplaySummary(acc) {
  let movements = acc.movements;
  let sumIn = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  let sumOut = Math.abs(
    movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0),
  );

  let interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .reduce((acc, mov) => (mov > 1 ? acc + mov : acc), 0);
  labelSumIn.textContent = `${sumIn.toFixed(2)} EUR`;
  labelSumOut.textContent = `${sumOut.toFixed(2)} EUR`;
  console.log('interest', interest.toFixed(2));

  labelSumInterest.textContent = `${interest.toFixed(2)} EUR`;
}

/////////////////////////////////////////////////

function displayUI(currentAccount) {
  displayMovements(currentAccount);
  calcBalance(currentAccount);
  calcDisplaySummary(currentAccount);
}
// Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const now = new Date();
  let day = now.getDate();
  day = String(day).length === 1 ? `${day}`.padStart(2, 0) : day;
  let month = now.getMonth() + 1;
  month = String(month).length === 1 ? `${month}`.padStart(2, 0) : month;
  const year = now.getFullYear();
  let hour = now.getHours();
  hour = String(hour).length === 1 ? `${hour}`.padStart(2, 0) : hour;
  let min = now.getMinutes();
  min = String(min).length === 1 ? `${min}`.padStart(2, 0) : min;

  console.log(month);

  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value,
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    //CLEAR FIELDS
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    //DISPLAY UI AND MESSAGE
    labelWelcome.textContent = `Welcome back , ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    displayUI(currentAccount);
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value,
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    //update movements for both receiver and sender (current account)
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movements.push(amount);
    //update UI
    displayUI(currentAccount);
  } else {
    console.log('invalid transfer');
  }
});

//close account
function closeAccount(acc, e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === acc.username &&
    +inputClosePin.value === acc.pin
  ) {
    const index = accounts.findIndex(a => acc.username === a.username);
    accounts.splice(index, 1);

    //HIDE UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = '';
    console.log(accounts);
  }
}

inputCloseUsername.value = inputClosePin.value = '';

btnClose.addEventListener('click', e => closeAccount(currentAccount, e));

const lastWithdrawl = movements.findLast(mov => mov < 0);
console.log(lastWithdrawl);

const latestLargeMovementIndex = movements.findLastIndex(
  mov => Math.abs(mov) > 1000,
);

console.log(
  `Your latest large movement was ${movements.length - latestLargeMovementIndex - 1} movements ago`,
);

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    displayUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

const overAllBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, movement) => acc + movement, 0);

console.log('overallbalance: ', overAllBalance);

// return < 0 => return a , return > 0 => return b

movements.sort((a, b) => a - b);

console.log(movements);

const groupedMovements = Object.groupBy(movements, movement =>
  movement > 0 ? 'deposits' : 'withdrawls',
);

const groupedByActivity = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;

  if (movementCount >= 8) return 'very active';
  else if (movementCount >= 4) return 'active';
  else if (movementCount >= 1) return 'moderately active';

  return 'inactive';
});

console.log(groupedByActivity);

let groupedByType = Object.groupBy(accounts, ({ type }) => type);

console.log(groupedByType);

const z = Array.from({ length: 7 }, (_, i) => i + 1);

console.log(z);

// const diceRolls = Array.from({ length: 100 }, () =>
//   Math.trunc(Math.random() * 100 + 1),
// );

// console.log(diceRolls);

labelBalance.addEventListener('click', () => {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => +el.textContent.slice(0, el.textContent.length - 1),
  );

  console.log(movementsUI);
});

let totalBalance = accounts.reduce((a, acc) => {
  return a + acc.movements.reduce((ac, mov) => (mov > 0 ? ac + mov : ac), 0);
}, 0);

console.log(totalBalance);

let oneThousandAmountDeposits = accounts.flatMap(acc => {
  return acc.movements.filter(mov => mov > 1000);
});

console.log(oneThousandAmountDeposits.length);

let totalTransactionsSum = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (total, mov) => {
      if (mov > 0) {
        total.deposits += mov;
      } else {
        total.withdrawls += Math.abs(mov);
      }
      return total;
    },
    { deposits: 0, withdrawls: 0 },
  );

const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

console.log(daysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24)));
