export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  };

  const observers = [];

  function start() {
    const frequency = 2000;

    setInterval(addFruit, frequency);
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  // Notifica o observer sobre quem está se movimentando
  function notifyAll(command) {
    console.log(
      `keyboardListener -> Notifying ${observers.length} observer(s)`
    );

    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX =
      "playerX" in command
        ? command.playerX
        : Math.floor(Math.random() * state.screen.width);
    const playerY =
      "playerY" in command
        ? command.playerY
        : Math.floor(Math.random() * state.screen.height);

    state.players[playerId] = {
      x: playerX,
      y: playerY
    };

    notifyAll({
      type: "add-player",
      playerId: playerId,
      playerX: playerX,
      playerY: playerY
    });
  }

  function removePlayer(command) {
    const playerId = command.playerId;

    delete state.players[playerId];

    notifyAll({
      type: "remove-player",
      playerId: playerId
    });
  }

  function addFruit(command) {
    const fruitId = command
      ? command.fruitId
      : Math.floor(Math.random() * 1000000);
    const fruitX = command
      ? command.fruitX
      : Math.floor(Math.random() * state.screen.width);
    const fruitY = command
      ? command.fruitY
      : Math.floor(Math.random() * state.screen.height);

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    };

    notifyAll({
      type: "add-fruit",
      fruitId: fruitId,
      fruitX: fruitX,
      fruitY: fruitY
    });
  }

  function removeFruit(command) {
    const { fruitId } = command;

    delete state.fruits[fruitId];

    notifyAll({
      type: "remove-fruit",
      fruitId: fruitId
    });
  }

  function movePlayer(command) {
    notifyAll(command);
    console.log(state.screen);
    const acceptedMoves = {
      ArrowUp(player) {
        // Retorna o valor máximo entre a posição player.y - 1 e 0
        player.y = Math.max(player.y - 1, 0);
      },
      ArrowRight(player) {
        // Retorna o menor valor entre player.x + 1 e a largura do canvas
        player.x = Math.min(player.x + 1, state.screen.width - 1);
      },
      ArrowDown(player) {
        // Retorna o menot valor entre player.y e a altura do canvas
        player.y = Math.min(player.y + 1, state.screen.height - 1);
      },
      ArrowLeft(player) {
        // Retorna o maior valor entre player.x e 0
        player.x = Math.max(player.x - 1, 0);
      }
    };

    const { keyPressed } = command;
    const { playerId } = command;
    const player = state.players[command.playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFruitCollision(playerId);
    }
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      console.log(`Checking ${playerId} and ${fruitId}`);

      if (player.x === fruit.x && player.y === fruit.y) {
        console.log(`COLLISION between ${playerId} and ${fruitId}`);
        removeFruit({ fruitId });
      }
    }
  }

  return {
    addPlayer,
    removePlayer,
    movePlayer,
    addFruit,
    removeFruit,
    state,
    setState,
    subscribe,
    start
  };
}
