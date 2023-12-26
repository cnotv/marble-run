import * as dat from 'dat.gui';

const canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

function drawSquare(ctx, x, y, width, height) {
  // Calculate the new dimensions for the smaller square
  const squareSize = Math.min(width, height) / 2;

  // Calculate the new position for the smaller square
  const squareX = x + width / 4;
  const squareY = y + height / 4;

  // Draw the smaller square
  ctx.fillStyle = 'white'; // Set the fill color to white
  ctx.fillRect(squareX, squareY, squareSize, squareSize);
}

// Functions to draw the icons
function drawCircle(ctx, x, y, width, height) {
  // Calculate the new radius for the smaller circle
  const radius = Math.min(width, height) / 4;

  // Calculate the new center for the smaller circle
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  // Draw the smaller circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white'; // Set the fill color to white
  ctx.fill();
}

function drawCreateBars(ctx, x, y, width, height) {
    // Calculate the new dimensions for the smaller rectangle
  const barWidth = width / 2;
  const barHeight = height / 2;

  // Calculate the new position for the smaller rectangle
  const barX = x + width / 4;
  const barY = y + height / 4;

  // Draw the smaller rectangle
  ctx.fillStyle = 'white'; // Set the fill color to white
  ctx.fillRect(barX, barY, barWidth, barHeight);
}

function drawLine(ctx, x, y, width, height) {
  // Calculate the new start and end points for the lines
  const startX = x + width / 4;
  const startY = y + height / 4;
  const endX = x + (width * 3) / 4;
  const endY = y + (height * 3) / 4;

  // Draw the first line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = 'white'; // Set the stroke color to white
  ctx.lineWidth = 4; // Set the stroke width to 4px
  ctx.stroke();

  // Draw the second line
  ctx.beginPath();
  ctx.moveTo(endX, startY);
  ctx.lineTo(startX, endY);
  ctx.strokeStyle = 'white'; // Set the stroke color to white
  ctx.lineWidth = 4; // Set the stroke width to 4px
  ctx.stroke();
}

// Define the icons
const icons = [
  { id: 'moveBalls', draw: drawCircle, x: 10, y: 10, width: 30, height: 30 },
  { id: 'createBars', draw: drawCreateBars, x: 10, y: 50, width: 30, height: 30 },
  { id: 'deleteBars', draw: drawLine, x: 10, y: 90, width: 30, height: 30 },
];

// Define Ball and Bar
const Ball = (x, y, dx, dy, radius, gravity) => ({ x, y, dx, dy, radius, gravity });
const Bar = (x, y, width, height) => ({ x, y, width, height });

// Create a settings object with a gravity property
const settings = {
  gravity: 0.4,
  friction: 0.5,
  cursorState: 'default', // default, moveBalls, createBars, deleteBars
  selectedBall: null
};

// Create balls and bars
let balls = [
  Ball(window.innerWidth/2, window.innerHeight/2, 5, 5, 50, 0.1),
  Ball(window.innerWidth/2, window.innerHeight/2, -5, -5, 50, 0.1),
  // Add more balls as needed
];

let bars = [
  Bar(50, 50, 30, 300),
  Bar(200, 200, 300, 30),
  // Add more bars as needed
];

// Handle click events on the canvas
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const width = 100; // Set the width of the bar
  const height = 30; // Set the height of the bar

  // Check if any of the icons were clicked
  icons.forEach(icon => {
    if (x >= icon.x && x <= icon.x + icon.width && y >= icon.y && y <= icon.y + icon.height) {
      // If the icon was clicked, change the cursorState to the id of the icon
      settings.cursorState = icon.id;
    }
  });

  switch (settings.cursorState) {
    case 'moveBalls':
      // Check if any of the balls were clicked
      balls.forEach(ball => {
        const distance = Math.hypot(ball.x - x, ball.y - y);
        if (distance - ball.radius < 1) {
          // If the ball was clicked, set it as the selected ball
          settings.selectedBall = ball;
        }
      });
      break;
    case 'deleteBars':
      // Check if any of the bars were clicked
      bars = bars.filter(bar => {
        return !(x >= bar.x && x <= bar.x + bar.width && y >= bar.y && y <= bar.y + bar.height);
      });
      break;
    case 'createBars':
      const newBar = Bar(x, y, width, height);
      bars.push(newBar);
      break;
    default:
      // Handle any other cursorState values
      break;
  }
});

let originalBallVelocity = null;

const moveBallWithCursor = (event) => {
  if (settings.selectedBall) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Move the selected ball with the cursor
    settings.selectedBall.x = x;
    settings.selectedBall.y = y;
  }
};

canvas.addEventListener('mousedown', (event) => {
  if (settings.cursorState === 'moveBalls') {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if any of the balls were clicked
    balls.forEach(ball => {
      const distance = Math.hypot(ball.x - x, ball.y - y);
      if (distance - ball.radius < 1) {
        // If the ball was clicked, set it as the selected ball
        settings.selectedBall = ball;

        // Store the original velocity of the ball and stop its movement
        originalBallVelocity = { dx: ball.dx, dy: ball.dy };
        ball.dx = 0;
        ball.dy = 0;

        // Add the mousemove event listener to move the ball with the cursor
        canvas.addEventListener('mousemove', moveBallWithCursor);
      }
    });
  }
});

canvas.addEventListener('mouseup', (event) => {
  if (settings.cursorState === 'moveBalls' && settings.selectedBall) {
    // Restore the original velocity of the ball
    settings.selectedBall.dx = originalBallVelocity.dx;
    settings.selectedBall.dy = originalBallVelocity.dy;

    // Clear the selected ball
    settings.selectedBall = null;
    originalBallVelocity = null;

    // Remove the mousemove event listener
    canvas.removeEventListener('mousemove', moveBallWithCursor);
  }
});

// Function to handle collisions with bars
const handleBarCollisions = (ball, bars) => {
  bars.forEach(bar => {
    // Check if the ball has collided with the bar
    if (ball.x + ball.radius > bar.x && ball.x - ball.radius < bar.x + bar.width &&
        ball.y + ball.radius > bar.y && ball.y - ball.radius < bar.y + bar.height) {
      // If the ball hit the top or bottom of the bar, reverse the y velocity
      if (ball.y - ball.radius < bar.y || ball.y + ball.radius > bar.y + bar.height) {
        ball.dy = -ball.dy;
      }
      // If the ball hit the left or right side of the bar, reverse the x velocity
      else if (ball.x - ball.radius < bar.x || ball.x + ball.radius > bar.x + bar.width) {
        ball.dx = -ball.dx;
      }
    }
  });
};

const drawBall = (ball) => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
};

const drawBar = (bar, ctx) => {
  ctx.beginPath();
  ctx.rect(bar.x, bar.y, bar.width, bar.height);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
};

const detectCollision = (ball, otherBall) => {
  const dx = ball.x - otherBall.x;
  const dy = ball.y - otherBall.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < ball.radius + otherBall.radius;
};

const calculateVelocity = (u1, u2, m1, m2) => {
  return {
    x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
    y: u1.y
  };
};

const resolveCollision = (ball, otherBall) => {
  const xVelocityDiff = ball.dx - otherBall.dx;
  const yVelocityDiff = ball.dy - otherBall.dy;

  const xDist = otherBall.x - ball.x;
  const yDist = otherBall.y - ball.y;

  // Prevent accidental overlap of balls
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

    // Grab angle between the two colliding balls
    const angle = -Math.atan2(otherBall.y - ball.y, otherBall.x - ball.x);

    // Store mass in var for better readability in collision equation
    const m1 = ball.radius; // we are assuming mass is proportional to the radius
    const m2 = otherBall.radius;

    // Velocity before equation
    const u1 = rotate(ball.dx, ball.dy, angle);
    const u2 = rotate(otherBall.dx, otherBall.dy, angle);

    // Velocity after 1d collision equation
    const v1 = calculateVelocity(u1, u2, m1, m2);
    const v2 = calculateVelocity(u2, u1, m2, m1);

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1.x, v1.y, -angle);
    const vFinal2 = rotate(v2.x, v2.y, -angle);

    // Swap ball velocities for realistic bounce effect
    ball.dx = vFinal1.x;
    ball.dy = vFinal1.y;

    otherBall.dx = vFinal2.x;
    otherBall.dy = vFinal2.y;
  }
};

const rotate = (dx, dy, angle) => {
  return {
    x: dx * Math.cos(angle) - dy * Math.sin(angle),
    y: dx * Math.sin(angle) + dy * Math.cos(angle)
  };
};

// Function to update ball position
const updateBall = (ball) => {
  // Check for collision with window edges and reverse direction if necessary
  if (ball.x + ball.dx < ball.radius || ball.x + ball.dx > window.innerWidth - ball.radius) {
    ball.dx = -ball.dx * settings.friction;
  }
  if (ball.y + ball.dy < ball.radius || ball.y + ball.dy > window.innerHeight - ball.radius) {
    ball.dy = -ball.dy * settings.friction;
  }
  // Update position
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Apply gravity
  ball.dy += settings.gravity;
  return ball;
};

// Main draw function
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the icons
  icons.forEach(icon => {
    icon.draw(ctx, icon.x, icon.y, icon.width, icon.height);
  
    // If the icon is selected, draw a red square stroke around it
    if (settings.cursorState === icon.id) {
      ctx.strokeStyle = 'red'; // Set the stroke color to red
      ctx.lineWidth = 2; // Set the line width to 2 pixels
      ctx.strokeRect(icon.x, icon.y, icon.width, icon.height);
    } else {
      // If the icon is not selected, draw a white square stroke around it
      ctx.strokeStyle = 'white'; // Set the stroke color to white
      ctx.lineWidth = 2; // Set the line width to 2 pixels
      ctx.strokeRect(icon.x, icon.y, icon.width, icon.height);
    }
  });
    
  for (let i = 0; i < balls.length; i++) {
    drawBall(balls[i]);
    updateBall(balls[i]);

    // Handle collisions with bars
    handleBarCollisions(balls[i], bars);

    // Check for collisions with other balls
    for (let j = i + 1; j < balls.length; j++) {
      if (detectCollision(balls[i], balls[j])) {
        resolveCollision(balls[i], balls[j]);
      }
    }
  }

  bars.forEach(bar => drawBar(bar, ctx));
};

setInterval(draw, 10);

balls.forEach((ball, index) => {
  let gui = new dat.GUI({ name: `Ball ${index + 1}` });
  gui.add(ball, 'radius', 50, 300).onChange(draw);
  gui.add(ball, 'dx', -10, 10).onChange(draw);
  gui.add(ball, 'dy', -10, 10).onChange(draw);
});

let gui = new dat.GUI({ name: `Settings` });
gui.add(settings, 'gravity', -1, 1).onChange(draw);
gui.add(settings, 'friction', 0, 1).onChange(draw);