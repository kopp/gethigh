import { assert, test } from 'vitest';

import { collapseConnectedElementsWithSameValue, asIndex } from "./Grid";

test("asIndex", () => {
    assert(23 === asIndex({row: 4, column: 3}, 5, 5));
});

test("collapse A", () => {
    /*
    3  4  1  3  3
    1  2  4  1  3
    4  3  4  3  3
    0  2  4  0  2
    3  3  4 >4< 1
    */
    const values = [3,4,1,3,3,1,2,4,1,3,4,3,4,3,3,0,2,4,0,2,3,3,4,4,1];
    const width = 5;
    const height = 5;
    const idx = (row: number, col: number) => asIndex({row: row, column: col}, width, height);
    const collapsed = collapseConnectedElementsWithSameValue(values, idx(4, 3), 5, 5);
    // value was properly incremented
    assert(values[idx(4, 3)] + 1 === collapsed[idx(4, 3)]);
    // four elements in the column one to the left were removed, the topmost one moved down
    assert(values[idx(0, 2)] === collapsed[idx(4, 2)]);
    assert(undefined === collapsed[idx(3, 2)]);
    assert(undefined === collapsed[idx(2, 2)]);
    assert(undefined === collapsed[idx(1, 2)]);
    assert(undefined === collapsed[idx(0, 2)]);
});

test("collapse B", () => {
    /*
    1  3  1  1  0
    0  2  1  1  1
    0  3  2  0  3
    2  1  0  3  3
    2  2  0  0 >3<
    */
    const values = [1,3,1,1,0,0,2,1,1,1,0,3,2,0,3,2,1,0,3,3,2,2,0,0,3];
    const width = 5;
    const height = 5;
    const idx = (row: number, col: number) => asIndex({row: row, column: col}, width, height);
    const collapsed = collapseConnectedElementsWithSameValue(values, idx(4, 4), 5, 5);
    // value was properly incremented
    assert(values[idx(4, 4)] + 1 === collapsed[idx(4, 4)]);
    // two elements in column 4 fell down by two
    assert(values[idx(1, 4)] === collapsed[idx(3, 4)]);
    assert(values[idx(0, 4)] === collapsed[idx(2, 4)]);
    // two empty cells remain in column 4
    assert(undefined === collapsed[idx(1, 4)]);
    assert(undefined === collapsed[idx(0, 4)]);
    // three elements in column 3 fell down by one
    assert(values[idx(2, 3)] === collapsed[idx(3, 3)]);
    assert(values[idx(1, 3)] === collapsed[idx(2, 3)]);
    assert(values[idx(0, 3)] === collapsed[idx(1, 3)]);
    // the bottom most one did not move
    assert(values[idx(4, 3)] === collapsed[idx(4, 3)]);
    // the to most one is empty
    assert(undefined === collapsed[idx(0, 3)]);

});

