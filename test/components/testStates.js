import { Grid, Cell } from '../../app/components/GameOfLife';

const aliveCell = (props) => {
    const n = new Cell(props);
    n.isAlive = true;
    return n;
};

const deadCell = (props) => {
    const n = new Cell(props);
    n.isAlive = false;
    return n;
};

const populateState = (grid) => {
    let ctery = -1;
    return grid.map((i) => {
        ctery++;
        let cterx = -1;
        return i.map((j) => {
            cterx++;
            const props = {
                pos: {
                    x: cterx,
                    y: ctery
                }
            };
            return (j === 0 ? deadCell(props) : aliveCell(props))
        });
    });
};

const testStates = [
    {
        current: populateState([
            [0,0,0,0,0,0,0,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0]
        ]),
        expected: populateState([
            [0,0,0,0,0,0,0,0,1,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,0,0,0]
        ]),
    },
    {
        current: populateState([
            [0,0,0,0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,0]
        ]),
        expected: populateState([
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0]
        ]), 
    },
    {
        current: populateState([
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,0,0,0,0,0,0,0,0],
            [0,0,0,1,1,1,0,0,0,0,0,0]
        ]),
        expected: populateState([
            [0,0,0,0,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,0,0,0,0,0,0,0]
        ]), 
    },
    {
        current: populateState([
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,0,0,0,0,0,0,0,0],
            [0,0,0,1,1,1,0,0,0,0,0,0]
        ]),
        expected: populateState([
            [0,0,0,0,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,0,0,0,0,0,0,0]
        ]), 
    }
];

export default testStates;