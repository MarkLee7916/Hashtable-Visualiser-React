// Create a delay for the specified amount of time in millis
export function wait(delayTime: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delayTime));
}

// Return the smallest prime that's greater than num
export function nextPrimeOver(num: number) {
    do {
        num++;
    } while (!isPrime(num));

    return num;
}

// Return true if num has no integer divisors other than itself and 1
function isPrime(num: number) {
    for (let divisor = 2; divisor <= Math.sqrt(num); divisor++) {
        if (num % divisor === 0) {
            return false;
        }
    }

    return true;
}