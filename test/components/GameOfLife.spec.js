import { spy } from 'sinon';
import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import GameOfLife from '../../app/components/GameOfLife';
import { Grid, Cell } from '../../app/components/GameOfLife';
import testStates from './testStates';

const compareStates = (state, nState) => {
    for (let i = 0; i < state.length; i++) {
        const row = state[i];
        const nRow = nState[i];
        for (let j = 0; j < state.length; j++) {
            const c = row[j];
            const nC = nRow[j];
            assert.equal(c.isAlive, nC.isAlive); 
        }
    }
};

describe('GameOfLife' , () => {
    it('Should return the expected new state', (done) => {
        const gol = new GameOfLife({
            cols: 12,
            rows: 4,
        });
        gol.Grid.size = {
            cols: 12,
            rows: 4,
        };
        for (let i = 0;i < testStates.length; i++) {
            const state = testStates[i].current;
            const expected = testStates[i].expected;
            gol.Grid.currentState = state;
            gol.Grid.buildNewState();
            compareStates(expected, gol.Grid.newState);
        }
        
        done();
    })

    it('Should reset the current state', (done) => {
        const gol = new GameOfLife({
            cols: 80,
            rows: 40,
        });
        gol.Grid.size = {
            cols: 80,
            rows: 40,
        };
        gol.Grid.resetCurrentState('glider');
        const glider = { // eslint-disable-next-line flowtype-errors/show-errors
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
        };
        Object.keys(glider).forEach((k) => {
            if (gol.Grid.currentState[k]) {
                for (let j = 0; j < 80; j++) {
                    if (glider[k].includes(j)) {
                        const c = gol.Grid.currentState[k][j];
                        assert.equal(c.isAlive, true);
                    } 
                }
            }
        });
        done();
    })
})