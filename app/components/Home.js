// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import GameOfLife from './GameOfLife';

export default class Home extends Component {

    render() {
        return (
            <div>
                <div className={styles.container} data-tid="container">
                    <GameOfLife cols="80" rows="40" cellWidth="10" />
                </div>
            </div>
        );
    }
}
