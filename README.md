Hi I am Manuraj Singh Rathore (21BCE11519) and this is my task for Hitwicket.

# Getting Started

## Client side scripts :

```
npm i
npm start
```

## Server side script :

```
npm i
npm start
```

## Playing the Game:

- First enter the Room Name you want to join or create.
- If two players are already playing then you will enter as a Sepectator/Guest.
- The player A starts the Game.
- You will only see the input box for writing the command if its you turn.
- If you make a Invalid Move you will encounter a error and turn will not go to the opponent.

## Some Technicalities :

- If you have lost you connection or have refreshed the page, don't worry just go to the home page and join the room again.
- If you are the first one to join the room then you will be player A elsee player B.
- You can't move a dead character.

## Characters and Movement :

- There are three types of characters available:
- Pawn: Moves one block in any direction (Left, Right, Forward, or Backward). Move commands: L (Left), R (Right), F (Forward), B (Backward)
- Hero1: Moves two blocks straight in any direction. Kills any opponent's character in its path. Move commands: L (Left), R (Right), F (Forward), B (Backward)
- Hero2: Moves two blocks diagonally in any direction. Kills any opponent's character in its path. Move commands: FL (Forward-Left), FR (Forward-Right), BL (Backward-Left), BR (Backward-Right)
- All moves are relative to the player's perspective.
- Move command format: For Pawn and Hero1: <character_name>: (e.g., P1:L, H1:F) For Hero2: <character_name>: (e.g., H2:FL, H2:BR)
- Any difference in there rules, character name or move will result in error.`

## Demo images

- Updated in public folder in Client dir for reference.
