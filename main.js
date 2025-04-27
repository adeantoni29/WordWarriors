const promptPool = {
    easy: ["block", "slash", "roll", "jab"],
    medium: ["shield", "parry", "strike", "evade"],
    hard: ["counterattack", "reposition", "intercept", "lunge"],
    insane: ["disengagement", "retribution", "fortification", "circumvent"]
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
  
  // START GAME BUTTONS
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
  
  // START GAME LOGIC
  function startGame() {
    inputEl = document.getElementById("commandInput");
    inputEl.addEventListener("input", handleTyping);
  
    resetStage();
    inputEl.disabled = false;
    nextPrompt();
  }
  
  function resetStage() {
    document.getElementById("stageNumber").textContent = stage;
    document.getElementById("score").textContent = score;
  
    // Set up Player
    playerHP = 100;
    updateBars();
  
    // Set up Boss
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
  }
  
  function createEnemies() {
    const enemiesContainer = document.getElementById("enemies-container");
    enemiesContainer.innerHTML = "";
  
    enemies = [];
    const numberOfEnemies = Math.min(2 + Math.floor(stage / 2), 6); // grow enemies over time
  
    for (let i = 0; i < numberOfEnemies; i++) {
      const enemy = {
        id: `enemy${i}`,
        hp: stage >= 5 ? 2 : 1, // enemies get tougher after stage 5
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
    let difficulty = "easy";
    if (stage >= 4 && stage < 7) difficulty = "medium";
    else if (stage >= 7 && stage < 10) difficulty = "hard";
    else if (stage >= 10) difficulty = "insane";
  
    const pool = promptPool[difficulty];
    currentPrompt = pool[Math.floor(Math.random() * pool.length)];
  
    document.getElementById("promptText").textContent =
      `Type: "${currentPrompt}"`;
  
    document.getElementById("game-log").textContent = "";
    inputEl.value = "";
    inputEl.focus();
  
    timer = setTimeout(() => {
      handleFailure("Time's up!");
      enemyAttack();
    }, 5000);
  }
  
  function handleTyping() {
    const typed = inputEl.value.trim().toLowerCase();
  
    if (typed === currentPrompt) {
      clearTimeout(timer);
      attackEnemyOrBoss();
  
      inputEl.value = "";
      inputEl.disabled = false;
      nextPrompt();
    }
  }
  
  function attackEnemyOrBoss() {
    // Prioritize living enemies
    const target = enemies.find(e => e.hp > 0);
  
    if (target) {
      target.hp--;
      if (target.hp <= 0) {
        document.getElementById(`enemySprite_${enemies.indexOf(target)}`).src = "assets/avatar/enemy_hurt.png";
        document.getElementById(`enemyHealth_${enemies.indexOf(target)}`).style.width = "0%";
      } else {
        document.getElementById(`enemyHealth_${enemies.indexOf(target)}`).style.width = (target.hp * 50) + "%";
      }
    } else {
      // No living enemies left, attack boss
      boss.hp--;
      if (boss.hp <= 0) {
        document.getElementById("bossSprite").src = `assets/avatar/boss_${stage}_hurt.png`;
        document.getElementById("bossHealth").style.width = "0%";
        setTimeout(() => {
          stage++;
          resetStage();
        }, 3000); // pause before next stage
      } else {
        updateBossBar();
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
    playerHP -= 10;
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
    playerHP -= 15;
    if (playerHP <= 0) {
      document.getElementById("game-log").textContent = "You have been defeated!";
      inputEl.disabled = true;
    }
    updateBars();
  }
  
  function updateBars() {
    document.getElementById("playerHealth").style.width = playerHP + "%";
  }
  
  