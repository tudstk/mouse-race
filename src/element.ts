class RandomElement {
    type: string;
    color: string;
    size: number;
    currentElement: HTMLElement | null;
  
    constructor(type: string, color: string, size: number) {
      this.type = type;
      this.color = color;
      this.size = size;
      this.currentElement = null;
    }
  
    disappear(collectedCallback: () => void, failedCallback: () => void) {
      if (this.currentElement) {
        this.currentElement.style.display = 'none';
        if (this.type === 'Collect') {
          collectedCallback();
        } else if (this.type === 'Avoid') {
          failedCallback();
        }
      }
    }
  
    changeBehavior(collectedCallback: () => void, failedCallback: () => void) {
        console.log("changing behavior");
        setTimeout(() => {
          if (this.type === 'Collect') {
            this.type = 'Avoid';
            this.color = 'Red';
          } else {
            this.type = 'Collect';
            this.color = 'Green';
          }
    
          if (this.currentElement) {
            this.render(collectedCallback, failedCallback);
          }
    
          this.changeBehavior(collectedCallback, failedCallback);
        }, 2000);
    }
    
  
    render(collectedCallback: () => void, failedCallback: () => void) {
      const elementContainer = document.body;
      if (elementContainer) {
        if (!this.currentElement) {
          const elementDiv = document.createElement('div');
          elementDiv.className = 'game-element';
          elementDiv.style.width = this.size + 'px';
          elementDiv.style.height = this.size + 'px';
          elementDiv.style.borderRadius = this.type === 'Collect' ? '50%' : '0%';
  
          elementDiv.addEventListener('click', () => {
            this.disappear(collectedCallback, failedCallback);
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
  