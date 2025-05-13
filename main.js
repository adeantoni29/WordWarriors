const promptPoolAttack = { // Basic Attack
    easy: ["slash", "jab"],
    medium: ["parry", "strike"],
    hard: ["counterattack", "intercept"],
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
    if (storedPromptTimer && storedPromptTimer.start) {
      timer = storedPromptTimer;
      timer.start();
    }
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
  
  // Stage Setup 
  function resetStage() {
    document.getElementById("stageNumber").textContent = stage;
    document.getElementById("score").textContent = score;
  
    playerHP = 100;
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

    if (stage > 1 && playerTurn && typed === promptUnlock1) {
      if (timer && timer.stop) timer.stop();
      document.getElementById("promptTimerBarContainer").style.display = "none";
  
      healingPotion();
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
  
  function healingPotion() {
    playerHP += 10;
  
    if (playerHP > 100) {
      playerHP = 100;
    }
    updateBars();
    nextPrompt();
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
  
  
  