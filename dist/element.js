export class RandomElement {
    constructor(type, color, size, gameInstance) {
        this.type = type;
        this.color = color;
        this.size = size;
        this.currentElement = null;
        this.game = gameInstance;
    }
    disappear(collectedCallback) {
        if (this.currentElement) {
            if (this.color === 'Green') {
                this.currentElement.style.display = 'none';
                collectedCallback();
                const index = this.game.elements.indexOf(this);
                if (index !== -1) {
                    this.game.elements.splice(index, 1);
                    if (this.type === 'Change') {
                        this.game.collectedGreenChangeables++;
                    }
                }
            }
            console.log(`Remaining elements on the screen: ${this.game.elements.length}`);
            console.log(`Collected Green Changeables: ${this.game.collectedGreenChangeables}`);
            console.log(`Collected Red Changeables: ${this.game.collectedRedChangeables}`);
            // Check if all remaining elements are of type 'Avoid'
            const remainingAvoidElements = this.game.elements.filter((element) => element.type === 'Avoid');
            if (remainingAvoidElements.length === this.game.elements.length) {
                console.log("GAME OVER");
                this.game.isGameOver = true;
                this.game.endGame();
            }
        }
    }
    changeBehavior(collectedCallback, failedCallback) {
        const changeInterval = setInterval(() => {
            if (this.color === 'Green') {
                this.color = 'Red';
            }
            else {
                this.color = 'Green';
            }
            if (this.currentElement) {
                this.renderChanged();
            }
        }, 1500);
        setTimeout(() => {
            clearInterval(changeInterval);
        }, 60000); // 1min
    }
    renderChanged() {
        if (this.currentElement) {
            this.currentElement.style.backgroundColor = this.color;
            // this.currentElement.style.height = '60px';
        }
    }
    render(collectedCallback, failedCallback) {
        const elementContainer = document.body;
        if (elementContainer) {
            if (!this.currentElement) {
                const elementDiv = document.createElement('div');
                elementDiv.className = 'game-element';
                elementDiv.style.width = this.size + 'px';
                elementDiv.style.height = this.size + 'px';
                elementDiv.style.borderRadius = this.color === 'Green' ? '50%' : '0%';
                if (this.type === 'Change') {
                    elementDiv.style.height = '60px';
                }
                elementDiv.addEventListener('click', () => {
                    this.disappear(collectedCallback);
                });
                elementContainer.appendChild(elementDiv);
                this.currentElement = elementDiv;
            }
            this.currentElement.style.display = 'block';
            this.currentElement.style.backgroundColor = this.color;
            const randomTop = Math.floor(Math.random() * (document.body.offsetHeight - this.size));
            const randomLeft = Math.floor(Math.random() * (document.body.offsetWidth - this.size));
            this.currentElement.style.top = randomTop + 'px';
            this.currentElement.style.left = randomLeft + 'px';
        }
    }
}
