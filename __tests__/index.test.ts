// Assuming that the updateBall function is exported from a module named 'ball'
const { updateBall } = require('../public/index');

describe('updateBall', () => {
  it('should reverse x velocity and apply friction when ball hits left or right edge', () => {
    const ball = {
      x: 95,
      y: 50,
      dx: 5,
      dy: 0,
      radius: 10,
    };

    const item = {
      leftEdge: 0,
      rightEdge: 100,
      topEdge: 0,
      bottomEdge: 100,
    };

    updateBall(ball, item);

    // Check that the ball's x velocity has been reversed
    expect(ball.dx).toBe(-5);
  });

  it('should reverse y velocity when ball hits top or bottom edge', () => {
    const ball = {
      x: 50,
      y: 95,
      dx: 0,
      dy: 5,
      radius: 10,
    };

    const item = {
      leftEdge: 0,
      rightEdge: 100,
      topEdge: 0,
      bottomEdge: 100,
    };

    updateBall(ball, item);

    // Check that the ball's y velocity has been reversed
    expect(ball.dy).toBe(-5);
  });

  it('should update ball position based on its velocity', () => {
    const ball = {
      x: 50,
      y: 50,
      dx: 5,
      dy: 5,
      radius: 10,
    };

    const item = {
      leftEdge: 0,
      rightEdge: 100,
      topEdge: 0,
      bottomEdge: 100,
    };

    updateBall(ball, item);

    // Check that the ball's position has been updated
    expect(ball.x).toBe(55);
    expect(ball.y).toBe(55);
  });
});