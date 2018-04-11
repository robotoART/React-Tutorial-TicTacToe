import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={props.className}
      onClick={props.onClick}
      >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let squareClassName;
    if (this.props.hilite === null || !this.props.hilite.includes(i)) {
      squareClassName = "square";
    } else {
      squareClassName = "winner-square";
    }
    return (
      <Square
        key={i}
        className={squareClassName}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  makeAllSquares() {
    let table = [];
    let c = 0;
    let v = 0;
    let l = ["A", "B", "C"];
    for (let i=0; v < 9; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(v));
        v++;
      }
      table.push(<div key={"row-"+l[c]} className="board-row">{squares}</div>)
      c++;
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
      sortToNext: "Descending",
      listClassName: "history-list",
      gameOver: false,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      this.setState({ gameOver: true,})
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
  toggleSortHistory(sortToNext) {
    if (sortToNext === "Ascending") {
      this.setState({
        sortToNext: "Descending",
        listClassName: "history-list",
      });
    } else {
      this.setState({
        sortToNext: "Ascending",
        listClassName: "history-list-reverse",
      });
    }
  }
  render() {
    const gameEnd = this.state.gameOver;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const currentStep = this.state.stepNumber;
    const winnerData = calculateWinner(current.squares);
    let winner = null;
    let hilite = null;
    if (winnerData != null) {
      winner = winnerData[0];
      hilite = winnerData[1];
    }
    const sortToNext = this.state.sortToNext;
    const listClassName = this.state.listClassName;
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
    } else if (!winner && !gameEnd && currentStep === 9) {
      status = 'Its a tie, please play again'
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
            hilite={hilite}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="sort-toggle" onClick={() => this.toggleSortHistory(sortToNext)}>Sort {sortToNext}</button>
          <ol className={listClassName}>{moves}</ol>
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
  let winnerInfo;
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
      winnerInfo = [squares[a], lines[i]];
      return winnerInfo;
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
