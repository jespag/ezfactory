const gridElement = document.getElementById('game-grid');
const ironCountElement = document.getElementById('iron-count');
const copperCountElement = document.getElementById('copper-count');
const ironIngotCountElement = document.getElementById('iron-ingot-count');
const copperIngotCountElement = document.getElementById('copper-ingot-count');
const messageElement = document.getElementById('message');
const currentModeElement = document.getElementById('current-mode');
const tooltip = document.getElementById('tooltip');

let ironCount = 0;
let copperCount = 0;
let ironIngotCount = 0;
let copperIngotCount = 0;

const tiles = [];
const gridSize = 100;

// Modes: 'gather', 'build-miner', 'build-smelter'
let mode = 'gather';

const minerCost = { iron: 5 };
const smelterCost = { iron: 10 };

document.getElementById('select-mode').addEventListener('click', () => {
  mode = 'gather';
  currentModeElement.textContent = 'Gather';
});

document.getElementById('build-miner').addEventListener('click', () => {
  mode = 'build-miner';
  currentModeElement.textContent = 'Build Miner';
});

document.getElementById('build-smelter').addEventListener('click', () => {
  mode = 'build-smelter';
  currentModeElement.textContent = 'Build Smelter';
});

// Set cost data attributes for buttons
document.getElementById('build-miner').setAttribute('data-cost', 'Cost: 5 Iron Ore');
document.getElementById('build-smelter').setAttribute('data-cost', 'Cost: 10 Iron Ore');

// Generate the grid
for (let i = 0; i < gridSize; i++) {
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.dataset.index = i;

  // Randomly assign resources
  const rand = Math.random();
  if (rand < 0.05) { // Reduced number of resource nodes
    tile.dataset.resource = 'iron';
    tile.classList.add('resource-iron');
    tile.textContent = '🪨';
    // Infinite resources: no amount tracking needed
  } else if (rand < 0.1) {
    tile.dataset.resource = 'copper';
    tile.classList.add('resource-copper');
    tile.textContent = '🥉';
    // Infinite resources
  }

  tile.addEventListener('click', () => handleTileClick(tile));

  gridElement.appendChild(tile);
  tiles.push(tile);
}

function handleTileClick(tile) {
  const resource = tile.dataset.resource;
  const building = tile.dataset.building;

  if (mode === 'gather') {
    if (resource === 'iron' || resource === 'copper') {
      collectResource(tile, resource);
    } else {
      displayMessage('No resource to gather here.');
    }
  } else if (mode === 'build-miner') {
    if (canAfford(minerCost) && resource && !building) {
      payCost(minerCost);
      tile.dataset.building = 'miner';
      tile.classList.add('building-miner');
      tile.textContent = '⛏️';
      startMining(tile);
    } else {
      displayMessage('Cannot build miner here.');
    }
  } else if (mode === 'build-smelter') {
    if (canAfford(smelterCost) && !resource && !building) {
      payCost(smelterCost);
      tile.dataset.building = 'smelter';
      tile.classList.add('building-smelter');
      tile.textContent = '🔥';
      startSmelting(tile);
    } else {
      displayMessage('Cannot build smelter here.');
    }
  }
}

function collectResource(tile, type) {
  if (type === 'iron') {
    ironCount += 1;
    ironCountElement.textContent = ironCount;
  } else if (type === 'copper') {
    copperCount += 1;
    copperCountElement.textContent = copperCount;
  }
  tile.classList.add('collect-animation');
  setTimeout(() => tile.classList.remove('collect-animation'), 500);
}

function startMining(tile) {
  const resourceType = tile.dataset.resource;
  if (!resourceType) return;

  const miningInterval = setInterval(() => {
    if (resourceType === 'iron') {
      ironCount += 1;
      ironCountElement.textContent = ironCount;
    } else if (resourceType === 'copper') {
      copperCount += 1;
      copperCountElement.textContent = copperCount;
    }
    tile.classList.add('collect-animation');
    setTimeout(() => tile.classList.remove('collect-animation'), 500);
  }, 2000); // Collect resource every 2 seconds
}

function startSmelting(tile) {
  const smeltingInterval = setInterval(() => {
    let smelted = false;
    if (ironCount >= 2) {
      ironCount -= 2;
      ironIngotCount += 1;
      ironCountElement.textContent = ironCount;
      ironIngotCountElement.textContent = ironIngotCount;
      smelted = true;
    }
    if (copperCount >= 2) {
      copperCount -= 2;
      copperIngotCount += 1;
      copperCountElement.textContent = copperCount;
      copperIngotCountElement.textContent = copperIngotCount;
      smelted = true;
    }
    if (smelted) {
      tile.classList.add('collect-animation');
      setTimeout(() => tile.classList.remove('collect-animation'), 500);
    }
  }, 3000); // Smelt resources every 3 seconds
}

function displayMessage(msg) {
  messageElement.textContent = msg;
  setTimeout(() => {
    messageElement.textContent = '';
  }, 2000);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function canAfford(cost) {
  return ironCount >= (cost.iron || 0);
}

function payCost(cost) {
  ironCount -= (cost.iron || 0);
  ironCountElement.textContent = ironCount;
}

// Tooltip for buttons
const buttons = document.querySelectorAll('#controls button[data-cost]');
buttons.forEach(button => {
  button.addEventListener('mouseover', showTooltip);
  button.addEventListener('mouseout', hideTooltip);
});

function showTooltip(event) {
  const button = event.currentTarget;
  tooltip.textContent = button.getAttribute('data-cost');
  tooltip.style.display = 'block';
  const rect = button.getBoundingClientRect();
  tooltip.style.left = rect.left + rect.width / 2 + 'px';
  tooltip.style.top = rect.bottom + window.scrollY + 5 + 'px';
  tooltip.style.transform = 'translateX(-50%)';
}

function hideTooltip() {
  tooltip.style.display = 'none';
}