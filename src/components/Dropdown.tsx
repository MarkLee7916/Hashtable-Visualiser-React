import React, { useState } from "react";

interface Props {
    initialItem: string
    content: Map<string, () => void>
}

export const Dropdown = ({ initialItem, content }: Props) => {
    const [isContentDisplayed, setContentDisplayed] = useState(false);
    const [itemSelected, setItemSelected] = useState(initialItem);

    const contentDisplay = isContentDisplayed ? "block" : "none";

    function toggleContent() {
        setContentDisplayed(!isContentDisplayed);
    }

    function handleContentButtonClick(item: string) {
        const notifyCallback = content.get(item);

        toggleContent();
        setItemSelected(item);
        notifyCallback();
    }

    return (
        <div className="dropdown-container">
            <button className="dropdown-button menu-button" onClick={toggleContent}>
                {itemSelected + (isContentDisplayed ? ' ▲' : ' ▼')}
            </button>
            <div className="dropdown-content" style={{ display: contentDisplay }}>
                {Array.from(content.keys()).map((item, index) =>
                    <button className="dropdown-content-button menu-button" onClick={() => handleContentButtonClick(item)} key={index}>
                        {item}
                    </button>
                )}
            </div>
        </div>
    )
}