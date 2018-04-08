import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  makeAllSquares() {
    let table = [];
    let v = 0;
    for (let i=0; v < 9; i++) {
      let squares = [];
      for (var j = 0; j < 3; j++) {
        squares.push(this.renderSquare(v));
        v++;
      }
      table.push(<div className="board-row">{squares}</div>)
    }
    return (table);
  }
  render() {
    return (
      <div className="game-squares">
        {this.makeAllSquares()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      stepCoords: "",
      xIsNext: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history : history.concat([{
        squares: squares,
        stepCoords: getCoordinate(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const coords = history[move].stepCoords;
      const desc = move ?
        'Go to move #' + move + ", " + coords :
        'Go to game start';
      return (
        <li key={move}>
            <button className="history-button" onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">

        <div className="game-board">
          <div className="board-row">
            <div className="empty">0</div>
            <div className="ruler">1</div>
            <div className="ruler">2</div>
            <div className="ruler">3</div>
          </div>
          <div className="row-names">
            <div className="ruler">A</div>
            <div className="ruler">B</div>
            <div className="ruler">C</div>
          </div>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for (let i=0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] ===squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getCoordinate(i) {
  const grid = [
    "(1,A)", "(2,A)", "(3,A)",
    "(1,B)", "(2,B)", "(3,B)",
    "(1,C)", "(2,C)", "(3,C)",
  ];
  return grid[i];
}
