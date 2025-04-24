const promptPool = {
    easy: [
      { word: "block", type: "block" },
      { word: "slash", type: "attack" },
      { word: "roll", type: "dodge" },
      { word: "jab", type: "attack" }
    ],
    medium: [
      { word: "shield", type: "block" },
      { word: "parry", type: "dodge" },
      { word: "strike", type: "attack" },
      { word: "evade", type: "dodge" }
    ],
    hard: [
      { word: "counterattack", type: "attack" },
      { word: "reposition", type: "dodge" },
      { word: "intercept", type: "block" },
      { word: "lunge", type: "attack" }
    ],
    insane: [
      { word: "disengagement", type: "dodge" },
      { word: "retribution", type: "attack" },
      { word: "fortification", type: "block" },
      { word: "circumvent", type: "dodge" }
    ]
  };
  
  let currentPrompt = null;
  let timer = null;
  let inputEl = null;
  let stage = 1;
  let turns = 0;
  let score = 0;
  let playerHP = 100;
  let enemyHP = 100;
  
  function startGame() {
    document.getElementById("startButton").style.display = "none";
    document.getElementById("game-container").style.display = "block";
  
    inputEl = document.getElementById("commandInput");
    inputEl.addEventListener("input", handleTyping);
  
    updateBars();
    inputEl.disabled = false;
    nextPrompt();
  }
  
  function setPlayerSprite(action) {
    document.getElementById("playerSprite").src = `assets/avatar/player_${action}.png`;
  }
  
  function setEnemySprite(action) {
    document.getElementById("opponentSprite").src = `assets/avatar/enemy_${action}.png`;
    document.getElementById("opponentLabel").textContent = "Enemy";
  }
  
  function setBossSprite(action, bossNumber) {
    document.getElementById("opponentSprite").src = `assets/avatar/boss_${bossNumber}_${action}.png`;
    document.getElementById("opponentLabel").textContent = `Boss ${bossNumber}`;
  }
  
  function nextPrompt() {
    if (turns > 0 && turns % 5 === 0) {
      stage++;
      document.getElementById("stageNumber").textContent = stage;
      enemyHP = 100;
      updateBars();
    }
  
    let difficulty = "easy";
    if (stage >= 4 && stage < 7) difficulty = "medium";
    else if (stage >= 7 && stage < 10) difficulty = "hard";
    else if (stage >= 10) difficulty = "insane";
  
    const pool = promptPool[difficulty];
    currentPrompt = pool[Math.floor(Math.random() * pool.length)];
  
    document.getElementById("promptText").textContent =
      `Type this to ${currentPrompt.type.toUpperCase()}: "${currentPrompt.word}"`;
  
    document.getElementById("game-log").textContent = "";
    inputEl.value = "";
    inputEl.focus();
  
    timer = setTimeout(() => {
      handleFailure("Time's up! You failed to respond in time.");
      enemyAttack();
    }, 5000);
  }
  
  function handleTyping() {
    const typed = inputEl.value.trim().toLowerCase();
    const isBossStage = stage % 5 === 0;
    const bossNumber = stage / 5;
  
    if (typed === currentPrompt.word) {
      clearTimeout(timer);
      document.getElementById("game-log").textContent =
        `Success! You used ${currentPrompt.type} effectively.`;
  
      setPlayerSprite("attack");
      isBossStage ? setBossSprite("hurt", bossNumber) : setEnemySprite("hurt");
  
      if (currentPrompt.type === "attack") {
        enemyHP = Math.max(0, enemyHP - 20);
        score += 10;
      }
  
      updateBars();
      inputEl.disabled = true;
      turns++;
  
      setTimeout(() => {
        if (enemyHP <= 0) {
          document.getElementById("game-log").textContent = "Enemy defeated!";
          enemyHP = 100;
          updateBars();
        }
        setPlayerSprite("idle");
        isBossStage ? setBossSprite("idle", bossNumber) : setEnemySprite("idle");
        inputEl.disabled = false;
        nextPrompt();
      }, 1000);
    }
  }
  
  function handleFailure(message) {
    inputEl.removeEventListener("input", handleTyping);
    inputEl.disabled = true;
    document.getElementById("game-log").textContent = message;
  
    setTimeout(() => {
      inputEl.disabled = false;
      inputEl.addEventListener("input", handleTyping);
      nextPrompt();
    }, 1500);
  }
  
  function enemyAttack() {
    const isBossStage = stage % 5 === 0;
    const bossNumber = stage / 5;
  
    if (currentPrompt.type === "block" || currentPrompt.type === "dodge") {
      playerHP = Math.max(0, playerHP - 15);
      setPlayerSprite("hurt");
      isBossStage ? setBossSprite("attack", bossNumber) : setEnemySprite("attack");
  
      setTimeout(() => {
        setPlayerSprite("idle");
        isBossStage ? setBossSprite("idle", bossNumber) : setEnemySprite("idle");
      }, 1000);
  
      updateBars();
    }
  }
  
  function updateBars() {
    document.getElementById("enemyHealth").style.width = enemyHP + "%";
    document.getElementById("playerHealth").style.width = playerHP + "%";
    document.getElementById("enemyHPDisplay").textContent = enemyHP;
    document.getElementById("playerHPDisplay").textContent = playerHP;
    document.getElementById("score").textContent = score;
  }