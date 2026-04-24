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
  type: 'Standard',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'Standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'Basic',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'Premium',
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // return < 0 => return a , return > 0 => return b
  let movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">

      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${movement}</div>

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
  labelSumIn.textContent = `${sumIn} EUR`;
  labelSumOut.textContent = `${sumOut} EUR`;
  console.log('interest', interest);

  labelSumInterest.textContent = `${interest} EUR`;
}

/////////////////////////////////////////////////

function displayUI(currentAccount) {
  displayMovements(currentAccount.movements);
  calcBalance(currentAccount);
  calcDisplaySummary(currentAccount);
}
// Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value,
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
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
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
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
    Number(inputClosePin.value) === acc.pin
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
  let amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);
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
    el => Number(el.textContent.slice(0, el.textContent.length - 1)),
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

console.log(totalTransactionsSum);
