import { Game } from './game';

export class RandomElement {
    type: string;
    color: string;
    size: number;
    currentElement: HTMLElement | null;
    game: Game;
  
    constructor(type: string, color: string, size: number, gameInstance: Game) {
      this.type = type;
      this.color = color;
      this.size = size;
      this.currentElement = null;
      this.game = gameInstance;
    }
  
    hideElement() {
        if (this.currentElement && this.color === 'Green') {
          this.currentElement.style.display = 'none';
        }
    }
    
    removeElementFromGame() {
        if (this.color === 'Green') {
          const index = this.game.elements.indexOf(this);
          if (index !== -1) {
            this.game.elements.splice(index, 1);
          }
        }
    }  

    checkGameOver() {
        const remainingAvoidElements = this.game.elements.filter(
          (element) => element.type === 'Avoid'
        );
    
        if (remainingAvoidElements.length === this.game.elements.length) {
          this.game.isGameOver = true;
          this.game.endGame();
        }
      }

    disappear(collectedCallback: () => void) {
        this.hideElement();
        this.removeElementFromGame();
        this.checkGameOver();
        collectedCallback();
    }
  
    changeBehavior() {
      const changeInterval = setInterval(() => {
        this.color = this.color === 'Green' ? 'Red' : 'Green';
        if (this.currentElement) {
          this.renderChanged();
        }
      }, 1500);
  
      setTimeout(() => {
        clearInterval(changeInterval);
      }, 60000);
    }
  
    createElement(elementContainer: HTMLElement, collectedCallback: () => void): HTMLDivElement {
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
    
        return elementDiv;
      }

      render(collectedCallback: () => void) {
        const elementContainer = document.body;
        if (elementContainer) {
          if (!this.currentElement) {
            this.createElement(elementContainer, collectedCallback);
          }
    
          if (this.currentElement) {
            this.currentElement.style.display = 'block';
            this.currentElement.style.backgroundColor = this.color;
    
            const randomTop = Math.floor(
              Math.random() * (document.body.offsetHeight - this.size)
            );
            const randomLeft = Math.floor(
              Math.random() * (document.body.offsetWidth - this.size)
            );
    
            this.currentElement.style.top = randomTop + 'px';
            this.currentElement.style.left = randomLeft + 'px';
          }
        }
      }
    renderChanged() {
      if (this.currentElement) {
        this.currentElement.style.backgroundColor = this.color;
      }
    }
  }
  