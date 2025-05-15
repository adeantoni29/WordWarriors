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
    easy: ["todo", "todo"],
    medium: ["todo", "todo"],
    hard: ["todo", "todo"],
    insane: ["todo", "todo"]
  };

  const promptPoolUnlock3 = { // Wide Slash
    easy: ["todo", "todo"],
    medium: ["todo", "todo"],
    hard: ["todo", "todo"],
    insane: ["todo", "todo"]
  };

  const promptPoolUnlock4 = { // Ice Spell
    easy: ["todo", "todo"],
    medium: ["todo", "todo"],
    hard: ["todo", "todo"],
    insane: ["todo", "todo"]
  };

  const promptPoolUnlock5 = { // Agility Potion
    easy: ["todo", "todo"],
    medium: ["todo", "todo"],
    hard: ["todo", "todo"],
    insane: ["todo", "todo"]
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
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    startGame();
     
  const savedGameData = loadSavedGameData();
  if (savedGameData) {
    
    playerHP = savedGameData.playerHP;
    score = savedGameData.score;
    stage = savedGameData.stage;
    
    resetStage();
    render();
  } else {
    console.log("No saved game found");
  }
  }
  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime;
  }
  
  function loadGame() {
    document.getElementById("start-screen").style.display = "none";
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
    inputEl = document.getElementById("commandInput");
    inputEl.addEventListener("input", handleTyping);
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "z" || e.key === "Z") {
        isPaused ? resumeGame() : pauseGame();
      }
    });
  
    resetStage();
  }
  
  //  Pause / Resume 
  function pauseGame() {
    if (isPaused) return;
    isPaused = true;
  
    if (timer && timer.stop) {
      storedPromptTimer = timer;
      timer.stop();
    }
  
    inputEl.disabled = true;
    document.getElementById("pause-screen").style.display = "flex";
  }
  
  function resumeGame() {
    if (!isPaused) return;
    isPaused = false;
  
    if (storedPromptTimer && storedPromptTimer.start) {
      timer = storedPromptTimer;
      timer.start();
    }
  
    inputEl.disabled = false;
    inputEl.focus();
    document.getElementById("pause-screen").style.display = "none";
  }

  function exitGame(){
    document.getElementById("start-screen").style.display = "block";
    document.getElementById("game-container").style.display = "none";
    document.getElementById("pause-screen").style.display = "none";
    resetStage();
   
    if (!isPaused) return;
    isPaused = false;

  }
  
  // TODO perfect ability screen

  let currentStage = 1; // Start at stage 1

const abilities = [
    {
        message: "Healing Potion Activated!",
        image: "healing_potion.png", 
        description: "(insert description)."
    },
    {
        message: "Counter Attack Ready!",
        image: "counter_attack.png",
        description: "(insert description)."
    },
    {
        message: "Wide Slash Ready!",
        image: "wide_slash.png", 
        description: "(insert description)."
    },
    {
        message: "Ice spell Unlocked!", 
        image: "ice_spell.png",  
        description: "(insert description)."
    },
    {
        message: "Agility Potion Active!",
        image: "ice_spell.png",  
        description: "(insert description/ ice spell is in here until agiloty potion image is generated!)."
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
    const announcement = document.getElementById("stage-announcement");
    const countdownDisplay = document.getElementById("countdown-display"); // For visual countdown
    const gameContainer = document.getElementById("game-container");

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
            countdownDisplay.style.display = "none";
            announcement.style.display = "none";
            gameContainer.style.display = "block"; // Show the game container
            resetStage(); // Reset the stage for the next round
        }
    }, 1000); // Update every 1 second
}

  // Stage Setup 
  function resetStage() {
    document.getElementById("stageNumber").textContent = stage;
    document.getElementById("score").textContent = score;
  
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
      enemyDiv.appendChild(document.createElement("p")).innerText = `Enemy`;
  
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
    if (stage > 4 && playerTurn) {
      const poolUnlock4 = promptPoolUnlock4[difficulty];
      promptUnlock4 = poolUnlock4[Math.floor(Math.random() * poolUnlock4.length)];
      document.getElementById("promptText").innerHTML += `<br>Use an ice spell! Type: "${promptUnlock4}"`;
    }
    if (stage > 5 && playerTurn) {
      const poolUnlock5 = promptPoolUnlock5[difficulty];
      promptUnlock5 = poolUnlock5[Math.floor(Math.random() * poolUnlock5.length)];
      document.getElementById("promptText").innerHTML += `<br>Use an agility potion! Type: "${promptUnlock5}"`;
    }

    document.getElementById("game-log").textContent = "";
    inputEl.value = "";
    inputEl.disabled = false;
    inputEl.focus();
  
    const baseTime = 4000;
    const timePerCharacter = 300;
    const stageBonus = stage * 200;
    const totalTime = baseTime + currentPrompt.length * timePerCharacter + stageBonus;
  
    const barContainer = document.getElementById("promptTimerBarContainer");
    const timerBar = document.getElementById("promptTimerBar");
    barContainer.style.display = "block";
    timerBar.style.transition = "none";
    timerBar.style.width = "100%";
  
    if (timer && timer.stop) timer.stop();
  
    setTimeout(() => {
      timerBar.style.transition = `width ${totalTime}ms linear`;
    }, 50);
  
    timer = new PromptTimer(
      totalTime,
      () => {
        handleFailure("Time's up!");
        if (!playerTurn) enemyAttack();
        barContainer.style.display = "none";
      },
      (remaining) => {
        timerBar.style.width = `${remaining * 100}%`;
      }
    );
  
    timer.start();
  }
  
  //  Typing Handler
  function handleTyping() {
    if (isPaused) return;
  
    const typed = inputEl.value.trim().toLowerCase();
  
    if (typed === currentPrompt) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      if (playerTurn) {
        attackEnemyOrBoss();
      } else {
        nextPrompt();
      }
    }

    // Unlocked Abilities
    if (stage > 1 && playerTurn && typed === promptUnlock1) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      healingPotion();
    }
    if (stage > 2 && !playerTurn && typed === promptUnlock2) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      counterAttack();
    }
    if (stage > 3 && playerTurn && typed === promptUnlock3) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      wideSlash();
    }
    if (stage > 4 && playerTurn && typed === promptUnlock4) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      iceSpell();
    }
    if (stage > 5 && playerTurn && typed === promptUnlock5) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      agilityPotion();
    }
  }
  
  //  Attack Logic 
  function attackEnemyOrBoss() {
    const target = enemies.find(e => e.hp > 0);
  
    if (target) {
      target.hp--;
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
      boss.hp--;
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
  
    if (playerHP <= 0) {
      document.getElementById("game-log").textContent = "You have been defeated!";
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

  function counterAttack() { // Unlocked Ability 2
    // TODO: An attack that can be used during the dodge turn,
    // only does half the damage of a normal attack
  }

  function wideSlash() { // Unlocked Ability 3
    // TODO, an attack that damages all enemies on screen,
    // damage dealt is normal attack damage divided by the number of enemies
  }

  function iceSpell() { // Unlocked Ability 4
    // TODO, damage an enemy and stops them from attacking during the next dodge turn,
    // also does extra damage against Stage 5's boss
  }

  function agilityPotion() { // Unlocked Ability 5
    // TODO, doubles the time limit for each turn,
    // can only be used once
  }

  function updateBars() {
    document.getElementById("playerHealth").style.width = playerHP + "%";
  }
  
 
  
  
  