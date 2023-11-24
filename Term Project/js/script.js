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

//making a function to play our background music
function playBackgroundMusic(){
  bgm.play();
}
//calling it
playBackgroundMusic();

// Function to roll a single die
function rollDie() {
return Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
}

//setting rollingInterval to null
let rollingInterval = null;
// Function to simulate rolling dice before the game starts
function rollDiceBeforeGameStarts() {
  // Clear any existing rolling interval before starting a new one
  if (rollingInterval) {
    clearInterval(rollingInterval); // Clear the interval if it exists
    rollingInterval = null; // Reset the rolling interval variable
  }

  const diceElements = document.querySelectorAll('.die'); // Get all elements representing dice

  // Set an interval to simulate rolling dice animation
  rollingInterval = setInterval(() => {
    for (let i = 0; i < diceElements.length; i++) {
      const diceValue = rollDie(); // Simulate a dice roll
      diceElements[i].src = diceImages[diceValue - 1]; // Set the image for the rolled dice value
      diceElements[i].alt = `Dice ${diceValue}`; // Set the alt text for accessibility
    }
  }, 216); // Set the interval time for the rolling animation in milliseconds
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

// Function to trigger attack animation and play corresponding sound
function triggerAttackAnimation(imageElement, attackAnimationPath, idleAnimationPath) {
  const hitSound = document.getElementById('hit'); // Get the 'hit' audio element

  imageElement.src = attackAnimationPath; // Change the image to the attack animation path
  hitSound.play(); // Play the 'hit' sound

  // Set a timeout to change the image back to the idle animation path after a delay
  setTimeout(() => {
    imageElement.src = idleAnimationPath; // Change to the idle animation path
  }, 2000); // Adjust the delay time as needed (in milliseconds)
}

// Event listener for the roll button
document.getElementById('rollButton').addEventListener('click', function () {
  stopRollingAnimation(); // Stop rolling animation immediately when the button is clicked

  const playerImage = document.querySelector('.player-image img');
  const playerImageSrc = playerImage.src;

  // Check conditions to proceed with the game logic
  if (playerRound < 3 && playerImageSrc.includes('idle.gif')) {   
    const playerDice = rollDice(); // Roll dice for the player
    const computerDice = rollDice(); // Roll dice for the computer
    
    // Calculate scores for the player and computer based on the rolled dice
    const playerScore = calculateScore(playerDice);
    const computerScore = calculateScore(computerDice);
    
    // Update total scores for both the player and computer
    playerTotalScore += playerScore;
    computerTotalScore += computerScore;
    playerRound++; // Increment the round counter
  
    // Update the UI with dice values, scores, and total scores
    updateUI(playerDice, computerDice, playerScore, computerScore, playerTotalScore, computerTotalScore);

    // Get player and computer images and define animation paths
    const playerImage = document.querySelector('.player-image img');
    const computerImage = document.querySelector('.computer-image img');
    const attackAnimationPath = "img/attack.gif";
    const idleAnimationPath = "img/idle.gif"; 
    const hitAnimationPath = "img/hit1.png";
    const scuffSound = document.getElementById('scuff');

    // Determine and execute attack animations based on scores
    if (playerScore > computerScore) {
      triggerAttackAnimation(playerImage, attackAnimationPath, idleAnimationPath); // Trigger player attack animation
      setTimeout(function () {
        computerImage.src = hitAnimationPath; // Set computer image to the hit animation
      }, 400);
      setTimeout(function () {
        computerImage.src = idleAnimationPath; // Set computer image to the idle animation after a delay
      }, 2100);
    } else if (computerScore > playerScore) {
      triggerAttackAnimation(computerImage, attackAnimationPath, idleAnimationPath); // Trigger computer attack animation
      computerImage.style.left = '30px'; // Move computer image left
      setTimeout(function () {
        computerImage.style.left = '345px'; // Move computer image back to the initial position after a delay
      }, 2000);
      setTimeout(function () {
        playerImage.src = hitAnimationPath; // Set player image to the hit animation
      }, 400);
      setTimeout(function () {
        playerImage.src = idleAnimationPath; // Set player image to the idle animation after a delay
      }, 2100);
    } else {
      // Execute tie scenario animations for both player and computer
      setTimeout(function () {
        computerImage.src = hitAnimationPath;
        playerImage.src = hitAnimationPath;
      }, 100);
      setTimeout(function () {
        computerImage.src = idleAnimationPath; 
        playerImage.src = idleAnimationPath; 
      }, 1000);
      scuffSound.play(); // Play the 'scuff' sound for the tie scenario

    }

    if (playerRound === 3) {
      // Handle game result after 3 rounds
      handleGameResult(playerTotalScore, computerTotalScore);
    }
  }
});




// Function to handle game result and winner announcement
function handleGameResult(playerTotal, computerTotal) {
  let resultText = ''; // Variable to store the result text to be displayed
  const playerImage = document.querySelector('.player-image img'); // Get the player's image element
  const computerImage = document.querySelector('.computer-image img'); // Get the computer's image element
  const deathAnimationPath = "img/die.gif"; // Path to the death animation image
  const deathImagePath = "img/die.png"; // Path to the last frame of the death animation
  const delayBeforeDeathAnimation = 2050; // Delay before changing to death animation (in milliseconds)
  const delayBeforeDeathImage = 3250; // Delay before switching to the last frame of death animation (in milliseconds)
  
  // Get audio elements for different game outcomes
  const winSound = document.getElementById('win');
  const loseSound = document.getElementById('lose');
  const tieSound = document.getElementById('tie');

  if (playerTotal > computerTotal) {
    resultText = 'You win!'; // Set result text for player win
    
    // Change the computer's image to the death animation after a delay and play win sound
    setTimeout(function() {
      computerImage.src = deathAnimationPath;
      winSound.play(); // Play the 'win' sound
    }, delayBeforeDeathAnimation);

    // Switch to the last frame of the animation
    setTimeout(function() {
      computerImage.src = deathImagePath;
    }, delayBeforeDeathImage);
  } else if (playerTotal < computerTotal) {
    resultText = 'You lost!'; // Set result text for player loss

    // Change the player's image to the death animation after a delay and play lose sound
    setTimeout(function() {
      playerImage.src = deathAnimationPath;
      loseSound.play(); // Play the 'lose' sound
    }, delayBeforeDeathAnimation);

    // Switch to the last frame of the animation
    setTimeout(function() {
      playerImage.src = deathImagePath;
    }, delayBeforeDeathImage);
  } else {
    resultText = 'It\'s a tie!'; // Set result text for a tie game
    
    // Play tie sound after a delay
    setTimeout(function() {
      tieSound.play(); // Play the 'tie' sound
    }, 2000); // Adjust the delay time as needed (in milliseconds)
  }

  document.getElementById('gameResult').textContent = resultText; // Update the UI with the game result
}



// Event listener for the reset button
document.getElementById('resetButton').addEventListener('click', function () {
  playerTotalScore = 0; // Reset player's total score
  computerTotalScore = 0; // Reset computer's total score
  playerRound = 0; // Reset the round counter

  // Reset UI elements to initial values
  document.getElementById('playerScore').textContent = '0'; // Set player's current score to 0
  document.getElementById('computerScore').textContent = '0'; // Set computer's current score to 0
  document.getElementById('playerTotalScore').textContent = '0'; // Set player's total score to 0
  document.getElementById('computerTotalScore').textContent = '0'; // Set computer's total score to 0
  document.getElementById('gameResult').textContent = 'Play the game!'; // Update game result text

  // Start the rolling animation immediately after resetting UI elements
  rollDiceBeforeGameStarts(); // Start rolling animation for the game

  // Reset player and computer images to idle state
  resetPlayerImages(); // Reset player's image to idle state
  resetComputerImages(); // Reset computer's image to idle state
});

// Function to reset player image to idle state
function resetPlayerImages() {
  const playerImage = document.querySelector('.player-image img.flippable'); // Get player's image element
  playerImage.src = 'img/idle.gif'; // Set player's image to idle state
}

// Function to reset computer image to idle state
function resetComputerImages() {
  const computerImage = document.querySelector('.computer-image img'); // Get computer's image element
  computerImage.src = 'img/idle.gif'; // Set computer's image to idle state
}
