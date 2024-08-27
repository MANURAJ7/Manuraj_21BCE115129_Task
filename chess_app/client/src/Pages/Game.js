import { useState, useEffect } from "react";
import "./Game.css";

const Game = ({ socket, roomName }) => {
  const [turn, setTurn] = useState(false);
  const [id, setId] = useState(null);
  const [grid, setGrid] = useState(null);
  const [command, setCommand] = useState("");
  const [characters, setCharacters] = useState({
    p1: { position: [null, null], alive: false },
    p2: { position: [null, null], alive: false },
    p3: { position: [null, null], alive: false },
    h1: { position: [null, null], alive: false },
    h2: { position: [null, null], alive: false },
  });

  useEffect(() => {
    if (roomName && !grid) socket.emit("get-grid", roomName);

    const handleGridResponse = (newGrid, newId, turnId) => {
      console.log("new grid : ", newGrid);
      if (!grid && newGrid) {
        setId(newId);
        setGrid(newGrid);
        if (newId === turnId) setTurn(true);
        else setTurn(false);
      } else {
        console.error("Received an invalid grid");
      }
    };

    socket.on("get-grid-res", handleGridResponse);

    return () => {
      socket.off("get-grid-res", handleGridResponse);
    };
  }, [socket]);

  useEffect(() => {
    socket.on("move-update", (newGrid, playerId, move) => {
      setGrid([...newGrid]);
      if (playerId !== id) setTurn(true);
    });

    return () => {
      socket.off("move-update");
    };
  }, [socket, id]);

  useEffect(() => {
    if (grid && id) {
      initializeCharacters();
    }
  }, [grid]);

  const initializeCharacters = () => {
    const newCharacters = { ...characters };
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell !== "x") {
          const [cellPlayerId, charName] = cell.split("-");
          if (cellPlayerId === id) {
            newCharacters[charName.toLowerCase()] = {
              position: [rowIndex, cellIndex],
              alive: true,
            };
          }
        }
      });
    });
    setCharacters(newCharacters);
    console.log(characters);
  };

  const handleCommand = (e) => {
    e.preventDefault();
    const newCommand = checkValidMove(command);
    if (newCommand !== "" && executeCommand(newCommand)) {
      console.log(" before call :", grid);
      socket.emit("newMove", newCommand, roomName);
    } else wrongMoveHandler();
    setCommand("");
  };

  function wrongMoveHandler() {
    // alert("Wrong Move");
  }

  function checkValidMove(input) {
    input = input.replace(/\s+/g, "");
    input = input.toLowerCase();
    const [characterName, move] = input.split(":");

    const character = characters[characterName];

    if (!character || !character.alive) {
      if (!character) alert("wrong character name");
      else alert("Dead !");
      return "";
    }

    const validMoves = {
      p1: ["l", "r", "f", "b"],
      p2: ["l", "r", "f", "b"],
      p3: ["l", "r", "f", "b"],
      h1: ["l", "r", "f", "b"],
      h2: ["fl", "fr", "bl", "br"],
    };

    if (!validMoves[characterName].includes(move)) {
      alert("Invalid move");
      return "";
    }

    let reverse = input;
    if (id === "B") {
      reverse = input
        .split("")
        .map((char) => {
          if (char === "l") return "r";
          if (char === "r") return "l";
          if (char === "f") return "b";
          if (char === "b") return "f";
          return char;
        })
        .join("");
      input = reverse;
    }

    return input;
  }

  function executeCommand(command) {
    let isValid = 1;
    const [characterName, move] = command.split(":");
    const character = characters[characterName];

    if (!character.alive) {
      alert("Dead Character");
      return false;
    }

    let [x, y] = character.position;
    let newX = x;
    let newY = y;

    switch (move) {
      case "l":
        newY -= 1;
        break;
      case "r":
        newY += 1;
        break;
      case "f":
        newX -= 1;
        break;
      case "b":
        newX += 1;
        break;
      case "fl":
        newX -= 2;
        newY -= 2;
        break;
      case "fr":
        newX -= 2;
        newY += 2;
        break;
      case "bl":
        newX += 2;
        newY -= 2;
        break;
      case "br":
        newX += 2;
        newY += 2;
        break;
      default:
        return false;
    }
    if (characterName === "h1") {
      switch (move) {
        case "l":
          newY -= 1;
          break;
        case "r":
          newY += 1;
          break;
        case "f":
          newX -= 1;
          break;
        case "b":
          newX += 1;
          break;
        default:
          return false;
      }
    }

    if (newX < 0 || newX >= 5 || newY < 0 || newY >= 5) {
      alert("Out of range");
      return false;
    }

    let i = x;
    let j = y;
    while (x !== newX || y !== newY) {
      if (x < newX) x++;
      else if (x > newX) x--;

      if (y > newY) y--;
      else if (y < newY) y++;

      if (grid[x][y] && grid[x][y].startsWith(id)) {
        alert("Cant kill own characters", grid[x][y]);
        return false;
      }
    }

    x = i;
    y = j;
    let prevCellValue = grid[x][y];
    grid[x][y] = "x";
    while (x != newX || y != newY) {
      if (x < newX) x++;
      else if (x > newX) x--;
      if (y > newY) y--;
      else if (y < newY) y++;
      grid[x][y] = "x";
    }
    grid[newX][newY] = prevCellValue;
    setGrid([...grid]);
    console.log(grid);
    characters[characterName].position = [newX, newY];

    return true;
  }

  return (
    <div className="game-container">
      <h2>Hi {socket.id} !</h2>
      <h3>
        welcome to room: {roomName} as {id === "V" ? "Guest" : id}
      </h3>

      {grid ? (
        <div className="grid-container">
          {(id === "B" ? [...grid].reverse() : grid).map((row, rowIndex) => (
            <div className="grid-row" key={rowIndex}>
              {(id === "B" ? [...row].reverse() : row).map(
                (cell, cellIndex) => (
                  <div className="grid-cell" key={cellIndex}>
                    {cell === "x" ? "" : cell}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {turn && id !== "V" ? (
        <div className="game-controls">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter your move"
            className="command-input"
          />
          <button onClick={handleCommand} className="submit-button">
            Submit Move
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Game;
