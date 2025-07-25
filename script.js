// Game state management
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let score = 0;

// DOM elements
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const playButton = document.getElementById('playButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let food = {};
let dx = 0;
let dy = 0;
let gameLoop;

// Event listeners
playButton.addEventListener('click', startGame);
document.addEventListener('keydown', changeDirection);

// Add some fun button interaction
playButton.addEventListener('mouseenter', () => {
    playButton.style.transform = 'translateY(-5px) scale(1.05)';
});

playButton.addEventListener('mouseleave', () => {
    playButton.style.transform = 'translateY(0) scale(1)';
});

// Start the game
function startGame() {
    gameState = 'playing';
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    // Initialize game
    initGame();
    
    // Start game loop
    gameLoop = setInterval(updateGame, 150); // Game speed: 150ms per frame
    console.log('Game started! 🎮');
}

// Initialize game variables
function initGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1; // Start moving right
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    generateFood();
}

// Main game update loop
function updateGame() {
    if (gameState !== 'playing') return;

    // Move snake
    moveSnake();
    
    // Check for food collision
    checkFoodCollision();
    
    // Draw everything
    drawGame();
}

// Move snake based on direction
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Add new head
    snake.unshift(head);
    
    // Remove tail (only if not eating food - we'll handle this in checkFoodCollision)
    // For now, always remove tail - checkFoodCollision will add it back if needed
    snake.pop();
}

// Handle keyboard input for direction changes
function changeDirection(event) {
    if (gameState !== 'playing') return;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    // Arrow keys
    if (keyPressed === 37 && !goingRight) { // Left arrow
        dx = -1;
        dy = 0;
    }
    if (keyPressed === 38 && !goingDown) { // Up arrow
        dx = 0;
        dy = -1;
    }
    if (keyPressed === 39 && !goingLeft) { // Right arrow
        dx = 1;
        dy = 0;
    }
    if (keyPressed === 40 && !goingUp) { // Down arrow
        dx = 0;
        dy = 1;
    }

    // WASD keys
    if ((keyPressed === 65 || keyPressed === 97) && !goingRight) { // A or a
        dx = -1;
        dy = 0;
    }
    if ((keyPressed === 87 || keyPressed === 119) && !goingDown) { // W or w
        dx = 0;
        dy = -1;
    }
    if ((keyPressed === 68 || keyPressed === 100) && !goingLeft) { // D or d
        dx = 1;
        dy = 0;
    }
    if ((keyPressed === 83 || keyPressed === 115) && !goingUp) { // S or s
        dx = 0;
        dy = 1;
    }
}

// Generate food at random position
function generateFood() {
    // Make sure food doesn't spawn on the snake
    do {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    } while (isOnSnake(food));
}

// Check if a position is on the snake
function isOnSnake(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

// Check for food collision and handle eating
function checkFoodCollision() {
    const head = snake[0];
    
    // Check if snake head touches food
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score += 10;
        scoreElement.textContent = score;
        
        // Add tail segment (snake grows)
        const tail = { ...snake[snake.length - 1] };
        snake.push(tail);
        
        // Generate new food
        generateFood();
        
        // Add visual feedback
        console.log(`🍎 Yummy! Score: ${score}`);
        
        // Add score animation effect
        animateScoreIncrease();
    }
}

// Animate score increase for visual feedback
function animateScoreIncrease() {
    const scoreDiv = document.querySelector('.score');
    scoreDiv.style.transform = 'scale(1.2)';
    scoreDiv.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        scoreDiv.style.transform = 'scale(1)';
    }, 200);
}

// Enhanced drawing function
function drawGame() {
    // Clear canvas with a soft background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines for better visibility (subtle)
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Draw snake with rounded corners and gradient
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Snake head - brighter and larger
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
            
            // Add eyes to the head
            ctx.fillStyle = '#fff';
            const eyeSize = 3;
            const eyeOffset = 5;
            
            // Determine eye position based on direction
            let eyeX1, eyeY1, eyeX2, eyeY2;
            if (dx === 1) { // Moving right
                eyeX1 = segment.x * gridSize + eyeOffset + 6;
                eyeY1 = segment.y * gridSize + eyeOffset;
                eyeX2 = segment.x * gridSize + eyeOffset + 6;
                eyeY2 = segment.y * gridSize + eyeOffset + 8;
            } else if (dx === -1) { // Moving left
                eyeX1 = segment.x * gridSize + eyeOffset;
                eyeY1 = segment.y * gridSize + eyeOffset;
                eyeX2 = segment.x * gridSize + eyeOffset;
                eyeY2 = segment.y * gridSize + eyeOffset + 8;
            } else if (dy === -1) { // Moving up
                eyeX1 = segment.x * gridSize + eyeOffset;
                eyeY1 = segment.y * gridSize + eyeOffset;
                eyeX2 = segment.x * gridSize + eyeOffset + 8;
                eyeY2 = segment.y * gridSize + eyeOffset;
            } else { // Moving down
                eyeX1 = segment.x * gridSize + eyeOffset;
                eyeY1 = segment.y * gridSize + eyeOffset + 6;
                eyeX2 = segment.x * gridSize + eyeOffset + 8;
                eyeY2 = segment.y * gridSize + eyeOffset + 6;
            }
            
            ctx.fillRect(eyeX1, eyeY1, eyeSize, eyeSize);
            ctx.fillRect(eyeX2, eyeY2, eyeSize, eyeSize);
        } else {
            // Snake body - slightly darker
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
        }
    });

    // Draw food as a cute apple with more detail
    ctx.fillStyle = '#e74c3c';
    const foodX = food.x * gridSize;
    const foodY = food.y * gridSize;
    
    // Draw apple body
    ctx.fillRect(foodX + 1, foodY + 1, gridSize - 2, gridSize - 2);
    
    // Add apple highlight
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(foodX + 3, foodY + 3, gridSize - 10, gridSize - 10);
    
    // Add apple shine effect
    ctx.fillStyle = '#fff';
    ctx.fillRect(foodX + 4, foodY + 4, 4, 4);
    
    // Add simple leaf (green dot)
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(foodX + gridSize - 6, foodY + 2, 3, 3);
}

// Initial draw
drawGame();

// Add some fun console messages
console.log('🐍 Welcome to Snake Game for Kids!');
console.log('Click the Play button to start your adventure!');
console.log('Use Arrow Keys or WASD to control the snake!');
console.log('� Eat the red apples to grow and score points!');
console.log('�🎮 Controls:');
console.log('  ↑ W - Move Up');
console.log('  ↓ S - Move Down');
console.log('  ← A - Move Left');
console.log('  → D - Move Right');
console.log('🎯 Goal: Eat as many apples as you can!');
