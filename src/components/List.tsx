import { ArrayAnimationFrame, EntryFrame } from "../frame"
import React from "react"

interface Props {
    content: number[]
    frame: ArrayAnimationFrame
}

const entryFrameToColor = new Map<EntryFrame, string>([
    [EntryFrame.Searching, "#33D5FF"],
    [EntryFrame.Found, "#32CD32"],
    [EntryFrame.NotFound, "red"],
]);

const BLANK = "white";

const FONT_SIZE_MODIFIER = 0.5;

const TOMBSTONE_SYMBOL = "⚰️";

function listLengthToSize(length: number) {
    const modifier = 90;

    return modifier / length;
}

export const List = ({ content, frame }: Props) => {
    const hasMessage = frame.message !== "";

    return (
        <>
            <p style={{ color: "white", visibility: hasMessage ? "visible" : "hidden" }}>{hasMessage ? frame.message : "placeholder"}</p>
            <div id="array">
                {content.map((elem, index) =>
                    <span className="elem"
                        key={index}
                        style={{
                            backgroundColor: index === frame.index ? entryFrameToColor.get(frame.frame) : BLANK,
                            height: `${listLengthToSize(content.length)}vw`,
                            width: `${listLengthToSize(content.length)}vw`,
                            fontSize: `${listLengthToSize(content.length) * FONT_SIZE_MODIFIER}vw`
                        }}
                    >
                        {elem === null ? TOMBSTONE_SYMBOL : elem}
                    </span>
                )}
            </div>
        </>
    )
}