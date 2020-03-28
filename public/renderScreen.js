export default function renderScreen(
  screen,
  game,
  requestAnimationFrame,
  currentPlayerId
) {
  // Reseta o canvas
  const context = screen.getContext("2d");
  context.fillStyle = "white";
  context.clearRect(0, 0, 10, 10);

  // Renderiza os jogadores
  for (const playerId in game.state.players) {
    const player = game.state.players[playerId];
    context.fillStyle = "#333";
    context.fillRect(player.x, player.y, 1, 1);
  }

  // Renderiza as frutas
  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId];
    context.fillStyle = "green";
    context.fillRect(fruit.x, fruit.y, 1, 1);
  }

  const currentPlayer = game.state.players[currentPlayerId];

  if (currentPlayerId) {
    context.fillStyle = "#f0db4f";
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
  }

  // Chama recursivamente a mesma função para desenhar a tela
  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame, currentPlayerId);
  });
}
