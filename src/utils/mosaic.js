// Layout for the gallery mosaic.
//
// Tiles vary in size but must still leave a clean edge, so rather than letting
// the grid pack them, photos are laid out in blocks that tile a 6-column grid
// exactly. Each block is a fixed arrangement covering every cell it spans;
// laying blocks end to end can therefore never leave a hole.
//
// Coordinates are 1-based (col, row) within the block, plus a width/height in
// grid cells.
const COLUMNS = 6;

const BLOCKS = [
    // Big square top-left, stack of two on the right, band along the bottom.
    {
        height: 6,
        tiles: [
            { col: 1, row: 1, w: 4, h: 4 },
            { col: 5, row: 1, w: 2, h: 2 },
            { col: 5, row: 3, w: 2, h: 2 },
            { col: 1, row: 5, w: 2, h: 2 },
            { col: 3, row: 5, w: 4, h: 2 },
        ],
    },
    // The mirror of the first: band on top, big square bottom-right.
    {
        height: 6,
        tiles: [
            { col: 1, row: 1, w: 4, h: 2 },
            { col: 5, row: 1, w: 2, h: 2 },
            { col: 1, row: 3, w: 2, h: 2 },
            { col: 3, row: 3, w: 4, h: 4 },
            { col: 1, row: 5, w: 2, h: 2 },
        ],
    },
    // A calmer block, to break up the run of big squares.
    {
        height: 4,
        tiles: [
            { col: 1, row: 1, w: 2, h: 2 },
            { col: 3, row: 1, w: 2, h: 2 },
            { col: 5, row: 1, w: 2, h: 2 },
            { col: 1, row: 3, w: 3, h: 2 },
            { col: 4, row: 3, w: 3, h: 2 },
        ],
    },
];

// Blocks for the 1-4 photos that can be left over at the end. These are flush
// too, so the mosaic ends on a straight edge whatever the photo count.
const REMAINDERS = {
    1: { height: 2, tiles: [{ col: 1, row: 1, w: 6, h: 2 }] },
    2: { height: 2, tiles: [{ col: 1, row: 1, w: 3, h: 2 }, { col: 4, row: 1, w: 3, h: 2 }] },
    3: {
        height: 2,
        tiles: [
            { col: 1, row: 1, w: 2, h: 2 },
            { col: 3, row: 1, w: 2, h: 2 },
            { col: 5, row: 1, w: 2, h: 2 },
        ],
    },
    4: {
        height: 4,
        tiles: [
            { col: 1, row: 1, w: 3, h: 2 },
            { col: 4, row: 1, w: 3, h: 2 },
            { col: 1, row: 3, w: 3, h: 2 },
            { col: 4, row: 3, w: 3, h: 2 },
        ],
    },
};

// Picks the block to lay next, given how many photos are still unplaced. Full
// blocks are used while enough photos remain to keep filling one after it;
// otherwise the run ends on a remainder block.
const nextBlock = (remaining, cursor) => {
    if (remaining <= 4) return REMAINDERS[remaining];

    const block = BLOCKS[cursor % BLOCKS.length];
    const left = remaining - block.tiles.length;
    // Never leave a gap we have no block for (5 or 6 photos with no full block
    // of that size to hand): fall back to the smallest full block instead.
    if (left === 0 || left <= 4) return block;
    return remaining >= block.tiles.length ? block : BLOCKS[0];
};

/**
 * Returns one grid placement per photo: `{ column, row, w, h }`, in the order
 * the photos were given. Rows are 1-based, so the values drop straight into
 * `grid-column` / `grid-row`.
 */
export const mosaicLayout = (count) => {
    const placements = [];
    let row = 1;
    let cursor = 0;

    while (placements.length < count) {
        const remaining = count - placements.length;
        const block = nextBlock(remaining, cursor);

        for (const tile of block.tiles) {
            if (placements.length === count) break;
            placements.push({ column: tile.col, row: row + tile.row - 1, w: tile.w, h: tile.h });
        }

        row += block.height;
        cursor += 1;
    }

    return placements;
};

export { COLUMNS as MOSAIC_COLUMNS };
