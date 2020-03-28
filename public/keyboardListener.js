export default function createKeyboardListener(document) {
  // Objeto que guarda a função de movimentar o player
  const state = {
    observers: [],
    playerId: null
  };

  function registerPlayerId(playerId) {
    state.playerId = playerId;
  }

  // Efetivamente guarda as funções de movimentação
  // mas que poderia ser qualquer outra
  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  // Notifica o observer sobre quem está se movimentando
  function notifyAll(command) {
    console.log(
      `keyboardListener -> Notifying ${state.observers.length} observer(s)`
    );

    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }

  document.addEventListener("keydown", handleKeydown);

  // Pega o input do jogador e notifica o observer sobre ele
  function handleKeydown(event) {
    const keyPressed = event.key;

    const command = {
      type: "move-player",
      playerId: state.playerId,
      keyPressed
    };

    notifyAll(command);
  }

  return {
    subscribe,
    registerPlayerId
  };
}
