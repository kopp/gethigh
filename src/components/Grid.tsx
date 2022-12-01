
import { useState } from "react";

const colors: string[] = [
    "#33ffbd",
    "#75ff33",
    "#dbff33",
    "#ffbd33",
    "#33dbff",
    "#3389ff",
    "#4333ff",
    "#a933ff",
    "#ff33ef",
    "#ff3389",
];

function getColorFor(value: number): string {
    if (value < colors.length) {
        return colors[value];
    }
    else {
        return "red";
    }
}

function randInt(from: number, to: number) {
    console.assert(from >= 0);
    console.assert(to > from);
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function randInts(from: number, to: number, size: number): number[] {
    const numbers: number[] = [];
    for (let i = 0; i < size; ++i) {
        numbers.push(randInt(from, to));
    }
    return numbers;
}

interface Position {
    row: number,
    column: number,
}

function asIndex(position: Position, width: number, height: number): number {
    console.assert(position.row < height);
    console.assert(position.column < width);
    return position.column + position.row * width;
}

function asPosition(index: number, width: number, height: number): Position {
    console.assert(index < height * width);
    const row = Math.floor(index / width);
    const col = index - row * width;
    return {row: row, column: col};
}

function getNeighborsOf(index: number, width: number, height: number): number[] {
    const position = asPosition(index, width, height);

    const neighbors: number[] = [];

    if (position.row > 0) {
        neighbors.push(asIndex({row: position.row - 1, column: position.column}, width, height));
    }
    if (position.row + 1 < height) {
        neighbors.push(asIndex({row: position.row + 1, column: position.column}, width, height));
    }
    if (position.column > 0) {
        neighbors.push(asIndex({row: position.row, column: position.column - 1}, width, height));
    }
    if (position.column + 1 < width) {
        neighbors.push(asIndex({row: position.row, column: position.column + 1}, width, height));
    }

    return neighbors;
}

function getIndicesOfconnectedElementsWithSameValue(data: number[], index: number, width: number, height: number): number[]
{
    const value = data[index];

    const connectedNeighbord: number[] = [];

    const toCheck: number[] = [index];
    const checked: number[] = [];
    while (toCheck.length > 0) {
        const neighbor = toCheck.pop();
        if (neighbor === undefined) {
            throw new Error("cannot happen");
        }
        if (checked.includes(neighbor)) {
            continue;
        }
        else {
            checked.push(neighbor);
        }

        if (data[neighbor] === value) {
            connectedNeighbord.push(neighbor);
            toCheck.push(...getNeighborsOf(neighbor, width, height));
        }
    }

    return connectedNeighbord;
}

function findNextUndefinedAbove(position: Position, data: number[], width: number, height: number): number | undefined {
    let row = position.row - 1;
    while (row >= 0) {
        const index = asIndex({row: row, column: position.column}, width, height);
        if (data[index] !== undefined) {
            return index;
        }
    }
    return undefined;
}

function swapInArray(data: (number | undefined)[], index1: number, index2: number) {
    const temp = data[index1];
    data[index1] = data[index2];
    data[index2] = temp;
}

/**
 * If at least two cells have the same value, create one new cell with the value + 1 and remove the other ones.
 * Fill the gaps with new values.
 * @return new data
 */
function collapseConnectedElementsWithSameValue(data: number[], index: number, width: number, height: number): number[]
{
    const neighbors = getIndicesOfconnectedElementsWithSameValue(data, index, width, height);
    if (neighbors.length < 2) {
        return data; // only collapse if more than one cell has the value
    }
    const newMaxRandValue = Math.max(...data);  // make this a parameter?
    const newData : (number | undefined)[] = [...data];
    // erase all cells with same value
    neighbors.forEach(index => {
        newData[index] = undefined;
    });
    // fill them with new values -- falling from top if available or create new ones
    newData[index] = data[index] + 1;
    for (let column = 0; column < width; ++column) {
        for (let row = height - 1; row >= 0; row -= 1) {
            const positionThis = {row: row, column: column};
            const indexThis = asIndex(positionThis, width, height);
            if (newData[indexThis] !== undefined) {
                continue; // we only care for undefined
            }
            const indexFallingDown = findNextUndefinedAbove(positionThis, data, width, height);
            if (indexFallingDown !== undefined && newData[indexFallingDown] !== undefined) {
                swapInArray(newData, indexThis, indexFallingDown);
            }
            else {
                // nothing above -- fill with random value
                newData[indexThis] = randInt(1, newMaxRandValue);
            }
        }
    }

    for (let i = 0; i < newData.length; ++i) {
        if (newData[i] === undefined) {
            console.error("After collapsing, data at", i, "is undefined.");
        }
    }
    if (newData.includes(undefined)) {
        throw new Error("Undefined values after collapsing values.");
    }
    else {
        return newData as number[];
    }
}

function checkIsGameOver(data: number[], width: number, height: number): boolean {
    for (let i = 0; i < data.length; ++i) {
        if (getIndicesOfconnectedElementsWithSameValue(data, i, width, height).length > 1) {
            return false;
        }
    }
    return true;
}

export interface GridProps {
    width: number,
    height: number,
    maxInitValue: number,
}

export function Grid(props: GridProps) {
    const [values, setValues] = useState<number[]>(randInts(0, props.maxInitValue, props.width * props.height));
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

    const gridTemplateColumns: string[] = [];
    for (let i = 0; i < props.width; ++i) {
        gridTemplateColumns.push("auto")
    }

    const highlightedIndices: number[] = selectedIndex === undefined ? [] : getIndicesOfconnectedElementsWithSameValue(values, selectedIndex, props.width, props.height);
    const cells = [];
    for (let i = 0; i < props.width * props.height; ++i) {
        const isActive = highlightedIndices.includes(i);
        cells.push(
            <div
            key={i}
            className={`grid-item ${isActive ? 'active-item' : ''}`}
            style={{backgroundColor: getColorFor(values[i])}}
            onClick={_event => {
                if (isActive) {
                    setValues(collapseConnectedElementsWithSameValue(values, i, props.width, props.height));
                    setSelectedIndex(undefined);
                }
                else {
                    setSelectedIndex(i)
                }
            }}>
                {values[i]}
            </div>
        )
    }

    const isGameOver = checkIsGameOver(values, props.width, props.height);

    return (
        <>
        {isGameOver && <div id="gameOver">Game over!</div>}
        <div className="grid-container" style={{gridTemplateColumns: gridTemplateColumns.join(" ")}}>
            {cells}
        </div>
        </>
    )
}