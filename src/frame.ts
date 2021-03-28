export type ArrayAnimationFrame = { frame: EntryFrame, index: number, message: string }

export const enum EntryFrame {
    Searching,
    Found,
    NotFound,
}

export const emptyAnimationFrame = { frame: null, index: -1, message: "" };
