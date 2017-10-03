// @flow
import React, { Component } from 'react';
import styles from './GameOfLife.css';

/** Cell is a class representing each cell in the grid */
export class Cell {

    opts: {
        x: number,
        y: number,
        width: number,
        height: number,
        pos: {
            y: number,
            x: number
        }
    }

    isAlive: boolean

    /**
     * Create a cell.
     * @param {object} opts - The options object {x: number, y: number, width: number, height: number, pos: { x: number, y: number }}.
     */
    constructor(opts) {
        this.opts = opts;
    }

    /**
     * Draws a cell on the Grid.
     * @param {Grid} Grid - the Grid instance on which the cell will draw itself.
     */
    draw(Grid) {
        Grid.context.fillStyle = this.isAlive ? 'blue' : 'white';
        Grid.context.fillRect(this.opts.x, this.opts.y, this.opts.width, this.opts.height);
    }

    /**
     * Erases a cell on the Grid.
     * @param {Grid} Grid - the Grid instance on which the cell will draw itself.
     */
    undraw(Grid) {
        Grid.context.clearRect(this.opts.x, this.opts.y, this.opts.width, this.opts.height);
    }

    /**
     * Sets the cell to a dead status.
     * @param {Grid} Grid - the Grid instance on which the cell will draw itself.
     */
    die(Grid) {
        Grid.context.fillStyle = 'white';
        Grid.context.fillRect(this.opts.x, this.opts.y, this.opts.width, this.opts.height);
        this.isAlive = false;
    }

    /**
     * Sets the cell to alive status.
     * @param {Grid} Grid - the Grid instance on which the cell will draw itself.
     */
    live(Grid) {
        Grid.context.fillStyle = 'blue';
        Grid.context.fillRect(this.opts.x, this.opts.y, this.opts.width, this.opts.height);
        this.isAlive = true;
    }
    
    /**
     * Finds a cell's alive neighbours.
     * @param {Grid} Grid - the Grid instance on which the cell will draw itself.
     */
    getAliveNeighbours(Grid) {
        const x = this.opts.pos.x;
        const y = this.opts.pos.y;
        const minusX = (x - 1 < 0 ? (Grid.size.cols - 1) : x - 1);
        const plusX = (x + 1 >= Grid.size.cols ? 0 : x + 1);
        const plusY = (y + 1 >= Grid.size.rows ? 0 : y + 1);
        const minusY = (y - 1 < 0 ? (Grid.size.rows - 1) : y - 1);
        const neighbours = [
            [minusX, minusY],
            [minusX, plusY],
            [minusX, y],
            [x, minusY],
            [x, plusY],
            [plusX, minusY],
            [plusX, plusY],
            [plusX, y],
        ];
        const neighboursAlive = neighbours.reduce((agg, pos) => {
            const row = Grid.currentState[pos[1]];
            if (row && row[pos[0]]) {
                const c = row[pos[0]];
                if (c && c.isAlive) {
                    agg.push(c);
                }
            }
            return agg;
        }, []);

        return neighboursAlive;
    }

    /**
     * Creates a copy of the cell.
     */
    copy() {
        return new Cell(this.opts);
    }

}

/** Grid is the class representing an instance of the game's Grid */
export class Grid {

    state: {};
    currentState: ((Cell)[])[];
    newState: ((Cell)[])[];
    GameOfLife: GameOfLife;
    gameLoop: number;
    played: number;
    presetName: string;
    selectedPreset: {};
    presets: {
        blank: {},
        glider: {},
        acorn: {}
    };
    size: {
        cellWidth: number,
        gridBorderWith: number,
        cols: number,
        rows: number,
        width: number,
        height: number
    };
    context: any;
    canvas: any;

     /**
     * Create a grid.
     * @param {GameOfLife} GameOfLife - The game of life instance to which the grid will be attached.
     */
    constructor(GameOfLife: any) {
        this.currentState = [];
        this.played = 0;
        this.GameOfLife = GameOfLife;
        /* eslint-disable max-len */
        this.presets = {
            blank: {},
            glider: { // eslint-disable-next-line flowtype-errors/show-errors
                9: [44], // eslint-disable-next-line flowtype-errors/show-errors
                10: [42, 44],  // eslint-disable-next-line flowtype-errors/show-errors
                11: [32, 33, 40, 41, 54, 55], // eslint-disable-next-line flowtype-errors/show-errors
                12: [31, 35, 40, 41, 54, 55], // eslint-disable-next-line flowtype-errors/show-errors
                13: [20, 21, 30, 36, 40, 41], // eslint-disable-next-line flowtype-errors/show-errors
                14: [20, 21, 30, 34, 36, 37, 42, 44],
                // eslint-disable-next-line flowtype-errors/show-errors
                15: [30, 36, 44],  // eslint-disable-next-line flowtype-errors/show-errors
                16: [31, 35], // eslint-disable-next-line flowtype-errors/show-errors
                17: [32, 33], // eslint-disable-next-line flowtype-errors/show-errors
            },
            acorn: { // eslint-disable-next-line flowtype-errors/show-errors
                25: [50], // eslint-disable-next-line flowtype-errors/show-errors
                26: [52], // eslint-disable-next-line flowtype-errors/show-errors
                27: [49, 50, 53, 54, 55], // eslint-disable-next-line flowtype-errors/show-errors
            },
        };
        /* eslint-enable max-len */
    }

    /**
     * Resets the current state to the preset selected.
     * @param {string} preset - The preset string to use.
     */
    resetCurrentState(preset: string = 'blank') {
        const selectedPreset = this.selectedPreset || this.presets[preset];
        this.currentState = [];
        for (let i = 0; i < this.size.rows; i++) {
            const row: (Cell)[] = [];
            for (let j = 0; j < this.size.cols; j++) {
                const c = new Cell({
                    x: j * this.size.cellWidth,
                    y: (i * this.size.cellWidth) + this.size.gridBorderWith,
                    width: this.size.cellWidth - this.size.gridBorderWith,
                    height: this.size.cellWidth - this.size.gridBorderWith,
                    pos: {
                        x: j,
                        y: i,
                    },
                });
                c.isAlive = selectedPreset[i] && selectedPreset[i].includes(j);
                row.push(c);
            }
            this.currentState.push(row);
        }
    }

    /**
     * Callback when event click on canvas is triggered.
     * @param {event} e - The event.
     */
    // eslint-disable-next-line flowtype-errors/show-errors
    cellClicked(e) {
        if (!this.GameOfLife.running) {
            const pos = {
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY,
            };

            this.toggleCellFromPos(pos);
        }
    }

    /**
     * Toggles a cell according to x (px) and y (px) positions.
     * @param {object} post - The position of the click in the canvas (in px); {x: number, y: number}
     */
    toggleCellFromPos(pos: { x: number, y: number }) {
        for (let i = 0; i < this.currentState.length; i++) {
            if (this.currentState[i]) {
                const row: (Cell)[] = this.currentState[i];
                for (let j = 0; j < row.length; j++) {
                    const c: Cell = row[j];
                    if (c && c.opts && c.opts.x < pos.x &&
                        c.opts.x + this.size.cellWidth > pos.x &&
                        c.opts.y < pos.y && c.opts.y + this.size.cellWidth > pos.y) {
                        c.isAlive = !c.isAlive;
                        c.draw(this);
                    }
                }
            }
        }
    }

    /**
     * Draws the current state.
     */
    draw() {
        for (let i = 0; i < this.currentState.length; i++) {
            if (this.currentState[i]) {
                const row = this.currentState[i];
                for (let j = 0; j < row.length; j++) {
                    const c: Cell = row[j];
                    c.draw(this);
                }
            }
        }
    }

    /**
     * Updates the state from the new state and redraw the cells
     */
    update() {
        for (let i = 0; i < this.currentState.length; i++) {
            if (this.currentState[i]) {
                const row = this.currentState[i];
                for (let j = 0; j < row.length; j++) {
                    const c: Cell = row[j];
                    c.undraw(this);
                }
            }
        }

        this.currentState = this.newState;

        this.draw();
    }

    /**
     * Sets the selected preset according to the string passed
     * @param {string} preset - The preset string
     */
    setSelectedPreset(preset: string = 'blank') {
        this.presetName = preset;
        this.selectedPreset = this.presets[preset];
    }

    /**
     * Draws the canvas (background)
     */
    drawCanvas() {
        const context = this.canvas.getContext('2d');
        this.context = context;
        context.fillStyle = '#dedede';
        context.fillRect(0, 0, this.size.width, this.size.height);
    }

    /**
     * Plays the game
     */
    play() {
        if (!this.running) {
            this.GameOfLife.state.running = true;
            this.GameOfLife.setState({
                gamePreset: this.presetName,
                generations: this.GameOfLife.state.generations,
                running: true,
            });
            this.gameLoop = setInterval(this.nextGeneration.bind(this), 1);
        }
    }

    /**
     * Builds the new state
     */
    buildNewState() {
        const newState: ((Cell)[])[] = [];
        for (let i = 0; i < this.currentState.length; i++) {
            if (this.currentState[i]) {
                const row = this.currentState[i];
                const newRow: (Cell)[] = [];
                for (let x = 0; x < row.length; x++) {
                    const cell = row[x];
                    const aliveNeigbours = cell.getAliveNeighbours(this);
                    const cellCopy = cell.copy();

                    if (cell.isAlive) {
                        if (aliveNeigbours.length === 2 || aliveNeigbours.length === 3) {
                            cellCopy.isAlive = true;
                            newRow.push(cellCopy);
                        } else {
                            cellCopy.isAlive = false;
                            newRow.push(cellCopy);
                        }
                    } else if (aliveNeigbours.length === 3) {
                        cellCopy.isAlive = true;
                        newRow.push(cellCopy);
                    } else {
                        cellCopy.isAlive = false;
                        newRow.push(cellCopy);
                    }
                }
                newState.push(newRow);
            }
        }
        this.newState = newState;
    }

    /**
     * This is function called for every loop
     */
    nextGeneration() {
        if (this.currentState.length > 0) {
            this.buildNewState();
            this.update();
            this.played += 1;
            this.GameOfLife.state.generations += 1;
            this.GameOfLife.setState({
                gamePreset: this.presetName,
                generations: this.GameOfLife.state.generations,
            });
        }
    }

    /**
     * Stops (pauses) the loop.
     */
    stop() {
        clearInterval(this.gameLoop);
        this.GameOfLife.state.running = false;
        this.GameOfLife.setState({
            gamePreset: this.presetName,
            generations: this.GameOfLife.state.generations,
            running: false,
        });
    }

    /**
     * Resets the grid.
     */
    reset() {
        this.stop();
        this.resetCurrentState(this.GameOfLife.state.gamePreset);
        this.GameOfLife.state.generations = 0;
        this.GameOfLife.setState({
            gamePreset: this.presetName,
            generations: this.GameOfLife.state.generations,
        });
        this.draw();
    }

}


/** GameOfLife is a Component used to easily add a new instance of the GameOfLife */
export default class GameOfLife extends Component {

    Grid: Grid;
    props: {
        cols: string,
        rows: string,
        cellWidth: string
    };
    state: {
        generations: number,
        gamePreset: string,
        running: boolean
    }

    /**
     * Creates a GameOfLife
     * @param {*} props - the {cols, rows, cellWidth} 
     */
    constructor(props: {
        cols: string,
        rows: string,
        cellWidth: string
    }) {
        super(props);

        this.state = { gamePreset: 'blank', generations: 0, running: false };
        this.Grid = new Grid(this);
    }

    /**
     * Function called after component has been mounted
     * sets the Grid size
     * draws the inital canvas
     * sets the state to the current preset
     * draw the grid and cells
     */
    componentDidMount() {
        const cols = Number(this.props.cols);
        const rows = Number(this.props.rows);
        const cellWidth = Number(this.props.cellWidth);

        this.Grid.size = {
            width: cols * cellWidth,
            height: rows * cellWidth,
            gridBorderWith: 1,
            rows,
            cols,
            cellWidth,
        };

        this.Grid.drawCanvas();
        this.Grid.resetCurrentState(this.state.gamePreset);
        this.Grid.draw();
    }

    /**
     * Callback when event change on preset triggers.
     * @param {event} event - The position of the click in the canvas (in px); {x: number, y: number}
     */
    handlePresetChange(event: any) {
        if (!this.Grid.running) {
            this.setState({ gamePreset: event.target.value });
            this.Grid.setSelectedPreset(event.target.value);
            return this.Grid.reset();
        }
    }

    /**
     * Prints the Component DOM
      */
    render() {
        /* eslint-disable max-len */
        return (
            <div className={styles.gameWrapper}>
                <h2>Game of Life</h2>
                <p>
                    <i>
                    Choose a preset and click on the cells to toggle
                        their state (alive/dead)<br />
                    When you{"'"}re ready click Play Game !
                    </i>
                </p>
                <div className={styles.grid}>
                    <span className={styles.counter}>Number of generations : {this.state.generations}</span>
                    <canvas
                      ref={(c) => { this.Grid.canvas = c; }}
                      id="canvas"
                      width="800"
                      height="400"
                      onClick={this.Grid.cellClicked.bind(this.Grid)}
                    />
                    <div className={styles.presets}>
                        <label htmlFor="preset">Presets :</label>
                        <select
                          name="preset"
                          disabled={(this.state.running) ? 'disabled' : ''}
                          value={this.state.gamePreset}
                          onChange={this.handlePresetChange.bind(this)}
                        >
                            <option value="blank">Blank</option>
                            <option value="glider">Glider</option>
                            <option value="acorn">Acorn</option>
                        </select>
                    </div>
                    <button onClick={this.Grid.play.bind(this.Grid)}>Play Game</button>
                    <button onClick={this.Grid.stop.bind(this.Grid)}>Pause Game</button>
                    <button onClick={this.Grid.reset.bind(this.Grid)}>New Game</button>
                </div>
            </div>
        );
        /* eslint-enable max-len */
    }
}
