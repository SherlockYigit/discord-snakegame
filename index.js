/**
 * @class
 * @description discord-snakegame
 * @extends Map
 */
class discord_snakegame extends Map {
  /**
   * @constructor
   * @param {object} gameOptions You don't need to edit.
   * @example
   * new SnakeGame({ backg: "🟫", snake: "🟠", snakeTail: "🟡", apple: "🍎" });
   */
  constructor(gameOptions = { backg: "🟫", snake: "🟠", snakeTail: "🟡", apple: "🍎" }) {
    super();
  
    this.defaultOptions = { backg: "🟫", snake: "🟠", snakeTail: "🟡", apple: "🍎" };
    
    gameOptions = this.checkGameOptions(gameOptions, this.defaultOptions);
    
    this.gameOptions = gameOptions;
  }
  /**
   * Game map creation function.
   * @param {string} gameID 
   * @returns {string} 
   * @example
   * SnakeGame.createGame("test_1")
   */
  createGame(gameID) {
    if (!gameID) throw new Error("You must specify an ID.");
    if (this.has(`mapObjects_${gameID}`)) throw new Error("There is a game with this ID!");
    
    const self = this;
    
    const mapObjects = [];
    
    for (let y = 0; 10 > y; y++) {
      for (let x = 0; 10 > x; x++) {
        mapObjects[y * 10 + x] = { symbol: self.gameOptions.backg, coordinats: { x, y } }
      }
    }
    
    const snakeIndex = Math.floor(Math.random() * mapObjects.length);
    const appleIndex = Math.floor(Math.random() * mapObjects.length);
    
    mapObjects[snakeIndex] = { symbol: self.gameOptions.snake, coordinats: { ...mapObjects[snakeIndex].coordinats } };
    mapObjects[appleIndex] = { symbol: self.gameOptions.apple, coordinats: { ...mapObjects[appleIndex].coordinats } };
    
    this.set(`snakeParts_${gameID}`, [ mapObjects[snakeIndex] ]);
    this.set(`scoreboard_${gameID}`, { score: 0, startedAt: Date.now() })
    this.set(`mapObjects_${gameID}`, mapObjects);
    
    return this.resizeMap(gameID);
  }
  /**
   * The function that edits the game map.
   * @param {string} gameID 
   * @returns {string} 
   * @example
   * SnakeGame.resizeMap("test_1")
   */
  resizeMap(gameID) {
    if (!gameID) throw new Error("You must specify an ID.");
    if (!this.has(`mapObjects_${gameID}`)) throw new Error("No game with this ID found!");
    const mapObjects = this.get(`mapObjects_${gameID}`);
    if (!Array.isArray(mapObjects)) return false;
    let map = [];
    
    for (let i = 0; mapObjects.length >= i; i++) {
      i + 2 > 10 ? (i+2) % 10 == 2 ? map.push(mapObjects.slice(i - 10 > 0 ? i - 10 : 0, i).map((el) => el.symbol).join("")) : "" : ""
    }
    
    this.set(`map_${gameID}`, map);
    
    return map.join("\n");
  }
  /**
   * Snake steering function.
   * @param {string} gameID 
   * @param {object} coordinats
   * @returns {string} 
   * @example
   * SnakeGame.moveSnake("test_1", { x: 5, y: 9 })
   */
  moveSnake(gameID, coordinats = {}) {
    if (!gameID) throw new Error("You must specify an ID.");
    if (!this.has(`mapObjects_${gameID}`)) throw new Error("No game with this ID!");
    
    const self = this;
    
    if (!gameID) return { error: true, message: "You must provide a id!" };
    if (!coordinats.hasOwnProperty("x") || !coordinats.hasOwnProperty("y")) return { error: true, message: "You must enter a valid coordinate object." };
    const user = this.get(`scoreboard_${gameID}`);
    if (!user) return { error: true, message: "You must provide valid a id!" };
    const map = this.get(`mapObjects_${gameID}`);
    const SnakeParts = this.get(`snakeParts_${gameID}`);
    
    const snakeIndex = map.findIndex((val) => val.symbol == self.gameOptions.snake);
    const newLocationIndex = map.findIndex((val) => val.coordinats.x == coordinats.x && val.coordinats.y == coordinats.y);
    if (0 > newLocationIndex) return this.endGame();
    
    if (map[newLocationIndex].symbol == this.gameOptions.apple) {
      const oldD = this.get(`scoreboard_${gameID}`);
      
      map[Math.floor(map.length * Math.random())].symbol = this.gameOptions.apple;
      
      const oldPartData = SnakeParts[SnakeParts.length - 1];
      const tailData = { 
        symbol: self.gameOptions.snakeTail, 
        coordinats: { 
          x: oldPartData.coordinats.x, 
          y: oldPartData.coordinats.y 
        } 
      };
      
      SnakeParts.push(tailData);
      
      this.set(`scoreboard_${gameID}`, { score: Math.floor(oldD.score + 1), startedAt: oldD.startedAt });
    } else map[snakeIndex].symbol = this.gameOptions.backg;
    
    map[newLocationIndex].symbol = this.gameOptions.snake;
    
    SnakeParts.slice(1).forEach((part, index) => {
      const oldIndex = map.findIndex(({ coordinats }) => coordinats.x == part.x && coordinats.y == part.y);
      if (SnakeParts.length - 1 == index) map[oldIndex].symbol = self.gameOptions.backg;
      
      const oldPartData = SnakeParts[index - 1];
      const tailData = { 
        symbol: self.gameOptions.snakeTail, 
        coordinats: { 
          x: oldPartData.coordinats.x, 
          y: oldPartData.coordinats.y 
        } 
      };
      const newIndex = map.findIndex(({ coordinats }) => coordinats.x == tailData.x && coordinats.y == tailData.y);
      
      map[newIndex].symbol = self.gameOptions.snakeTail;
      
      SnakeParts[index].coordinats = { ...tailData.coordinats };
    })
    SnakeParts[0].coordinats = { ...map[newLocationIndex].coordinats }
    
    this.set(`snakeParts_${gameID}`, SnakeParts);
    this.set(`mapObjects_${gameID}`, map);
    
    return this.resizeMap(gameID);
  }
  /**
   * Terminates the game.
   * @param {string} gameID 
   * @returns {boolean} 
   * @example
   * SnakeGame.endGame("test_1")
   */
  endGame(gameID) {
    if (!gameID) throw new Error("You must specify an ID.");
    if (!this.has(`mapObjects_${gameID}`)) false;
    
    this.delete(`snakeParts_${gameID}`);
    this.delete(`scoreboard_${gameID}`);
    this.delete(`mapObjects_${gameID}`);
    
    return true;
  }
  checkGameOptions(gameOptions, defaultOptions) {
    let result = {};
    
    Object.keys(defaultOptions).forEach((key) => {
      if (typeof gameOptions != "object") result = defaultOptions;
      else if (gameOptions.hasOwnProperty(key) && gameOptions[key].length != 0) result = gameOptions;
      else if (gameOptions.hasOwnProperty(key) && gameOptions[key].length == 0) result[key] = defaultOptions[key];
      else result[key] = defaultOptions[key];
    });
    
    return result;
  }
};
module.exports = discord_snakegame;