import { ArrayAnimationFrame, EntryFrame } from "./frame";
import { nextPrimeOver } from "./utils";

export interface HashTable {
    length: number
    tombstoneEntries: number
    keys: number[]
}

export const enum ProbingTechnique {
    Linear,
    Quadratic
}

// Length of keys array when hashtable is initialised
const INITIAL_CAPACITY = 7;

export const emptyHashtable = { keys: Array(INITIAL_CAPACITY).fill(undefined), length: 0, tombstoneEntries: 0 };

// Percentage theshold for expanding the array 
const EXPAND_LOADING_FACTOR = 0.5;

// When an item is deleted, replace with a tombstone entry to allow traversal through keys array
const TOMBSTONE_ENTRY = null;

// Denote a place in the array with no values
const EMPTY_ENTRY = undefined;

// Threshold to prevent search from looping infinitely in the case of a bug
const MAX_ITERATIONS = 100;

// Add a key into the hashtable
export function addToHashtable(key: number, nextIndex: (index: number, iter: number, hashtable: HashTable) => number, hashtable: HashTable) {
    if (key !== null && key !== undefined) {
        return insertIntoHashtable(key, nextIndex, hashtable);
    } else {
        throw "This implementation doesn't support null or undefined keys";
    }
}

// Delete a key from the hashtable, replacing them with tombstone entries
export function deleteFromHashtable(key: number, nextIndex: (index: number, iter: number, hashtable: HashTable) => number, hashtable: HashTable) {
    const frames: ArrayAnimationFrame[] = [];
    const startIndex = hashFunction(key, hashtable);

    let currIndex = startIndex;

    frames.push({ frame: EntryFrame.Searching, index: currIndex, message: "Searching..." });

    for (let iter = 1; hashtable.keys[currIndex] !== key && iter < MAX_ITERATIONS; iter++) {
        if (hashtable.keys[currIndex] === EMPTY_ENTRY) {
            frames.push({ frame: EntryFrame.NotFound, index: currIndex, message: "Not Found!" });
            return frames;
        }

        currIndex = nextIndex(startIndex, iter, hashtable);
        frames.push({ frame: EntryFrame.Searching, index: currIndex, message: "Searching..." });
    }

    hashtable.keys[currIndex] = TOMBSTONE_ENTRY;
    hashtable.tombstoneEntries++;
    hashtable.length--;

    frames.push({ frame: EntryFrame.Found, index: currIndex, message: "Found! Deleting Item..." });

    return frames;
}

export function hashtableDeepCopy(hashtable: HashTable) {
    return {
        keys: hashtable.keys.slice(),
        length: hashtable.length,
        tombstoneEntries: hashtable.tombstoneEntries
    }
}

export function searchForHashtableKey(key: number, nextIndex: (index: number, iter: number, hashtable: HashTable) => number, hashtable: HashTable) {
    const frames: ArrayAnimationFrame[] = [];
    const startIndex = hashFunction(key, hashtable);

    let currIndex = startIndex;

    frames.push({ frame: EntryFrame.Searching, index: currIndex, message: "Searching..." });

    for (let iter = 1; hashtable.keys[currIndex] !== EMPTY_ENTRY && iter < MAX_ITERATIONS; iter++) {
        if (hashtable.keys[currIndex] === key) {
            frames.push({ frame: EntryFrame.Found, index: currIndex, message: "Found!" });
            return frames;
        }

        currIndex = nextIndex(startIndex, iter, hashtable);

        frames.push({ frame: EntryFrame.Searching, index: currIndex, message: "Searching..." });
    }

    frames.push({ frame: EntryFrame.NotFound, index: currIndex, message: "Not Found!" });

    return frames;
}

// Return the index to explore if we're using linear probing, called whenever we have a collision
export function nextLinearIndex(index: number, iter: number, hashtable: HashTable) {
    index += iter;

    return index >= hashtable.keys.length - 1 ? index % hashtable.keys.length : index;
}

// Return the index to explore if we're using quadratic probing, called whenever we have a collision
export function nextQuadraticIndex(index: number, iter: number, hashtable: HashTable) {
    index += iter * iter;

    return index >= hashtable.keys.length - 1 ? index % hashtable.keys.length : index;
}

console.log("aaa")

function insertIntoHashtable(key: number, nextIndex: (index: number, iter: number, hashtable: HashTable) => number, hashtable: HashTable) {
    const frames: ArrayAnimationFrame[] = [];
    const startIndex = hashFunction(key, hashtable);
    let index = startIndex;

    frames.push({ frame: EntryFrame.Searching, index, message: "Searching..." });

    for (let iter = 1; isValidEntry(index, hashtable) && iter < MAX_ITERATIONS; iter++) {
        if (hashtable.keys[index] === key) {
            frames.push({ frame: EntryFrame.Found, index, message: "Key already in table, don't add!" });
            return frames;
        }

        index = nextIndex(startIndex, iter, hashtable);

        frames.push({ frame: EntryFrame.Searching, index, message: "Searching..." });
    }

    hashtable.length++;
    hashtable.tombstoneEntries -= hashtable.keys[index] === TOMBSTONE_ENTRY ? 1 : 0;
    hashtable.keys[index] = key;

    frames.push({ frame: EntryFrame.Found, index, message: "Found! Adding item..." });

    frames.push(handleResizeHashtable(nextIndex, hashtable, index));

    return frames;
}

function isValidEntry(index: number, hashtable: HashTable) {
    return hashtable.keys[index] !== EMPTY_ENTRY && hashtable.keys[index] !== TOMBSTONE_ENTRY;
}

// Check if hashtable needs resizing, if it does resize it
function handleResizeHashtable(nextIndex: (index: number, iter: number, hashtable: HashTable) => number, hashtable: HashTable, index: number) {
    const isOverCapacity = (hashtable.length + hashtable.tombstoneEntries) / hashtable.keys.length > EXPAND_LOADING_FACTOR;
    const needsResizing = hashtable.length / hashtable.keys.length > EXPAND_LOADING_FACTOR;

    if (isOverCapacity) {
        if (needsResizing) {
            resizeHashtable(len => nextPrimeOver(len * 2), nextIndex, hashtable);

            return { frame: EntryFrame.Found, index: index, message: `Rehashing... Resizing to length ${hashtable.keys.length}` };
        } else {
            resizeHashtable(len => len, nextIndex, hashtable);

            return { frame: EntryFrame.Found, index: index, message: "Rehashing... No resizing needed! Only tombstone entries cleared!" };
        }
    }

    return { frame: EntryFrame.Found, index: index, message: "Checking for Rehashing... No rehashing needed!" };
}

// Replace key array with array whose size is lenFunc(length) and copy all of its items in
function resizeHashtable(lenFunc: (len: number) => number, nextIndex: (index: number, iter: number, hashtable: HashTable) => number, hashtable: HashTable) {
    const oldKeys = hashtable.keys.slice();

    hashtable.keys = Array(lenFunc(oldKeys.length)).fill(EMPTY_ENTRY);
    hashtable.length = 0;
    hashtable.tombstoneEntries = 0;

    for (let i = 0; i < oldKeys.length; i++) {
        if (oldKeys[i] !== EMPTY_ENTRY && oldKeys[i] !== TOMBSTONE_ENTRY) {
            addToHashtable(oldKeys[i], nextIndex, hashtable);
        }
    }
}

// Map a key onto an index in the array
function hashFunction(key: number, hashtable: HashTable) {
    return Math.abs(key % hashtable.keys.length);
}

