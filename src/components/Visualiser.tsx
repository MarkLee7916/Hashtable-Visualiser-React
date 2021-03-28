import React, { useState } from "react";
import { emptyAnimationFrame } from "../frame";
import { emptyHashtable, hashtableDeepCopy, nextLinearIndex, nextQuadraticIndex, ProbingTechnique } from "../hashtable";
import { wait } from "../utils";
import { List } from "./List";
import { Menu } from "./Menu";

// The amount of time we wait between displaying frames in milliseconds
const DELAY = 500;

// Map a JSX string representation of a probing technique on its implementation
const probingTechniqueToImplementation = new Map<ProbingTechnique, Function>([
    [ProbingTechnique.Linear, nextLinearIndex],
    [ProbingTechnique.Quadratic, nextQuadraticIndex]
]);

export const Visualiser = () => {
    const [hashtable, setHashtable] = useState(emptyHashtable);
    const [arrayAnimationFrame, setArrayAnimationFrame] = useState(emptyAnimationFrame);
    const [isAnimationRunning, setAnimationRunning] = useState(false);

    async function performAction(item: number, probingTechnique: ProbingTechnique, action: Function) {
        const nextIndex = probingTechniqueToImplementation.get(probingTechnique);
        const hashtableCopy = hashtableDeepCopy(hashtable);
        const frames = action(item, nextIndex, hashtableCopy);

        setAnimationRunning(true);

        for (let i = 0; i < frames.length; i++) {
            setArrayAnimationFrame(frames[i]);

            await wait(DELAY);
        }

        setAnimationRunning(false);
        setHashtable(hashtableCopy);
        setArrayAnimationFrame(emptyAnimationFrame);
    }

    function clearHashtable() {
        setHashtable(emptyHashtable);
    }

    return (
        <>
            <Menu performAction={performAction} running={isAnimationRunning} clearHashtable={clearHashtable} />
            <List content={hashtable.keys} frame={arrayAnimationFrame}></List>
        </>
    )
}