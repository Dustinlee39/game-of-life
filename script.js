class GameOfLife {
    constructor(canvasId, debug = false) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 10;
        this.grid = [];
        this.isPaused = false;
        this.isDrawMode = false;
        this.debug = debug;
        this.speed = 1000 / 50; // Default speed
        this.initialize();
    }

    logDebug(message) {
        if (this.debug) {
            console.log(message);
        }
    }

    initialize() {
        this.addEventListeners();
        this.resizeCanvas();
        this.initializeGrid(0.2);
        this.gameLoop();
    }

    initializeGrid(chanceOfLife) {
        this.gridSizeX = Math.floor(this.canvas.width / this.cellSize);
        this.gridSizeY = Math.floor(this.canvas.height / this.cellSize);
        this.grid = Array.from({ length: this.gridSizeX }, () => 
            Array.from({ length: this.gridSizeY }, () => Math.random() < chanceOfLife ? 1 : 0)
        );
        this.logDebug('Grid initialized.');
    }

    drawGrid() {
        this.ctx.fillStyle = document.getElementById('bgColor').value;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = document.getElementById('cellColor').value;
        this.grid.forEach((col, x) => {
            col.forEach((cell, y) => {
                if (cell) {
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                }
            });
        });
        this.logDebug('Grid drawn.');
    }

    updateGrid() {
        let newGrid = Array.from({ length: this.gridSizeX }, () => Array(this.gridSizeY).fill(0));

        this.grid.forEach((col, x) => {
            col.forEach((cell, y) => {
                let aliveNeighbors = this.countAliveNeighbors(x, y);
                if (cell) {
                    newGrid[x][y] = aliveNeighbors === 2 || aliveNeighbors === 3 ? 1 : 0;
                } else {
                    newGrid[x][y] = aliveNeighbors === 3 ? 1 : 0;
                }
            });
        });

        this.grid = newGrid;
        this.logDebug('Grid updated.');
    }

    countAliveNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                let nx = x + i;
                let ny = y + j;
                if (nx >= 0 && nx < this.gridSizeX && ny >= 0 && ny < this.gridSizeY) {
                    count += this.grid[nx][ny];
                }
            }
        }
        this.logDebug(`Alive neighbors for (${x},${y}): ${count}`);
        return count;
    }

    gameLoop() {
        if (!this.isPaused) {
            this.drawGrid();
            this.updateGrid();
        }
        setTimeout(() => this.gameLoop(), this.speed);
    }

    resizeCanvas() {
        const size = Math.min(window.innerWidth, window.innerHeight) - 20;
        if (this.canvas.width !== size || this.canvas.height !== size) {
            this.canvas.width = size;
            this.canvas.height = size;
            this.initializeGrid(0.2);
            this.drawGrid();
            this.logDebug('Canvas resized and grid reinitialized.');
        }
    }

    togglePlayPause() {
        this.isPaused = !this.isPaused;
        document.getElementById('playPauseBtn').textContent = this.isPaused ? 'Play' : 'Pause';
        this.logDebug(`Game ${this.isPaused ? 'paused' : 'resumed'}.`);
    }

    resetGame() {
        this.initializeGrid(0.2);
        this.drawGrid();
        this.logDebug('Game reset.');
    }

    adjustSpeed(value) {
        this.speed = 1000 / value;
        this.logDebug(`Speed adjusted to ${value} FPS.`);
    }

    adjustCellSize(value) {
        this.cellSize = parseInt(value);
        this.resizeCanvas();
        this.logDebug(`Cell size adjusted to ${this.cellSize}px.`);
    }

    applyPattern(patternName) {
        const patterns = {
            glider: [
                [1, 0], [2, 1], [0, 2], [1, 2], [2,
