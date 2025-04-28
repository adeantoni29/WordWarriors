const promptPoolAttack = {
    easy: ["slash", "jab"],
    medium: ["parry", "strike"],
    hard: ["counterattack", "intercept"],
    insane: ["disengagement", "retribution"]
  };
  const promptPoolDefend = {
    easy: ["block", "roll"],
    medium: ["shield", "evade"],
    hard: ["reposition", "lunge"],
    insane: ["fortification", "circumvent"]
  };
  
  let currentPrompt = "";
  let timer = null;
  let inputEl = null;
  let stage = 1;
  let turns = 0;
  let score = 0;
  let playerHP = 100;
  let enemies = [];
  let boss = null;
  let playerTurn = false;
  
  // Start New Game or Load Game
  function newGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    startGame();
  }
  
  function loadGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    startGame();
  }
  
  // Start Game
  function startGame() {
    inputEl = document.getElementById("commandInput");
    inputEl.addEventListener("input", handleTyping);
  
    resetStage();
  }
  
  function resetStage() {
    document.getElementById("stageNumber").textContent = stage;
    document.getElementById("score").textContent = score;
  
    // Reset Player
    playerHP = 100;
    updateBars();
  
    // Set Boss
    const bossSprite = `assets/avatar/boss_${stage}_idle.png`;
    document.getElementById("bossSprite").src = bossSprite;
    document.getElementById("bossLabel").textContent = `Boss ${stage}`;
    boss = {
      hp: stage + 1,
      maxHp: stage + 1
    };
    updateBossBar();
  
    // Create Enemies
    createEnemies();
  
    // Enable typing and show next prompt
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
  
  function nextPrompt() {
    if (playerTurn == false) { // Alternate between player and enemy turns.
      playerTurn = true;
    } else {
      playerTurn = false;
    }

    let difficulty = "easy";
    if (stage >= 4 && stage < 7) difficulty = "medium";
    else if (stage >= 7 && stage < 10) difficulty = "hard";
    else if (stage >= 10) difficulty = "insane";
  
    const attackPool = promptPoolAttack[difficulty];
    const defendPool = promptPoolDefend[difficulty];

    if (playerTurn == false) {
      currentPrompt = defendPool[Math.floor(Math.random() * defendPool.length)];
      document.getElementById("promptText").textContent =
      `Defend yourself! Type: "${currentPrompt}"`;
    } else {
      currentPrompt = attackPool[Math.floor(Math.random() * attackPool.length)];
      document.getElementById("promptText").textContent =
      `Fight the enemy! Type: "${currentPrompt}"`;
    }
  
    document.getElementById("game-log").textContent = "";
    inputEl.value = "";
    inputEl.focus();
  
    // Dynamic Timer
    let baseTime = 4000; // 4 seconds base
    let timePerCharacter = 300; // +300ms per character
    let stageBonus = stage * 200; // +200ms per stage
  
    let totalTime = baseTime + (currentPrompt.length * timePerCharacter) + stageBonus;
  
    // Setup visual timer bar
    const barContainer = document.getElementById("promptTimerBarContainer");
    const timerBar = document.getElementById("promptTimerBar");
    barContainer.style.display = "block";
    timerBar.style.transition = `none`;
    timerBar.style.width = "100%";
  
    setTimeout(() => {
      timerBar.style.transition = `width ${totalTime}ms linear`;
      timerBar.style.width = "0%";
    }, 50);
  
    timer = setTimeout(() => {
      handleFailure("Time's up!");
      enemyAttack();
      barContainer.style.display = "none";
    }, totalTime);
  }
  
  function handleTyping() {
    const typed = inputEl.value.trim().toLowerCase();
  
    if (typed === currentPrompt) {
      clearTimeout(timer);
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      if (playerTurn == true) { // Only attack if it's the player's turn.
        attackEnemyOrBoss();
      } else {
        nextPrompt();
      }
    }
  }
  
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
  
  function handleFailure(message) {
    inputEl.disabled = true;
    document.getElementById("game-log").textContent = message;

    if (playerTurn == false) { // Only take damage if it's the enemy's turn.
      playerHP -= 10;
    }

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
    if (playerTurn == false) { // Only take damage if it's the enemy's turn.
      playerHP -= 15;
    }
    if (playerHP <= 0) {
      document.getElementById("game-log").textContent = "You have been defeated!";
      inputEl.disabled = true;
    }
    updateBars();
  }
  
  function updateBars() {
    document.getElementById("playerHealth").style.width = playerHP + "%";
  }
  
  // Stage Announcement
  function showStageAnnouncement() {
    const announcement = document.getElementById("stage-announcement");
    const gameContainer = document.getElementById("game-container");
  
    gameContainer.style.display = "none";
    announcement.textContent = `Get ready for Stage ${stage}!`;
    announcement.style.display = "block";
  
    setTimeout(() => {
      announcement.style.display = "none";
      gameContainer.style.display = "block";
      resetStage();
    }, 3000);
  }
  
  