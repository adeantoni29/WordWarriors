# Word Warriors

## About
Word Warriors is a turn-based typing RPG I built where you're a knight battling your way through an evil fortress. To fight off enemies, you have to type the words or phrases that pop up before the timer runs out. Each stage gets harder with faster timers and tougher prompts. There are at least five stages, each with a boss fight at the end.

## Installation
1. Make sure Git is installed.
2. Clone this repo:
   ```bash
   git clone https://github.com/adeantoni29/WordWarriors.git
   ```
3. Open the folder in your IDE.
4. Launch `index.html` in your browser — no server or extra setup needed.

## Usage
Play it right in your browser: [Play Word Warriors](https://adeantoni29.github.io/WordWarriors/)

To play:
- Use a keyboard (desktop/laptop is best).
- When it's your turn, type the attack prompt to damage enemies.
- When it's the enemy’s turn, type the defense prompt to avoid damage.
- If you type wrong or run out of time, you take a hit.
- Beat all the enemies and the boss to move on to the next stage.

## Testing

Right now, we are manually testing Word Warriors by running the game locally and verifying how things behave during gameplay. Here's how we check everything's working:

### Combat Tests
- **Block & Dodge Timing:**  
  Start a new game and wait for an enemy to attack.  
  Type a defense prompt like "block" or "roll" before the timer runs out.  
  Should take little or no damage.

- **Incorrect Defense:**  
  Let the timer run out or type the wrong thing.  
  Should take full damage.

- **Correct Attack Input:**  
  On your turn, type an attack word like "jab" or "counterattack" correctly.  
  Enemy takes damage, health bar updates.

- **Wrong Attack Input:**  
  Type something random or incorrect.  
  Nothing happens, move is skipped, timer expires.

### Timer Functionality
- **Countdown Reset:**  
  Timer should reset and restart every time a new prompt appears.  
  Each phrase starts with a full timer bar.

- **Early Success Cancels Timer:**  
  Typing the correct word before time’s up should stop the timer.  
  Timer bar disappears, next prompt starts immediately.

- **Failure Timeout:**  
  If nothing is typed in time, the player takes damage (or the enemy gets a free hit).  
  Timer bar fades and message shows.

### Stage Progression
- **Enemies First, Then Boss:**  
  Boss shouldn't be beatable until all enemies are down.  
  Game logic holds that flow.

- **Stage Advance Message:**  
  After the boss dies, a message like "Get ready for Stage 2!" should appear.  
  Brief pause, then next stage loads.

- **Boss Animations:**  
  Boss sprite changes to `hurt.png` when defeated.  
  Image updates correctly.

### General Game Flow
- Health bars update with every hit  
- Score increases when the player attacks successfully  
- Input box is re-enabled after each turn  
- Game ends if player health drops to 0

## Features
- Real-time typing with turn-based gameplay
- Bosses and enemies get harder each stage
- Randomized prompt pools by difficulty
- Visual health bars and timer bar
- Efficient timer using `requestAnimationFrame`

## Future Plans
- Unlockable abilities after boss fights
- Add sound and visual effects
- Typing accuracy tracker
- Save/load system

## Authors
- Asia Yang  
- Axton De Antoni  
- Connor Robbins