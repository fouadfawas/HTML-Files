document.addEventListener('DOMContentLoaded', () => {
    const scoreDisplay = document.getElementById('score');
    const clickerButton = document.getElementById('clicker-button');
    const clickerArea = document.getElementById('clicker-area');
    // Use Web Audio API for clicks
    let audioContext;
    let clickBuffer;
    let bingChillingBuffer;

    // Function to load audio using Web Audio API
    async function loadAudio(url) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

    // Load sounds on startup
    loadAudio('/click_sfx.mp3').then(buffer => { clickBuffer = buffer; }).catch(e => console.error("Error loading click audio:", e));
    loadAudio('/bing_chilling_sfx.mp3').then(buffer => { bingChillingBuffer = buffer; }).catch(e => console.error("Error loading Bing Chilling audio:", e));


    const bingChillingPopup = document.getElementById('bing-chilling-popup');
    const bingChillingBonusDisplay = document.getElementById('bing-chilling-bonus');

    // Worker Efficiency UI
    const workerEfficiencyBonusDisplay = document.getElementById('worker-efficiency-bonus');
    const workerEfficiencyLevelDisplay = document.getElementById('worker-efficiency-level');
    const workerEfficiencyMaxLevelDisplay = document.getElementById('worker-efficiency-max-level');
    const workerEfficiencyCostDisplay = document.getElementById('worker-efficiency-cost');
    const buyWorkerEfficiencyButton = document.getElementById('buy-worker-efficiency');

    // Red Guards Patrol UI
    const redGuardsPatrolBonusDisplay = document.getElementById('red-guards-patrol-bonus');
    const redGuardsPatrolLevelDisplay = document.getElementById('red-guards-patrol-level');
    const redGuardsPatrolMaxLevelDisplay = document.getElementById('red-guards-patrol-max-level');
    const redGuardsPatrolCostDisplay = document.getElementById('red-guards-patrol-cost');
    const buyRedGuardsPatrolButton = document.getElementById('buy-red-guards-patrol');

    // Great Leap Forward UI
    const greatLeapForwardBonusMinDisplay = document.getElementById('great-leap-forward-bonus-min');
    const greatLeapForwardBonusMaxDisplay = document.getElementById('great-leap-forward-bonus-max');
    const greatLeapForwardLevelDisplay = document.getElementById('great-leap-forward-level');
    const greatLeapForwardMaxLevelDisplay = document.getElementById('great-leap-forward-max-level');
    const greatLeapForwardCostDisplay = document.getElementById('great-leap-forward-cost');
    const buyGreatLeapForwardButton = document.getElementById('buy-great-leap-forward');

    // Harmonious Society Initiative UI
    const harmoniousSocietyBonusDisplay = document.getElementById('harmonious-society-bonus');
    const harmoniousSocietyLevelDisplay = document.getElementById('harmonious-society-level');
    const harmoniousSocietyMaxLevelDisplay = document.getElementById('harmonious-society-max-level');
    const harmoniousSocietyCostDisplay = document.getElementById('harmonious-society-cost');
    const buyHarmoniousSocietyButton = document.getElementById('buy-harmonious-society');

    // Golden Shield Project UI
    const goldenShieldBonusDisplay = document.getElementById('golden-shield-bonus');
    const goldenShieldLevelDisplay = document.getElementById('golden-shield-level');
    const goldenShieldMaxLevelDisplay = document.getElementById('golden-shield-max-level');
    const goldenShieldCostDisplay = document.getElementById('golden-shield-cost');
    const buyGoldenShieldButton = document.getElementById('buy-golden-shield');

    // Elite Worker Cadre UI
    const eliteWorkerCadreBonusDisplay = document.getElementById('elite-worker-cadre-bonus');
    const eliteWorkerCadreLevelDisplay = document.getElementById('elite-worker-cadre-level');
    const eliteWorkerCadreMaxLevelDisplay = document.getElementById('elite-worker-cadre-max-level');
    const eliteWorkerCadreCostDisplay = document.getElementById('elite-worker-cadre-cost');
    const buyEliteWorkerCadreButton = document.getElementById('buy-elite-worker-cadre');

    // PLA Support UI
    const plaSupportBonusDisplay = document.getElementById('pla-support-bonus');
    const plaSupportLevelDisplay = document.getElementById('pla-support-level');
    const plaSupportMaxLevelDisplay = document.getElementById('pla-support-max-level');
    const plaSupportCostDisplay = document.getElementById('pla-support-cost');
    const buyPlaSupportButton = document.getElementById('buy-pla-support');

    // Cultural Revolution Boost UI
    const culturalRevolutionBoostBonusMinDisplay = document.getElementById('cultural-revolution-boost-bonus-min');
    const culturalRevolutionBoostBonusMaxDisplay = document.getElementById('cultural-revolution-boost-bonus-max');
    const culturalRevolutionBoostLevelDisplay = document.getElementById('cultural-revolution-boost-level');
    const culturalRevolutionBoostMaxLevelDisplay = document.getElementById('cultural-revolution-boost-max-level');
    const culturalRevolutionBoostCostDisplay = document.getElementById('cultural-revolution-boost-cost');
    const buyCulturalRevolutionBoostButton = document.getElementById('buy-cultural-revolution-boost');

    // New Critical Hit Upgrades UI
    const propagandaNetworkBonusDisplay = document.getElementById('propaganda-network-bonus');
    const propagandaNetworkLevelDisplay = document.getElementById('propaganda-network-level');
    const propagandaNetworkMaxLevelDisplay = document.getElementById('propaganda-network-max-level');
    const propagandaNetworkCostDisplay = document.getElementById('propaganda-network-cost');
    const buyPropagandaNetworkButton = document.getElementById('buy-propaganda-network');

    const ideologicalPurityBonusDisplay = document.getElementById('ideological-purity-bonus');
    const ideologicalPurityLevelDisplay = document.getElementById('ideological-purity-level');
    const ideologicalPurityMaxLevelDisplay = document.getElementById('ideological-purity-max-level');
    const ideologicalPurityCostDisplay = document.getElementById('ideological-purity-cost');
    const buyIdeologicalPurityButton = document.getElementById('buy-ideological-purity');

    // Background Music using Web Audio API
    let musicSource;
    let musicBuffer;
    let musicPlaying = false;

    async function loadMusic(url) {
         if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
         }
         const response = await fetch(url);
         const arrayBuffer = await response.arrayBuffer();
         musicBuffer = await audioContext.decodeAudioData(arrayBuffer);
         console.log("Music loaded.");
    }

    function playMusic() {
        if (musicBuffer && audioContext && audioContext.state === 'running' && !musicPlaying) {
            musicSource = audioContext.createBufferSource();
            musicSource.buffer = musicBuffer;
            musicSource.loop = true;
            musicSource.connect(audioContext.destination);
            musicSource.start(0);
            musicPlaying = true;
            console.log("Music started.");
        } else {
             console.log("Music not ready or already playing or audio context not running.");
        }
    }

    function resumeAudioContext() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log('AudioContext resumed!');
                // Try playing music again after context is resumed
                if (!musicPlaying) {
                    playMusic();
                }
            }).catch(e => console.error("Error resuming AudioContext:", e));
        } else if (audioContext && audioContext.state === 'running') {
             // If already running, just try playing music
             if (!musicPlaying) {
                 playMusic();
             }
        }
    }


    // Load music on startup
    loadMusic('/mao zedong propaganda music Red Sun in the Sky.mp3').catch(e => console.error("Error loading music:", e));

    // Auto-play music on the first user interaction (click anywhere)
    document.body.addEventListener('click', resumeAudioContext, { once: true });


    let score = 0;
    let pointsPerClick = 1;
    let passiveIncomeInterval = null;
    
    const BASE_BING_CHILLING_CHANCE = 0.066; 
    const BASE_BING_CHILLING_BONUS_MIN = 50;
    const BASE_BING_CHILLING_BONUS_MAX = 200;

    const BASE_POINTS_PER_CLICK = 1;

    const BASE_CRITICAL_CHANCE = 0.05; // 5%
    const BASE_CRITICAL_MULTIPLIER = 10; // 10x

    const upgrades = {
        workerEfficiency: {
            id: 'workerEfficiency',
            name: "Worker Efficiency",
            baseCost: 50,
            costMultiplier: 1.5,
            level: 0,
            maxLevel: 10,
            getBonusPerLevel: function() { return 1; }, 
            getCurrentBonus: function() {
                return this.level * this.getBonusPerLevel();
            },
            getCurrentCost: function() {
                if (this.level >= this.maxLevel) return Infinity;
                return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
            },
        },
        redGuardsPatrol: {
            id: 'redGuardsPatrol',
            name: "Red Guards Patrol",
            baseCost: 200,
            costMultiplier: 1.8,
            level: 0,
            maxLevel: 10,
            getBonusPerLevel: function() { return 0.5; }, // SC per second
            getCurrentBonus: function() {
                return this.level * this.getBonusPerLevel();
            },
            getCurrentCost: function() {
                if (this.level >= this.maxLevel) return Infinity;
                return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
            },
        },
        greatLeapForward: {
            id: 'greatLeapForward',
            name: "Great Leap Forward",
            baseCost: 500,
            costMultiplier: 2.0,
            level: 0,
            maxLevel: 5,
            getBonusPerLevel: function() { return { min: 25, max: 50 }; }, // Increase to min/max Bing Chilling bonus
            getCurrentBonus: function() {
                const bonusPerLevel = this.getBonusPerLevel();
                return { 
                    min: this.level * bonusPerLevel.min,
                    max: this.level * bonusPerLevel.max 
                };
            },
            getCurrentCost: function() {
                if (this.level >= this.maxLevel) return Infinity;
                return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
            },
        },
        harmoniousSocietyInitiative: {
            id: 'harmoniousSocietyInitiative',
            name: "Harmonious Society Initiative",
            baseCost: 1000,
            costMultiplier: 2.2,
            level: 0,
            maxLevel: 5,
            getBonusPerLevel: function() { return 0.01; }, // +1% chance per level
            getCurrentBonus: function() {
                return this.level * this.getBonusPerLevel();
            },
            getCurrentCost: function() {
                if (this.level >= this.maxLevel) return Infinity;
                return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
            },
        },
        goldenShieldProject: {
            id: 'goldenShieldProject',
            name: "Golden Shield Project",
            baseCost: 2500,
            costMultiplier: 2.5,
            level: 0,
            maxLevel: 8,
            getBonusPerLevel: function() { return 0.1; }, // +0.1x multiplier to passive income
            getCurrentBonus: function() {
                return 1 + (this.level * this.getBonusPerLevel()); // e.g., 1.0, 1.1, 1.2
            },
            getCurrentCost: function() {
                if (this.level >= this.maxLevel) return Infinity;
                return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
            },
        },
        eliteWorkerCadre: {
            id: 'eliteWorkerCadre',
            name: "Elite Worker Cadre",
            baseCost: 5000,
            costMultiplier: 1.6,
            level: 0,
            maxLevel: 10,
            getBonusPerLevel: function() { return 10; }, // Significantly more points per click
            getCurrentBonus: function() {
                return this.level * this.getBonusPerLevel();
            },
            getCurrentCost: function() {
                if (this.level >= this.maxLevel) return Infinity;
                return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
            },
        },
        plaSupport: {
            id: 'plaSupport',
            name: "PLA Support",
            baseCost: 10000,
            costMultiplier: 1.9,
            level: 0,
            maxLevel: 10,
            getBonusPerLevel: function() { return 5; }, // Significantly more SC per second
            getCurrentBonus: function() {
                return this.level * this.getBonusPerLevel();
            },
            getCurrentCost: function() {
                if (this.level >= this.maxLevel) return Infinity;
                return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
            },
        },
        culturalRevolutionBoost: {
            id: 'culturalRevolutionBoost',
            name: "Cultural Revolution Boost",
            baseCost: 15000,
            costMultiplier: 2.1,
            level: 0,
            maxLevel: 5,
            getBonusPerLevel: function() { return { min: 100, max: 200 }; }, // Significantly more Bing Chilling bonus
            getCurrentBonus: function() {
                const bonusPerLevel = this.getBonusPerLevel();
                return {
                    min: this.level * bonusPerLevel.min,
                    max: this.level * bonusPerLevel.max
                };
            },
            getCurrentCost: function() {
                if (this.level >= this.maxLevel) return Infinity;
                return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
            },
        },
        propagandaNetwork: {
            id: 'propagandaNetwork',
            name: "Propaganda Network",
            baseCost: 750,
            costMultiplier: 1.7,
            level: 0,
            maxLevel: 10,
            getBonusPerLevel: function() { return 0.01; }, // +1% critical chance per level
            getCurrentBonus: function() {
                return this.level * this.getBonusPerLevel();
            },
            getCurrentCost: function() {
                if (this.level >= this.maxLevel) return Infinity;
                return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
            },
        },
        ideologicalPurity: {
            id: 'ideologicalPurity',
            name: "Ideological Purity",
            baseCost: 3000,
            costMultiplier: 2.3,
            level: 0,
            maxLevel: 5,
            getBonusPerLevel: function() { return 2; }, // +2x critical multiplier per level
            getCurrentBonus: function() {
                return this.level * this.getBonusPerLevel();
            },
            getCurrentCost: function() {
                if (this.level >= this.maxLevel) return Infinity;
                return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
            },
        }
    };

    function calculatePointsPerClick() {
        pointsPerClick = BASE_POINTS_PER_CLICK + upgrades.workerEfficiency.getCurrentBonus() + upgrades.eliteWorkerCadre.getCurrentBonus();
    }

    function calculatePassiveIncomePerSecond() {
        const basePassive = upgrades.redGuardsPatrol.getCurrentBonus() + upgrades.plaSupport.getCurrentBonus();
        return basePassive * upgrades.goldenShieldProject.getCurrentBonus();
    }

    function calculateBingChillingChance() {
        return BASE_BING_CHILLING_CHANCE + upgrades.harmoniousSocietyInitiative.getCurrentBonus();
    }

    function calculateCriticalChance() {
        return Math.min(1, BASE_CRITICAL_CHANCE + upgrades.propagandaNetwork.getCurrentBonus());
    }

    function calculateCriticalMultiplier() {
        return BASE_CRITICAL_MULTIPLIER + upgrades.ideologicalPurity.getCurrentBonus();
    }

    function startPassiveIncome() {
        if (passiveIncomeInterval) {
            clearInterval(passiveIncomeInterval);
        }
        const incomePerSecond = calculatePassiveIncomePerSecond();
        if (incomePerSecond > 0) {
            passiveIncomeInterval = setInterval(() => {
                score += incomePerSecond;
                updateScoreDisplay();
                renderUpgrades(); 
            }, 1000);
        }
    }

    function loadGame() {
        const savedScore = localStorage.getItem('socialCreditScore');
        if (savedScore !== null) {
            score = parseInt(savedScore, 10);
        }

        Object.keys(upgrades).forEach(key => {
            const savedLevel = localStorage.getItem(`${key}Level`);
            if (savedLevel !== null) {
                upgrades[key].level = parseInt(savedLevel, 10);
            }
        });
        
        calculatePointsPerClick();
        startPassiveIncome(); 
        updateScoreDisplay();
        renderUpgrades();
    }

    function saveGame() {
        localStorage.setItem('socialCreditScore', score);
        Object.keys(upgrades).forEach(key => {
            localStorage.setItem(`${key}Level`, upgrades[key].level);
        });
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = Math.floor(score); 
    }

    function renderUpgrades() {
        const we = upgrades.workerEfficiency;
        workerEfficiencyBonusDisplay.textContent = we.getCurrentBonus();
        workerEfficiencyLevelDisplay.textContent = we.level;
        workerEfficiencyMaxLevelDisplay.textContent = we.maxLevel;
        let cost = we.getCurrentCost();
        if (cost === Infinity) {
            workerEfficiencyCostDisplay.textContent = "MAX";
            buyWorkerEfficiencyButton.disabled = true;
            buyWorkerEfficiencyButton.textContent = "Max Level";
        } else {
            workerEfficiencyCostDisplay.textContent = cost;
            buyWorkerEfficiencyButton.disabled = score < cost || we.level >= we.maxLevel;
            buyWorkerEfficiencyButton.textContent = "Buy";
        }

        const rgp = upgrades.redGuardsPatrol;
        redGuardsPatrolBonusDisplay.textContent = rgp.getCurrentBonus().toFixed(1); 
        redGuardsPatrolLevelDisplay.textContent = rgp.level;
        redGuardsPatrolMaxLevelDisplay.textContent = rgp.maxLevel;
        cost = rgp.getCurrentCost();
        if (cost === Infinity) {
            redGuardsPatrolCostDisplay.textContent = "MAX";
            buyRedGuardsPatrolButton.disabled = true;
            buyRedGuardsPatrolButton.textContent = "Max Level";
        } else {
            redGuardsPatrolCostDisplay.textContent = cost;
            buyRedGuardsPatrolButton.disabled = score < cost || rgp.level >= rgp.maxLevel;
            buyRedGuardsPatrolButton.textContent = "Buy";
        }

        const glf = upgrades.greatLeapForward;
        const glfBonus = glf.getCurrentBonus();
        greatLeapForwardBonusMinDisplay.textContent = glfBonus.min;
        greatLeapForwardBonusMaxDisplay.textContent = glfBonus.max;
        greatLeapForwardLevelDisplay.textContent = glf.level;
        greatLeapForwardMaxLevelDisplay.textContent = glf.maxLevel;
        cost = glf.getCurrentCost();
        if (cost === Infinity) {
            greatLeapForwardCostDisplay.textContent = "MAX";
            buyGreatLeapForwardButton.disabled = true;
            buyGreatLeapForwardButton.textContent = "Max Level";
        } else {
            greatLeapForwardCostDisplay.textContent = cost;
            buyGreatLeapForwardButton.disabled = score < cost || glf.level >= glf.maxLevel;
            buyGreatLeapForwardButton.textContent = "Buy";
        }

        const hsi = upgrades.harmoniousSocietyInitiative;
        harmoniousSocietyBonusDisplay.textContent = (hsi.getCurrentBonus() * 100).toFixed(0);
        harmoniousSocietyLevelDisplay.textContent = hsi.level;
        harmoniousSocietyMaxLevelDisplay.textContent = hsi.maxLevel;
        cost = hsi.getCurrentCost();
        if (cost === Infinity) {
            harmoniousSocietyCostDisplay.textContent = "MAX";
            buyHarmoniousSocietyButton.disabled = true;
            buyHarmoniousSocietyButton.textContent = "Max Level";
        } else {
            harmoniousSocietyCostDisplay.textContent = cost;
            buyHarmoniousSocietyButton.disabled = score < cost || hsi.level >= hsi.maxLevel;
            buyHarmoniousSocietyButton.textContent = "Buy";
        }

        const gsp = upgrades.goldenShieldProject;
        goldenShieldBonusDisplay.textContent = gsp.getCurrentBonus().toFixed(1);
        goldenShieldLevelDisplay.textContent = gsp.level;
        goldenShieldMaxLevelDisplay.textContent = gsp.maxLevel;
        cost = gsp.getCurrentCost();
        if (cost === Infinity) {
            goldenShieldCostDisplay.textContent = "MAX";
            buyGoldenShieldButton.disabled = true;
            buyGoldenShieldButton.textContent = "Max Level";
        } else {
            goldenShieldCostDisplay.textContent = cost;
            buyGoldenShieldButton.disabled = score < cost || gsp.level >= gsp.maxLevel;
            buyGoldenShieldButton.textContent = "Buy";
        }

        const ewc = upgrades.eliteWorkerCadre;
        eliteWorkerCadreBonusDisplay.textContent = ewc.getCurrentBonus();
        eliteWorkerCadreLevelDisplay.textContent = ewc.level;
        eliteWorkerCadreMaxLevelDisplay.textContent = ewc.maxLevel;
        cost = ewc.getCurrentCost();
        if (cost === Infinity) {
            eliteWorkerCadreCostDisplay.textContent = "MAX";
            buyEliteWorkerCadreButton.disabled = true;
            buyEliteWorkerCadreButton.textContent = "Max Level";
        } else {
            eliteWorkerCadreCostDisplay.textContent = cost;
            buyEliteWorkerCadreButton.disabled = score < cost || ewc.level >= ewc.maxLevel;
            buyEliteWorkerCadreButton.textContent = "Buy";
        }

        const plas = upgrades.plaSupport;
        plaSupportBonusDisplay.textContent = plas.getCurrentBonus().toFixed(1);
        plaSupportLevelDisplay.textContent = plas.level;
        plaSupportMaxLevelDisplay.textContent = plas.maxLevel;
        cost = plas.getCurrentCost();
        if (cost === Infinity) {
            plaSupportCostDisplay.textContent = "MAX";
            buyPlaSupportButton.disabled = true;
            buyPlaSupportButton.textContent = "Max Level";
        } else {
            plaSupportCostDisplay.textContent = cost;
            buyPlaSupportButton.disabled = score < cost || plas.level >= plas.maxLevel;
            buyPlaSupportButton.textContent = "Buy";
        }
        
        const crb = upgrades.culturalRevolutionBoost;
        const crbBonus = crb.getCurrentBonus();
        culturalRevolutionBoostBonusMinDisplay.textContent = crbBonus.min;
        culturalRevolutionBoostBonusMaxDisplay.textContent = crbBonus.max;
        culturalRevolutionBoostLevelDisplay.textContent = crb.level;
        culturalRevolutionBoostMaxLevelDisplay.textContent = crb.maxLevel;
        cost = crb.getCurrentCost();
        if (cost === Infinity) {
            culturalRevolutionBoostCostDisplay.textContent = "MAX";
            buyCulturalRevolutionBoostButton.disabled = true;
            buyCulturalRevolutionBoostButton.textContent = "Max Level";
        } else {
            culturalRevolutionBoostCostDisplay.textContent = cost;
            buyCulturalRevolutionBoostButton.disabled = score < cost || crb.level >= crb.maxLevel;
            buyCulturalRevolutionBoostButton.textContent = "Buy";
        }

        const pn = upgrades.propagandaNetwork;
        propagandaNetworkBonusDisplay.textContent = (pn.getCurrentBonus() * 100).toFixed(0);
        propagandaNetworkLevelDisplay.textContent = pn.level;
        propagandaNetworkMaxLevelDisplay.textContent = pn.maxLevel;
        cost = pn.getCurrentCost();
        if (cost === Infinity) {
            propagandaNetworkCostDisplay.textContent = "MAX";
            buyPropagandaNetworkButton.disabled = true;
            buyPropagandaNetworkButton.textContent = "Max Level";
        } else {
            propagandaNetworkCostDisplay.textContent = cost;
            buyPropagandaNetworkButton.disabled = score < cost || pn.level >= pn.maxLevel;
            buyPropagandaNetworkButton.textContent = "Buy";
        }

        const ip = upgrades.ideologicalPurity;
        ideologicalPurityBonusDisplay.textContent = ip.getCurrentBonus();
        ideologicalPurityLevelDisplay.textContent = ip.level;
        ideologicalPurityMaxLevelDisplay.textContent = ip.maxLevel;
        cost = ip.getCurrentCost();
        if (cost === Infinity) {
            ideologicalPurityCostDisplay.textContent = "MAX";
            buyIdeologicalPurityButton.disabled = true;
            buyIdeologicalPurityButton.textContent = "Max Level";
        } else {
            ideologicalPurityCostDisplay.textContent = cost;
            buyIdeologicalPurityButton.disabled = score < cost || ip.level >= ip.maxLevel;
            buyIdeologicalPurityButton.textContent = "Buy";
        }
    }

    function buyUpgrade(upgradeId) {
        const upgrade = upgrades[upgradeId];
        if (!upgrade) return;

        const cost = upgrade.getCurrentCost();
        if (score >= cost && upgrade.level < upgrade.maxLevel) {
            score -= cost;
            upgrade.level++;
            
            calculatePointsPerClick(); 
            if (upgrade.id === 'redGuardsPatrol' || upgrade.id === 'goldenShieldProject' || upgrade.id === 'plaSupport') {
                startPassiveIncome();
            }
            
            updateScoreDisplay();
            saveGame(); 
            renderUpgrades();
        }
    }

    function showFloatingText(text, x, y) {
        const floatingText = document.createElement('div');
        floatingText.classList.add('floating-text');
        floatingText.textContent = text;
        
        const rect = clickerArea.getBoundingClientRect();
        const buttonRect = clickerButton.getBoundingClientRect();
        floatingText.style.left = `${buttonRect.left - rect.left + buttonRect.width / 2 - 15}px`; 
        floatingText.style.top = `${buttonRect.top - rect.top - 30}px`; 

        clickerArea.appendChild(floatingText);

        floatingText.addEventListener('animationend', () => {
            floatingText.remove();
        });
    }
    
    function triggerBingChilling() {
        const glfBonus = upgrades.greatLeapForward.getCurrentBonus();
        const crbBonus = upgrades.culturalRevolutionBoost.getCurrentBonus();
        const currentMinBonus = BASE_BING_CHILLING_BONUS_MIN + glfBonus.min + crbBonus.min;
        const currentMaxBonus = BASE_BING_CHILLING_BONUS_MAX + glfBonus.max + crbBonus.max;

        const bonus = Math.floor(Math.random() * (currentMaxBonus - currentMinBonus + 1)) + currentMinBonus;
        score += bonus;
        updateScoreDisplay(); 
        saveGame(); 

        bingChillingBonusDisplay.textContent = `+${bonus} Social Credit!`;
        bingChillingPopup.classList.remove('hidden'); 
        bingChillingPopup.style.opacity = '0'; 
        bingChillingPopup.style.transform = 'translate(-50%, -50%) scale(0.5)';
        
        requestAnimationFrame(() => { 
            bingChillingPopup.classList.add('visible');
        });
        
        if (bingChillingBuffer && audioContext) {
            const bingChillingSource = audioContext.createBufferSource();
            bingChillingSource.buffer = bingChillingBuffer;
            bingChillingSource.connect(audioContext.destination);
            bingChillingSource.start(0);
        }

        setTimeout(() => {
            bingChillingPopup.classList.remove('visible');
        }, 3000); 
    }

    clickerButton.addEventListener('click', (event) => {
        if (!musicPlaying) {
            playMusic();
        }

        let bonus = 1;
        if (Math.random() < calculateCriticalChance()) {
            bonus = calculateCriticalMultiplier();
        }
        score += pointsPerClick * bonus; 
        updateScoreDisplay(); 
        renderUpgrades(); 

        if (clickBuffer && audioContext) {
            const clickSource = audioContext.createBufferSource();
            clickSource.buffer = clickBuffer;
            clickSource.connect(audioContext.destination);
            clickSource.start(0);
        }

        const clickX = event.clientX;
        const clickY = event.clientY;
        showFloatingText(`+${pointsPerClick * bonus}`, clickX, clickY); 

        if (Math.random() < calculateBingChillingChance()) {
            triggerBingChilling();
        }
    });

    loadGame(); 
    
    if (!bingChillingPopup.classList.contains('visible')) {
         bingChillingPopup.style.opacity = '0'; 
         bingChillingPopup.style.transform = 'translate(-50%, -50%) scale(0.5)';
    }

    buyWorkerEfficiencyButton.addEventListener('click', () => buyUpgrade('workerEfficiency'));
    buyRedGuardsPatrolButton.addEventListener('click', () => buyUpgrade('redGuardsPatrol'));
    buyGreatLeapForwardButton.addEventListener('click', () => buyUpgrade('greatLeapForward'));
    buyHarmoniousSocietyButton.addEventListener('click', () => buyUpgrade('harmoniousSocietyInitiative'));
    buyGoldenShieldButton.addEventListener('click', () => buyUpgrade('goldenShieldProject'));
    buyEliteWorkerCadreButton.addEventListener('click', () => buyUpgrade('eliteWorkerCadre'));
    buyPlaSupportButton.addEventListener('click', () => buyUpgrade('plaSupport'));
    buyCulturalRevolutionBoostButton.addEventListener('click', () => buyUpgrade('culturalRevolutionBoost'));
    buyPropagandaNetworkButton.addEventListener('click', () => buyUpgrade('propagandaNetwork'));
    buyIdeologicalPurityButton.addEventListener('click', () => buyUpgrade('ideologicalPurity'));

    setInterval(saveGame, 30000);
});