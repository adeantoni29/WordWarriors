// Save game data to localStorage
function loadSavedGameData() {
    const savedData = localStorage.getItem('savedGame');
    if (savedData) {
        return JSON.parse(savedData); // Return parsed saved game data
    }
    return null; // Return null if no saved data exists
}

// Save game data to localStorage
function saveGameData() {
    const gameData = {
        playerHP: playerHP,
        score: score,
        stage: stage
    };
    localStorage.setItem('savedGame', JSON.stringify(gameData)); // Save as string
}

function saveGameToFile() {
    const gameData = {
        playerHP: playerHP,
        score: score,
        stage: stage
    };

    let fileName = prompt("Save your progress?", "saved_game.json");
    if (!fileName) return; // If canceled, don't save

    const blob = new Blob([JSON.stringify(gameData, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName; // Use the custom filename
    a.click();
}
function enableLoadButton(event) {
    const file = event.target.files[0]; 
    const loadButton = document.getElementById("loadGameButton");

    if (file) {
        loadButton.style.opacity = "1"; // Make it fully visible
        loadButton.style.pointerEvents = "auto"; // Allow clicking
        loadButton.disabled = false; // Enable the button
    } else {
        loadButton.style.opacity = "0.5"; // Keep it faded
        loadButton.style.pointerEvents = "none"; // Prevent interaction
        loadButton.disabled = true;
    }
}
function loadGameFromFile(event) {
    if (!inputEl) inputEl = document.getElementById("commandInput");
    const fileInput = document.getElementById("loadGameFile");
    const file = fileInput.files[0];
    if (!file) return; // Prevent loading if no file is selected

    const reader = new FileReader();
    reader.onload = function(e) {
        const loadedData = JSON.parse(e.target.result);
        playerHP = loadedData.playerHP;
        score = loadedData.score;
        stage = loadedData.stage;

        resetStage();
        document.getElementById("start-screen").style.display = "none";
        document.getElementById("game-container").style.display = "block";
        console.log("Game loaded successfully!");
    };
    reader.readAsText(file);
}
  const promptPoolAttack = { // Basic Attack
    easy: ["slash", "jab"],
    medium: ["parry", "strike"],
    hard: ["assault", "intercept"],
    insane: ["disengagement", "retribution"]
  };
  
  const promptPoolDefend = { // Basic Defend
    easy: ["block", "roll"],
    medium: ["shield", "evade"],
    hard: ["reposition", "lunge"],
    insane: ["fortification", "circumvent"]
  };

  const promptPoolUnlock1 = { // Healing Potion
    easy: ["heal", "mend"],
    medium: ["repair", "recover"],
    hard: ["replenish", "regenerate"],
    insane: ["rejuvenate", "revitalize"]
  };

  const promptPoolUnlock2 = { // Counterattack
    easy: ["retort", "rebut"],
    medium: ["thrust", "disarm"],
    hard: ["quell", "rebuke"],
    insane: ["repel", "obliterate"]
  };

  const promptPoolUnlock3 = { // Wide Slash
    easy: ["swipe", "carve"],
    medium: ["hack", "slice"],
    hard: ["flay", "bisect"],
    insane: ["eradicate", "rupture"]
  };

  const promptPoolUnlock4 = { // Ice Spell
    easy: ["cool", "encase"],
    medium: ["solidify", "freeze"],
    hard: ["glaciate", "subzero"],
    insane: ["immobilize", "frostbite"]
  };

  const promptPoolUnlock5 = { // Agility Potion
    easy: ["hasten", "leap"],
    medium: ["phase", "warp"],
    hard: ["glide", "surpass"],
    insane: ["evanesce", "maneuver"]
  };

  const bossNames = ["Korgath", "SkullDoom", "Frost Fang", "Vexmorra the Serpent Queen", "Blaze Fiend", "Lord Shadowbane", "Skarnath Hellborn"];
  
  let currentPrompt = "";
  let promptUnlock1 = "";
  let promptUnlock2 = "";
  let promptUnlock3 = "";
  let promptUnlock4 = "";
  let promptUnlock5 = "";
  let timer = null;
  let storedPromptTimer = null;
  let inputEl = null;
  let stage = 1;
  let turns = 0;
  let score = 0;
  let playerHP = 100;
  let enemies = [];
  let boss = null;
  let playerTurn = false;
  let isPaused = false;
  let iceSpellUsed = false;
  let agilityUsed = false;
  let timerBar = null;
  let totalTime = 0;
  let timerStartTime = 0;
  let remainingTime = 0;
  
  let now,dt,
    last = timestamp()
  
  //  Timer Class 
  class PromptTimer {
    constructor(durationMs, onExpire, onProgress) {
      this.duration = durationMs;
      this.onExpire = onExpire;
      this.onProgress = onProgress;
      this.startTime = null;
      this.frameId = null;
      this.running = false;
    }
  
    start() {
      this.running = true;
      this.startTime = performance.now();
      this.tick();
    }
  
    tick = () => {
      if (!this.running) return;
      const now = performance.now();
      const elapsed = now - this.startTime;
      const progress = Math.min(elapsed / this.duration, 1);
  
      if (this.onProgress) {
        this.onProgress(1 - progress);
      }
  
      if (elapsed >= this.duration) {
        this.running = false;
        this.onExpire?.();
      } else {
        this.frameId = requestAnimationFrame(this.tick);
      }
    }
  
    stop() {
      if (this.frameId) cancelAnimationFrame(this.frameId);
      this.running = false;
    }
  }
  
  //  Game Start 
  function newGame() {
    document.getElementById("game-title").style.display = "none";
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    startGame();
  }
  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime;
  }
  
  function loadGame() {
    document.getElementById("game-title").style.display = "none";
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("defeated-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    update();
    render();
    requestAnimationFrame(frame);
    resetStage();

  }

  function frame() {
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
      while(dt > step) {
        dt = dt - step;
        update(dt);
      }
    render(dt);
    last = now;
    requestAnimationFrame(frame);
  }
  
  function startGame() {
    stage = 1;

    playerHP = 100;
    updateBars();
    resetStage();
  }

  function startTimer() {
    if (timer) clearInterval(timer);

    timer = setInterval(() => {
        let elapsed = Date.now() - timerStartTime;
        let timeLeft = remainingTime - elapsed;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleFailure("Time's up!");
            if (!playerTurn && boss.hp > 0) enemyAttack();
            document.getElementById("promptTimerBarContainer").style.display = "none";
        }
    }, 100);
  }

  //  Pause / Resume 
  function pauseGame() {
      if (isPaused || !timer) return;
      isPaused = true;

      clearInterval(timer);

      remainingTime -= Date.now() - timerStartTime;

      inputEl.disabled = true;
      document.getElementById("pause-screen").style.display = "flex";

      timerBar.style.transition = "none";
      timerBar.style.width = ((remainingTime / totalTime) * 100) + "%";
  }

  function resumeGame() {
      if (!isPaused) return;
      isPaused = false;

      inputEl.disabled = false;
      document.getElementById("pause-screen").style.display = "none";
    
      timerStartTime = Date.now();
      startTimer();

      timerBar.style.transition = "width " + remainingTime + "ms linear";
      timerBar.style.width = "0%";
  }

  function exitGame(){
    document.getElementById("game-title").style.display = "block";
    document.getElementById("start-screen").style.display = "block";
    document.getElementById("game-container").style.display = "none";
    document.getElementById("pause-screen").style.display = "none";
   
    if (!isPaused) return;
    isPaused = false;

  }
  
  // TODO perfect ability screen

  let currentStage = 1; // Start at stage 1

const abilities = [
    {
        message: "Healing Potion Unlocked!",
        image: "assets/images/healing_potion.png", 
        description: "The healing potion restores 1/10 of your health when used."
    },
    {
        message: "Counter Attack Unlocked!",
        image: "assets/images/counter_attack.png",
        description: "Allows you to strike foes with a light attack during your defense phase."
    },
    {
        message: "Wide Slash Unlocked!",
        image: "assets/images/wide_slash.png", 
        description: "A wide slash that deals damage to every foe on-screen, damage depends on how many foes there are."
    },
    {
        message: "Ice spell Unlocked!", 
        image: "assets/images/ice_spell.png",  
        description: "Cast a spell to freeze your foes, damaging them, and allowing you to use another attack before entering your defense phase."
    },
    {
        message: "Agility Potion Unlocked!",
        image: "assets/images/agility_potion.png",  
        description: "A potion that increases your reflexes, slowing the prompt timer down for the rest of the stage."
    }
];

function showAbilityAnnouncement() {
    const announcement = document.getElementById("ability-announcement");
    const abilityImage = document.getElementById("ability-image");
    const abilityDescription = document.getElementById("ability-description");
    const announcementScreen = document.getElementById("ability-announcement-screen");

    // Get the ability for the current stage
    const ability = abilities[currentStage - 1];

    // Update the announcement message
    announcement.textContent = ability.message;
    abilityImage.src = ability.image; // Set the image source
    abilityDescription.textContent = ability.description;

    // Show hidden elements
    abilityImage.style.display = "inline-block";
    abilityDescription.style.display = "block"
    // Make the ability screen visible
    announcementScreen.style.display = "block"; // Show the ability announcement screen
}

// Move to the next stage when the "Next Stage" button is clicked
function nextStage() {
    if (currentStage < abilities.length) {
        currentStage++; // Increase the stage number for the next ability
        showStageAnnouncement(); // Show the next ability's announcement
    }
}

// Function to show the stage announcement after defeating a boss
function showStageAnnouncement() {
    const screen = document.getElementById("ability-announcement-screen");
    const announcement = document.getElementById("stage-announcement");
    const countdownDisplay = document.getElementById("countdown-display"); // For visual countdown
    const gameContainer = document.getElementById("game-container");

    screen.style.display = "block";
    gameContainer.style.display = "none"; // Hide game container
    announcement.textContent = `Get ready for Stage ${stage}!`; // Announce the new stage
    announcement.style.display = "block"; // Show the stage announcement
    countdownDisplay.style.display = "block"; // Show countdown timer

    let countdown = 3; // Start countdown from 3 seconds

    // Update the countdown display every second
    const countdownInterval = setInterval(() => {
        countdownDisplay.textContent = countdown; // Display the countdown number
        countdown--; // Decrease countdown by 1
        if (countdown < 0) {
            clearInterval(countdownInterval); // Stop the countdown when it reaches 0
            // Hide the countdown and proceed to the next stage
            screen.style.display = "none";
            countdownDisplay.style.display = "none";
            announcement.style.display = "none";
            gameContainer.style.display = "block"; // Show the game container
            resetStage(); // Reset the stage for the next round
        }
    }, 1000); // Update every 1 second
}

  // Stage Setup 
  function resetStage() {
    document.getElementById("game-title").style.display = "none";
    document.getElementById("defeated-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("stageNumber").textContent = stage;
    document.getElementById("score").textContent = score;
  
    inputEl = document.getElementById("commandInput");
    inputEl.addEventListener("input", handleTyping);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        isPaused ? resumeGame() : pauseGame();
    }
    });

    iceSpellUsed = false;
    document.getElementById("bossSprite").classList.remove("frozen");
    agilityUsed = false;

    //dont reset player health
    //playerHP = 100;
    updateBars();
  
    const bossSprite = `assets/avatar/boss_${stage}_idle.png`;
    document.getElementById("bossSprite").src = bossSprite;
    document.getElementById("bossLabel").textContent = `${bossNames[stage-1]}`;
    boss = {
      hp: stage + 1,
      maxHp: stage + 1
    };
    updateBossBar();
    createEnemies();
  
    inputEl.disabled = false;
    nextPrompt();
  }
  function createEnemies() {
    const enemiesContainer = document.getElementById("enemies-container");
    enemiesContainer.innerHTML = "";
  
    enemies = [];
    const numberOfEnemies = Math.min(2 + Math.floor(stage / 2), 6);
  
    for (let i = 0; i < numberOfEnemies; i++) {
      const enemy = {
        id: `enemy${i}`,
        hp: stage,
        element: null
      };
  
      const enemyDiv = document.createElement("div");
      enemyDiv.classList.add("character");
  
      const img = document.createElement("img");
      img.src = "assets/avatar/enemy_idle.png";
      img.width = 80;
      img.classList.add("enemySprite");
      img.id = `enemySprite_${i}`;
  
      const healthContainer = document.createElement("div");
      healthContainer.classList.add("bar-container");
      healthContainer.style.width = "80px";
  
      const healthBar = document.createElement("div");
      healthBar.classList.add("health-bar", "enemy-bar");
      healthBar.style.width = "100%";
      healthBar.id = `enemyHealth_${i}`;
  
      healthContainer.appendChild(healthBar);
      enemyDiv.appendChild(img);
      enemyDiv.appendChild(healthContainer);
      enemyDiv.appendChild(document.createElement("p")).innerText = `Skeleton Minion`;
  
      enemiesContainer.appendChild(enemyDiv);
      enemy.element = enemyDiv;
      enemies.push(enemy);
    }
  }
  
  // Prompt Logic 
  function nextPrompt() {
    if (isPaused) return;
  
    playerTurn = !playerTurn;
  
    let difficulty = "easy";
    if (stage >= 4 && stage < 7) difficulty = "medium";
    else if (stage >= 7 && stage < 10) difficulty = "hard";
    else if (stage >= 10) difficulty = "insane";
  
    if (!playerTurn && iceSpellUsed) {
      iceWearOff();
    }

    const pool = playerTurn ? promptPoolAttack[difficulty] : promptPoolDefend[difficulty];
    currentPrompt = pool[Math.floor(Math.random() * pool.length)];
  
    document.getElementById("promptText").textContent = playerTurn
      ? `Fight the enemy! Type: "${currentPrompt}"`
      : `Defend yourself! Type: "${currentPrompt}"`;

    // Unlocked Abilities
    if (stage > 1 && playerTurn) {
      const poolUnlock1 = promptPoolUnlock1[difficulty];
      promptUnlock1 = poolUnlock1[Math.floor(Math.random() * poolUnlock1.length)];
      document.getElementById("promptText").innerHTML += `<br>Use a healing potion! Type: "${promptUnlock1}"`;
    }
    if (stage > 2 && !playerTurn) {
      const poolUnlock2 = promptPoolUnlock2[difficulty];
      promptUnlock2 = poolUnlock2[Math.floor(Math.random() * poolUnlock2.length)];
      document.getElementById("promptText").innerHTML += `<br>Counter the enemy's attack! Type: "${promptUnlock2}"`;
    }
    if (stage > 3 && playerTurn) {
      const poolUnlock3 = promptPoolUnlock3[difficulty];
      promptUnlock3 = poolUnlock3[Math.floor(Math.random() * poolUnlock3.length)];
      document.getElementById("promptText").innerHTML += `<br>Use a wide slash! Type: "${promptUnlock3}"`;
    }
    if (stage > 4 && playerTurn && !iceSpellUsed) {
      const poolUnlock4 = promptPoolUnlock4[difficulty];
      promptUnlock4 = poolUnlock4[Math.floor(Math.random() * poolUnlock4.length)];
      document.getElementById("promptText").innerHTML += `<br>Use an ice spell! Type: "${promptUnlock4}"`;
    }
    if (stage > 5 && playerTurn && !agilityUsed) {
      const poolUnlock5 = promptPoolUnlock5[difficulty];
      promptUnlock5 = poolUnlock5[Math.floor(Math.random() * poolUnlock5.length)];
      document.getElementById("promptText").innerHTML += `<br>Use an agility potion! Type: "${promptUnlock5}"`;
    }

    document.getElementById("game-log").textContent = "";
    inputEl.value = "";
    inputEl.disabled = false;
    inputEl.focus();
  
    if (timer) {
        clearTimeout(timer);
    }

    const baseTime = 4000;
    const timePerCharacter = 300;
    const stageBonus = stage * 200;
    totalTime = baseTime + (currentPrompt.length * timePerCharacter) - stageBonus;
    if (agilityUsed) totalTime = totalTime * 2;

    timerStartTime = Date.now();
    remainingTime = totalTime; 

    const barContainer = document.getElementById("promptTimerBarContainer");
    timerBar = document.getElementById("promptTimerBar");
    barContainer.style.display = "block";
    timerBar.style.transition = "none";
    timerBar.style.width = "100%";
  
    setTimeout(() => {
      timerBar.style.transition = `width ${totalTime}ms linear`;
      timerBar.style.width = "0%";
    }, 50);

    startTimer();
  }
  reversePower();

  //  Typing Handler
  function handleTyping() {
    if (isPaused) return;
  
    const typed = inputEl.value.trim().toLowerCase();
  
    if (typed === currentPrompt) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      score += 1;
      document.getElementById("score").textContent = score;
      if (playerTurn) {
        attackEnemyOrBoss(1);
      
      document.getElementById("playerSprite").src = `assets/avatar/player_attack.png`;
      setTimeout(() => {
        document.getElementById("playerSprite").src = `assets/avatar/player_idle.png`;
      }, 500);
      } else {
        nextPrompt();
      }
    }

    // Unlocked Abilities
    if (stage > 1 && playerTurn && typed === promptUnlock1) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      score += 1;
      document.getElementById("score").textContent = score;
      healingPotion();
    }
    if (stage > 2 && !playerTurn && typed === promptUnlock2) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      score += 1;
      document.getElementById("score").textContent = score;
      attackEnemyOrBoss(0.5);
      
      document.getElementById("playerSprite").src = `assets/avatar/player_attack.png`;
      setTimeout(() => {
        document.getElementById("playerSprite").src = `assets/avatar/player_idle.png`;
      }, 500);
    }
    if (stage > 3 && playerTurn && typed === promptUnlock3) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      score += 1;
      document.getElementById("score").textContent = score;
      wideSlash();
      
      document.getElementById("playerSprite").src = `assets/avatar/player_attack.png`;
      setTimeout(() => {
        document.getElementById("playerSprite").src = `assets/avatar/player_idle.png`;
      }, 500);
    }
    if (stage > 4 && playerTurn && typed === promptUnlock4 && !iceSpellUsed) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      score += 1;
      document.getElementById("score").textContent = score;
      iceSpell();
      
      document.getElementById("playerSprite").src = `assets/avatar/player_attack.png`;
      setTimeout(() => {
        document.getElementById("playerSprite").src = `assets/avatar/player_idle.png`;
      }, 500);
    }
    if (stage > 5 && playerTurn && typed === promptUnlock5 && !agilityUsed) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      score += 1;
      document.getElementById("score").textContent = score;
      agilityUsed = true;
      nextPrompt();
    }
  }
  
  //  Attack Logic 
  function attackEnemyOrBoss(damage) {
    const target = enemies.find(e => e.hp > 0);
  
    if (target) {
      target.hp -= damage;
      const enemyIndex = enemies.indexOf(target);
  
      if (target.hp <= 0) {
        document.getElementById(`enemySprite_${enemyIndex}`).src = "assets/avatar/enemy_hurt.png";
        document.getElementById(`enemyHealth_${enemyIndex}`).style.width = "0%";
      } else {
        const widthPercent = (target.hp / stage) * 100;
        document.getElementById(`enemyHealth_${enemyIndex}`).style.width = `${widthPercent}%`;
      }
  
      inputEl.value = "";
      inputEl.disabled = false;
      nextPrompt();
    } else {
      boss.hp -= damage;
      if (boss.hp <= 0) {
        document.getElementById("bossSprite").src = `assets/avatar/boss_${stage}_hurt.png`;
        document.getElementById("bossHealth").style.width = "0%";
  
        setTimeout(() => {
          stage++;
          showStageAnnouncement();
        }, 1000);
      } else {
        updateBossBar();
        inputEl.value = "";
        inputEl.disabled = false;
        nextPrompt();
      }
    }
  }
  
  function updateBossBar() {
    const percentage = (boss.hp / boss.maxHp) * 100;
    document.getElementById("bossHealth").style.width = `${percentage}%`;
  }
  
  // Failure / Damage 
  function handleFailure(message) {
    inputEl.disabled = true;
    document.getElementById("game-log").textContent = message;
  
    if (!playerTurn) playerHP -= 10;
  
    if (playerHP <= 0) {
      document.getElementById("game-container").style.display = "none";
      document.getElementById("defeated-screen").style.display = "block";
      document.getElementById("game-log").textContent = "You have been defeated!";
      inputEl.removeEventListener("input", handleTyping);
    } else {
      updateBars();
      setTimeout(() => {
        inputEl.disabled = false;
        nextPrompt();
      }, 1000);
    }
  }
  
  function enemyAttack() {
    if (!playerTurn) playerHP -= 15;
  
    const target = enemies.find(e => e.hp > 0);
    if (target) {
      const enemyIndex = enemies.indexOf(target);
      document.getElementById(`enemySprite_${enemyIndex}`).src = "assets/avatar/enemy_attack.png";
      setTimeout(() => {
        document.getElementById(`enemySprite_${enemyIndex}`).src = "assets/avatar/enemy_idle.png";
      }, 500);
    } else {
      document.getElementById("bossSprite").src = `assets/avatar/boss_${stage}_attack.png`;
      setTimeout(() => {
        document.getElementById("bossSprite").src = `assets/avatar/boss_${stage}_idle.png`;
      }, 500);
    }

    if (playerHP <= 0) {
      showDefeatedScreen();
      // document.getElementById("game-log").textContent = "You have been defeated!";
      inputEl.disabled = true;
    }
    updateBars();
  }
  
  function healingPotion() { // Unlocked Ability 1
    playerHP += 10;
  
    if (playerHP > 100) {
      playerHP = 100;
    }
    updateBars();
    nextPrompt();
  }

  function wideSlash() { // Unlocked Ability 3
    const targets = enemies.filter(e => e.hp > 0);
    let damagePerEnemy = (1 / (targets.length + 1)).toFixed(2);

    for (let i = 0; i < targets.length; i++) {
      targets[i].hp -= damagePerEnemy;
      const enemyIndex = enemies.indexOf(targets[i]);
  
      if (targets[i].hp <= 0) {
        document.getElementById(`enemySprite_${enemyIndex}`).src = "assets/avatar/enemy_hurt.png";
        document.getElementById(`enemyHealth_${enemyIndex}`).style.width = "0%";
      } else {
        const widthPercent = (targets[i].hp / stage) * 100;
        document.getElementById(`enemyHealth_${enemyIndex}`).style.width = `${widthPercent}%`;
      }
    }

    boss.hp -= damagePerEnemy;
    if (boss.hp <= 0) {
      document.getElementById("bossSprite").src = `assets/avatar/boss_${stage}_hurt.png`;
      document.getElementById("bossHealth").style.width = "0%";
  
      setTimeout(() => {
        stage++;
        showStageAnnouncement();
      }, 1000);
    } else {
      updateBossBar();
      inputEl.value = "";
      inputEl.disabled = false;
      nextPrompt();
    }
  }

  function iceSpell() { // Unlocked Ability 4
    iceSpellUsed = true;
    playerTurn = false;

    const target = enemies.find(e => e.hp > 0);
    if (target) {
      const enemyIndex = enemies.indexOf(target);
      document.getElementById(`enemySprite_${enemyIndex}`).classList.add("frozen");
      attackEnemyOrBoss(0.5);
    } else {
      document.getElementById("bossSprite").classList.add("frozen");
      if (stage === 5) {
        attackEnemyOrBoss(2);
      } else {
        attackEnemyOrBoss(0.5);
      }
    }
  }

  function iceWearOff() { // Remove Ice Effect
    iceSpellUsed = false;

    const target = enemies.find(e => e.hp > 0);
    if (target) {
      const enemyIndex = enemies.indexOf(target);
      document.getElementById(`enemySprite_${enemyIndex}`).classList.remove("frozen");
    } else {
      document.getElementById("bossSprite").classList.remove("frozen");
    }
  }

  function updateBars() {
    document.getElementById("playerHealth").style.width = playerHP + "%";
  }

  function showDefeatedScreen() {
    let defeat = document.getElementById("game-log").textContent;
    if (defeat == "You have been defeated") {
      document.getElementById("defeated-screen").style.display = "block";
      document.getElementById("game-log").textContent = "You have been defeated!";
    }
  }
  //////////////////////// BOSS 4 ABILITY ///////////////////////////////////////
  function blindPower() {
    // let bossSprite = document.getElementById("bossSprite").src;

    let aliveEnemies = enemies.filter(e => e.hp > 0);
      
    if (stage == 4 && aliveEnemies.length === 0) {
      document.getElementById("promptText").style.filter = "blur(7px)";
      document.getElementById("promptText").style.transition = "filter .5s ease-out";

      setTimeout(() => {
        document.getElementById("promptText").style.filter = "none";
      }, 7500);

      randomInterval = Math.floor(Math.random() * (8000) + 8000);
      setTimeout(blindPower, randomInterval);
    }
  }
  setInterval(() => {
    let aliveEnemies = enemies.filter(e => e.hp > 0);
    // let boss = enemies.find(e => e.type === "boss");
    if (aliveEnemies.length === 0) {
      blindPower();
    }
  }, 3000);
//////////////////////// BOSS 5 ABILITY ///////////////////////////////////////
  // function reversePower() {
  //   // let aliveEnemies = enemies.filter(e => e.hp > 0);
  //   // && aliveEnemies.length === 0
  //   if (stage == 1 ) {
  //     let reverseWord = document.getElementById("promptText");
  //     if (!reverseWord) {
  //       console.error("Element with ID 'promptText' not found!");
  //       return;
  //     }
  //     let newWord = reverseWord.textContent;
  //     reverseWord.textContent = newWord.split('').reverse().join('');

  //     console.log(reverseWord.textContent); // Output: "ssob"
  //   }
  // }




  

  
 
  
  
  