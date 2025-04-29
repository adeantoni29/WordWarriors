# WordWarriors

## About
Word Warriors is a turn-based RPG with typing-based mechanics. The player is a lone knight invading an evil fortress infested with supernatural creatures. To defeat enemies, players will choose moves and abilities based on the words or sentences presented in the stage to type. There will be at least five stages for the player to beat, each stage increasing in difficulty.

## Installation
    1. Install Git and Git Bash
    2. Clone Word Warriors repository
    3. Acquire a web browser to play Word Warriors
    4. Run Word Warriors on local server through preferred IDE
    
## Testing
Right now WordWarriors is tested manually by running the game locally and checking if everything works the way it’s supposed to. Here's how testing is being done:

Combat and Reaction Checks
Start a new game.

Wait for an enemy to attack.

Type a correct block command (like "block") when prompted.

What should happen: The player blocks and takes little or no damage.

Let the enemy attack again.

Type a dodge command (like "roll") in time.

What should happen: The player dodges completely and avoids taking any damage.

Try typing something wrong during an attack window.

What should happen: The player fails to defend and takes full damage.

Stage Progression Testing
Play through a full stage.

Make sure all enemies are defeated before the boss is defeated.

Beat the boss only after clearing the enemies.

What should happen: After the boss and all enemies are defeated, the game shows the "Get ready for Stage #!" announcement.

Move through multiple stages.

What should happen: New enemies show up and bosses get harder as stages increase.

Boss animations (idle, attack, hurt) should update correctly at each stage.

Ability and Prompt Checks
Type in different combat commands from the prompt (like "jab", "counterattack", etc.).

What should happen: Correct typing triggers the right action instantly.

Type in wrong commands or random words.

What should happen: The game recognizes it as a failed action and the player gets hit.

Watch the timer bar during prompts.

What should happen: The timer bar shrinks down and disappears when time runs out.

General Gameplay Flow
Check that enemy health bars update when enemies are attacked.

Make sure after enemies are defeated, they stay hurt while fighting the boss.

Watch that the score updates correctly every time an attack is successful.

After each prompt, the typing input should re-enable for the next one.

## Usage
To play WordWarriors, user will need to clone the repository and run the project in their preferred development environment. 
The game is designed for a desktop/laptop use with a keyboard. The game relies on typing based input. 

Use this link to access Word Warriors: https://adeantoni29.github.io/WordWarriors/

During Game play:
- Type the prompts or commands to attack, block, or dodge to controll how your character reacts during combat.
- Respond withing a 1-3 second window to enemy attacks with the correct spelling of the prompt or command to defend yourself.
- Progress through the stages by defeating the inital wave of enemys and the stage specific boss.
- After each boss is defeated, you will unlock a new ability that will be required to defeat specific enemies within later stages in the game.

This game puts emphasis on fast typing, acuurate command recognition, and a strategic use of the unlocked abilities.


## Authors
Asia Yang
Axton De Antoni
Connor Robbins