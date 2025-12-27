class PoemGenerator {
    constructor() {
        this.textResult = document.getElementById('textResult');
        this.userInput = document.getElementById('userInput');
        this.nextButton = document.getElementById('nextButton');
        this.counter = document.getElementById('counter');
        
        this.currentLine = 0;
        this.lines = [];
        this.isTyping = false;
        this.inputCount = 0;
        this.maxInputs = 20;
        this.sentenceStarters = [
            "I'm",
            "I'm also",
            "Sometimes I'm",
            "I can be",
            "I want to be",
            "I hope to be",
            "I like being",
            "I dream of being",
            "I am often",
            "I strive to be",
            "I feel like",
            "I consider myself",
            "Deep down, I'm",
            "At heart, I'm",
            "I wish I was",
            "I'm becoming",
            "I try to be",
            "People see me as",
            "I'm known for being",
            "I'm proud to be",
            "I'm learning to be"
        ];
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.lines.push("I'm");
        this.updateDisplay();
        
        // Event listeners
        this.userInput.addEventListener('input', (e) => {
            this.handleRealTimeInput(e.target.value);
        });
        
        this.nextButton.addEventListener('click', () => {
            this.handleNext();
        });
        
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleNext();
            }
        });
        
        // Focus on input
        this.userInput.focus();
    }
    
    getRandomSentenceStarter() {
        const randomIndex = Math.floor(Math.random() * this.sentenceStarters.length);
        return this.sentenceStarters[randomIndex];
    }
    
    handleRealTimeInput(value) {
        if (this.isTyping) return;
        
        // Get the base line without user input by finding the original sentence starter
        let baseLine = this.lines[this.currentLine];
        
        // Remove any previous user input (everything after the sentence starter)
        for (let starter of this.sentenceStarters) {
            if (baseLine.startsWith(starter)) {
                baseLine = starter;
                break;
            }
        }
        
        // Handle the initial "I'm" case
        if (baseLine.startsWith("I'm") && !baseLine.includes("also") && !baseLine.includes("becoming") && !baseLine.includes("known") && !baseLine.includes("proud") && !baseLine.includes("learning")) {
            baseLine = "I'm";
        }
        
        // Update current line with real-time input
        if (value.trim()) {
            this.lines[this.currentLine] = baseLine + ' ' + value;
        } else {
            this.lines[this.currentLine] = baseLine + '...';
        }
        
        this.updateDisplay();
    }
    
    handleNext() {
        const userValue = this.userInput.value.trim();
        if (!userValue) return;
        
        // Check if we've reached the limit
        if (this.inputCount >= this.maxInputs) return;
        
        // Finalize current line with user input
        let baseLine = this.lines[this.currentLine];
        
        // Remove any previous user input to get the clean base
        for (let starter of this.sentenceStarters) {
            if (baseLine.startsWith(starter)) {
                baseLine = starter;
                break;
            }
        }
        
        // Handle the initial "I'm" case
        if (baseLine.startsWith("I'm") && !baseLine.includes("also") && !baseLine.includes("becoming") && !baseLine.includes("known") && !baseLine.includes("proud") && !baseLine.includes("learning")) {
            baseLine = "I'm";
        }
        
        this.lines[this.currentLine] = baseLine + ' ' + userValue;
        
        // Increment input count
        this.inputCount++;
        this.updateCounter();
        
        // Check if we've reached the limit
        if (this.inputCount >= this.maxInputs) {
            // Finalize the poem and trigger download
            this.finalizePoemAndDownload();
            return;
        }
        
        // Move to next line with a random sentence starter
        this.currentLine++;
        const randomStarter = this.getRandomSentenceStarter();
        this.lines.push(randomStarter);
        
        // Clear input and update display immediately
        this.userInput.value = '';
        this.updateDisplay();
        
        // Focus back on input
        this.userInput.focus();
    }
    
    updateDisplay() {
        // Join all lines and add the current typing indicator
        let displayText = this.lines.join('\n');
        
        // Add ellipsis to the current line if it's a sentence starter without user input
        const currentLine = this.lines[this.currentLine];
        if (currentLine) {
            const isBaseSentenceStarter = this.sentenceStarters.includes(currentLine) || currentLine === "I'm";
            if (isBaseSentenceStarter) {
                displayText += '...';
            } else if (currentLine === "I'm") {
                displayText = displayText.replace(/I'm$/, "I'm...");
            }
        }
        
        this.textResult.textContent = displayText;
        
        // Add typing effect to current line
        this.addTypingEffect();
    }
    
    addTypingEffect() {
        // Remove existing typing effect
        this.textResult.classList.remove('typing-effect');
        
        // Add typing effect with a small delay
        setTimeout(() => {
            this.textResult.classList.add('typing-effect');
        }, 50);
        
        // Remove typing effect after 3 seconds
        setTimeout(() => {
            this.textResult.classList.remove('typing-effect');
        }, 3000);
    }
    
    updateCounter() {
        this.counter.textContent = `${this.inputCount}/20`;
        
        // Update button text when nearing limit
        if (this.inputCount >= this.maxInputs) {
            this.nextButton.textContent = 'Done';
            this.nextButton.disabled = true;
            this.userInput.disabled = true;
        }
    }
    
    finalizePoemAndDownload() {
        // Remove the ellipsis from the last line if present
        let finalPoem = this.lines.slice(0, this.inputCount).join('\n');
        
        // Create a blob with the poem text
        const blob = new Blob([finalPoem], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary download link and trigger it
        const a = document.createElement('a');
        a.href = url;
        a.download = 'poem-of-yourself.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Update display to show final poem without ellipsis
        this.textResult.textContent = finalPoem;
        
        // Disable inputs
        this.nextButton.disabled = true;
        this.userInput.disabled = true;
    }
    
    // Method to simulate typing animation (optional enhancement)
    typeText(text, element, speed = 50) {
        this.isTyping = true;
        element.textContent = '';
        let i = 0;
        
        const typeChar = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            } else {
                this.isTyping = false;
            }
        };
        
        typeChar();
    }
}

// Grammar rules for context-free grammar (future expansion)
class ContextFreeGrammar {
    constructor() {
        this.rules = {
            'S': [
                "I'm ADJECTIVE",
                "I'm also ADJECTIVE", 
                "I'm NOUN",
                "I'm also NOUN"
            ],
            'ADJECTIVE': [
                'happy', 'sad', 'creative', 'thoughtful', 'curious', 
                'passionate', 'determined', 'gentle', 'strong', 'kind'
            ],
            'NOUN': [
                'a dreamer', 'a thinker', 'a creator', 'a student', 'a teacher',
                'a friend', 'a person', 'a soul', 'a human', 'someone'
            ]
        };
    }
    
    // Method to generate suggestions (future feature)
    getSuggestions(category = 'ADJECTIVE') {
        return this.rules[category] || [];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PoemGenerator();
});
