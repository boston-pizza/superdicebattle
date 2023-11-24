// Define dice images
const diceImages = [
    'js/dice-img/dice-1.png',
    'js/dice-img/dice-2.png',
    'js/dice-img/dice-3.png',
    'js/dice-img/dice-4.png',
    'js/dice-img/dice-5.png',
    'js/dice-img/dice-6.png',
  ];

//setting up a gameSettings object
const gameSettings = {
  rounds: 3,
  diceFaces: 6,
  rules: 'Roll two dice, and add the the numbers together. Two of a kind double your score, if any ones are rolled make your score zero.',
}

//using our gameSettings object to print game info to console
console.log(`Total rounds in the game: ${gameSettings.rounds}`);
console.log(`Rules: ${gameSettings.rules}`);
console.log(`The game is played with two d${gameSettings.diceFaces}`);

// Function to roll a single die
function rollDie() {
  return Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
}
  
let rollingInterval = null;

function rollDiceBeforeGameStarts() {
    // Clear any existing rolling interval before starting a new one
    if (rollingInterval) {
      clearInterval(rollingInterval);
      rollingInterval = null;
    }
  
    const diceElements = document.querySelectorAll('.die');
  
    rollingInterval = setInterval(() => {
      for (let i = 0; i < diceElements.length; i++) {
        const diceValue = rollDie();
        diceElements[i].src = diceImages[diceValue - 1];
        diceElements[i].alt = `Dice ${diceValue}`;
      }
    }, 216);
  }

  // Function to stop the rolling animation
  function stopRollingAnimation() {
    clearInterval(rollingInterval);
  }
  
  // Call the function to start the rolling animation before the game begins
  rollDiceBeforeGameStarts();

  // Function to simulate a dice roll
  function rollDice() {
    return [rollDie(), rollDie()]; // Return an array with two dice values
  }
  
  // Function to calculate score based on dice values
  function calculateScore(diceValues) {
    const [dice1, dice2] = diceValues;
  
    // If any of the dice is 1, score for that round is 0
    if (dice1 === 1 || dice2 === 1) {
      return 0;
    }
    
    // If it's a pair, score is the sum multiplied by 2
    if (dice1 === dice2) {
      return (dice1 + dice2) * 2;
    }
  
    // For any other combination, score is the sum of the dice values
    return dice1 + dice2;
  }
  
  // Function to update UI with dice values and scores
  function updateUI(playerDice, computerDice, playerScore, computerScore, playerTotal, computerTotal) {
    const playerDiceElements = document.querySelectorAll('.player .die');
    const computerDiceElements = document.querySelectorAll('.computer .die');
    
    // Update player's dice images
    playerDiceElements.forEach((die, index) => {
      die.src = diceImages[playerDice[index] - 1];
      die.alt = `Dice ${playerDice[index]}`;
    });
  
    // Update computer's dice images
    computerDiceElements.forEach((die, index) => {
      die.src = diceImages[computerDice[index] - 1];
      die.alt = `Dice ${computerDice[index]}`;
    });
  
    // Update scores and total scores in the UI
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
    document.getElementById('playerTotalScore').textContent = playerTotal;
    document.getElementById('computerTotalScore').textContent = computerTotal;
  }
  
  let playerTotalScore = 0;
  let computerTotalScore = 0;
  let playerRound = 0;

  function triggerAttackAnimation(imageElement, attackAnimationPath, idleAnimationPath) {
    imageElement.src = attackAnimationPath; // Change to the attack animation path
    setTimeout(() => {
      imageElement.src = idleAnimationPath; // Change to the idle animation path after a delay
    }, 2000); // Adjust the delay time as needed (in milliseconds)
  }
  
// Event listener for the roll button
document.getElementById('rollButton').addEventListener('click', function () {
  stopRollingAnimation(); // Stop rolling animation immediately when the button is clicked
  const playerImage = document.querySelector('.player-image img');
  const playerImageSrc = playerImage.src;

  if (playerRound < 3 && playerImageSrc.includes('idle.gif')) {   
    const playerDice = rollDice();
    const computerDice = rollDice();
    
    const playerScore = calculateScore(playerDice);
    const computerScore = calculateScore(computerDice);
    
    playerTotalScore += playerScore;
    computerTotalScore += computerScore;
    playerRound++;
    
    updateUI(playerDice, computerDice, playerScore, computerScore, playerTotalScore, computerTotalScore);

    // Trigger attack animation for the player with the higher score for that roll
    const playerImage = document.querySelector('.player-image img');
    const computerImage = document.querySelector('.computer-image img');
    const attackAnimationPath = "img/attack.gif";
    const idleAnimationPath = "img/idle.gif"; 
    const hitAnimationPath = "img/hit1.png";

    if (playerScore > computerScore) {
      triggerAttackAnimation(playerImage, attackAnimationPath, idleAnimationPath);
      setTimeout(function () {
        computerImage.src = hitAnimationPath;
      }, 400);
      setTimeout(function () {
        computerImage.src = idleAnimationPath; 
      }, 2100);
    } else if (computerScore > playerScore) {
      triggerAttackAnimation(computerImage, attackAnimationPath, idleAnimationPath);
      computerImage.style.left = '30px';
      setTimeout(function () {
        computerImage.style.left = '345px'; 
      }, 2000);
      setTimeout(function () {
        playerImage.src = hitAnimationPath;
      }, 400);
      setTimeout(function () {
        playerImage.src = idleAnimationPath; 
      }, 2100);
    } else {
      setTimeout(function () {
        computerImage.src = hitAnimationPath;
        playerImage.src = hitAnimationPath;
      }, 100);
      setTimeout(function () {
        computerImage.src = idleAnimationPath; 
        playerImage.src = idleAnimationPath; 
      }, 1000);

    }
  
      if (playerRound === 3) {
        // Handle game result after 3 rounds
        handleGameResult(playerTotalScore, computerTotalScore);
      }
    }
  });
  
  
  
// Function to handle game result and winner announcement
function handleGameResult(playerTotal, computerTotal) {
    let resultText = '';
    const playerImage = document.querySelector('.player-image img');
    const computerImage = document.querySelector('.computer-image img');
    const deathAnimationPath = "img/die.gif";
    const deathImagePath = "img/die.png";
    const delayBeforeDeathAnimation = 2050; // Delay in milliseconds before the death animation
    const delayBeforeDeathImage = 3250; // Delay in milliseconds before switching to the death image
  
    if (playerTotal > computerTotal) {
      resultText = 'You win!';
      // Change the computer's image to the death animation after a delay
      setTimeout(function() {
        computerImage.src = deathAnimationPath;
      }, delayBeforeDeathAnimation);

      // Switch to the last frame of the animation
      setTimeout(function() {
        computerImage.src = deathImagePath;
      }, delayBeforeDeathImage);
    } else if (playerTotal < computerTotal) {
      resultText = 'You lost!';

      // Change the player's image to the death animation after a delay
      setTimeout(function() {
        playerImage.src = deathAnimationPath;
      }, delayBeforeDeathAnimation);

      // Switch to the last frame of the animation
      setTimeout(function() {
        playerImage.src = deathImagePath;
      }, delayBeforeDeathImage);
    } else {
      resultText = 'It\'s a tie!';
    }
  
    document.getElementById('gameResult').textContent = resultText;
  }
  

// Event listener for the reset button
document.getElementById('resetButton').addEventListener('click', function () {
    playerTotalScore = 0;
    computerTotalScore = 0;
    playerRound = 0;
  
    // Reset UI elements
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';
    document.getElementById('playerTotalScore').textContent = '0';
    document.getElementById('computerTotalScore').textContent = '0';
    document.getElementById('gameResult').textContent = 'Play the game!';
  
    // Start the rolling animation immediately after resetting UI elements
    rollDiceBeforeGameStarts();
  
    // Reset player and computer images to idle state
    resetPlayerImages();
    resetComputerImages();
  });
  
  // Function to reset player image to idle state
  function resetPlayerImages() {
    const playerImage = document.querySelector('.player-image img.flippable');
    playerImage.src = 'img/idle.gif';
  }
  
  // Function to reset computer image to idle state
  function resetComputerImages() {
    const computerImage = document.querySelector('.computer-image img');
    computerImage.src = 'img/idle.gif';
  }
  
  