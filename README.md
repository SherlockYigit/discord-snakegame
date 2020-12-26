# discord-snakegame
It's easier to make a snake game now!
## Installation 
`npm install discord-snakegame`
## Usage
```js
// Default
let SnakeGame = require("discord-snakegame");
SnakeGame = new SnakeGame();

// Custom
let SnakeGame = require("discord-snakegame");
SnakeGame = new SnakeGame({ backg: "🟫", snake: "🟠", snakeTail: "🟡", apple: "🍎" });
```
### createGame(gameID)
Map creation function.
```js
<SnakeGame>.createGame("user_id")
```
### moveSnake(gameID, coordinats)
Snake steering function.
```js
<SnakeGame>.moveSnake("user_id", {
  x: 5, y: 9
});

/*
  Note: The range of x and y values is 0 - 9 
  (So you can write a maximum of 9 and a minimum of 0)
*/
```
### endGame(gameID)
Terminates the game.
```js
<SnakeGame>.endGame("user_id")
```
## Extras
* Since it includes maps, you can use [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) functions. 
* You can come to the [discord server](https://discord.gg/YdHRnsc) to get support.
* The name of the key where player scores are recorded is `scoreboard_userID`.
* The snake's coordinates can be accessed with the `snakeParts_userID` key.