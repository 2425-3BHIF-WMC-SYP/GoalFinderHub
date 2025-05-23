export const GameStore = {
  latestGame: null as any | null,
  previousGames: [] as any[],

  startGame(game: any) {
    this.latestGame = game;
  },

  endGame() {
    if (!this.latestGame) return;

    this.previousGames.unshift(this.latestGame);
    this.latestGame = null;
  },

  getLatestGame() {
    return this.latestGame;
  },

  getPreviousGames() {
    return this.previousGames;
  },
};
