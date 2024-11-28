function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function isPrime(n) {
  if (n <= 1) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }

  return true;
}

function findPrimeSum(n) {
  if (n <= 5) return [];

  for (let a = 2; a <= n / 3; a++) {
      if (isPrime(a)) {
          for (let b = a + 1; b <= (n - a) / 2; b++) {
              if (isPrime(b)) {
                  let c = n - a - b;
                  if (isPrime(c) && a != c && b != c) {
                      return [a, b, c];
                  }
              }
          }
      }
  }
  return [];
}

function checkPrimeSum(number) {
  if (isNaN(number) || number < 6) {
      return {
        status: 'wrong',
        prime_view: [],
        message: `Введите число больше или равное 6.`
      };
  }

  const primes = findPrimeSum(number);
  if (primes.length > 0) {
      return {
        status: 'correct',
        prime_view: primes,
        message: `${number} = ${primes[0]} + ${primes[1]} + ${primes[2]}`
      };
  } else {
    return {
      status: 'wrong',
      prime_view: primes,
      message: `${number} не может быть представлено как сумма трёх простых чисел.`
    };
  }
}

function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function hasCommonPrimeFactor(a, b, c) {
  const gcdAB = gcd(a, b);
  const gcdABC = gcd(gcdAB, c);
  
  if (gcdABC > 1) {
    for (let i = 2; i <= Math.sqrt(gcdABC); i++) {
      if (gcdABC % i === 0) {
        return null;
      }
    }
    return gcdABC;
  }
  
  return null;
}

function checkHypothesis(A, B, C, x, y, z) {
  if (x <= 3 || y <= 3 || z <= 3) {
    return {
      status: 'wrond',
      message: `Степени должны быть больше 2.`
    };
  }

  const leftSide = Math.pow(A, x) + Math.pow(B, y);
  const rightSide = Math.pow(C, z);

  if (leftSide === rightSide) {
    const commonDivisor  = hasCommonPrimeFactor(A, B, C);
    if (commonDivisor) {
      return {
        status: 'correct',
        message: `Общий простой делитель: ${commonDivisor}`,
        common_divisor: commonDivisor
      };
    } else {
      return {
        status: 'wrong',
        message: `Общий простой делитель отсутствует.`,
      };
    }
  } else {
    return {
      status: 'wrong',
      message: `Общий простой делитель отсутствует.`
    };
  }
}
