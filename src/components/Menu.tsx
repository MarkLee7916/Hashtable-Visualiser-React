import React, { useRef } from "react";
import { addToHashtable, searchForHashtableKey, deleteFromHashtable, ProbingTechnique } from "../hashtable";
import { Dropdown } from "./Dropdown";

interface Props {
  performAction: (item: number, probingTechnique: ProbingTechnique, action: Function) => Promise<void>
  running: boolean
  clearHashtable: () => void
}

export const Menu = ({ performAction, running, clearHashtable }: Props) => {
  const itemToAdd = useRef(undefined);
  const itemToSearch = useRef(undefined);
  const itemToDelete = useRef(undefined);
  const probingTechnique = useRef(ProbingTechnique.Linear);

  const inputControlsVisibility = running ? "hidden" : "visible";

  function handleUpdateItem(event, item: React.MutableRefObject<number>) {
    const newItem = parseInt(event.target.value);

    if (!isNaN(newItem)) {
      item.current = newItem;
    }
  }

  function handlePerformAction(item: React.MutableRefObject<number>, action: Function) {
    performAction(item.current, probingTechnique.current, action);
  }

  function handleUpdateProbingTechnique(technique: ProbingTechnique) {
    if (technique !== probingTechnique.current) {
      clearHashtable();
      probingTechnique.current = technique;
    }
  }

  return (
    <>
      <h1 id="heading">Hashtable Visualiser</h1>

      <div id="color-codes">
        <span>🟦 Searching</span>
        <span>🟥 Not Found</span>
        <span>🟩 Found</span>
        <span>⚰️ Tombstone Entry</span>
      </div>

      <div id="user-inputs" style={{ visibility: inputControlsVisibility }}>
        <div className="user-input">
          <button
            className="menu-button"
            onClick={() => handlePerformAction(itemToAdd, addToHashtable)}
          >
            Add Item
          </button>
          <input
            type="number"
            className="input-box"
            id="add-item"
            onChange={(event) => handleUpdateItem(event, itemToAdd)}
          ></input>
        </div>

        <div className="user-input">
          <button
            className="menu-button"
            onClick={() => handlePerformAction(itemToSearch, searchForHashtableKey)}
          >
            Search Item
          </button>
          <input
            type="number"
            className="input-box"
            id="remove-item"
            onChange={(event) => handleUpdateItem(event, itemToSearch)}
          ></input>
        </div>

        <div className="user-input">
          <button
            className="menu-button"
            onClick={() => handlePerformAction(itemToDelete, deleteFromHashtable)}
          >
            Delete Item
          </button>
          <input
            type="number"
            className="input-box"
            id="search-item"
            onChange={(event) => handleUpdateItem(event, itemToDelete)}
          ></input>
        </div>

        <div className="user-input">
          <button className="menu-button" onClick={clearHashtable}>
            Clear
          </button>
          <input className="hidden-input-box"></input>
        </div>

        <div className="user-input">
          <Dropdown
            initialItem={"Linear Probing"}
            content={new Map<string, () => void>([
              ["Linear Probing", () => handleUpdateProbingTechnique(ProbingTechnique.Linear)],
              ["Quadratic Probing", () => handleUpdateProbingTechnique(ProbingTechnique.Quadratic)]
            ])}
          />
          <input className="hidden-input-box"></input>
        </div>
      </div>
    </>
  );
};
