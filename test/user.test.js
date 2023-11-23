
const { expect } = require('chai');
const sinon = require('sinon');
const userService = require('../services/userService');
const User = require('../models/userModel');

describe('User Interaction', () => {
  it('should register a new user', async () => {
    const saveStub = sinon.stub(User.prototype, 'save').resolves({ username: 'newUser', password: 'hashedPassword' });

    const result = await userService.registerUser('newUser', 'password');

    expect(result).to.deep.equal({ username: 'newUser', password: 'hashedPassword' });
    expect(saveStub.calledOnce).to.be.true;

    saveStub.restore();
  });

  // Add more user interaction tests as needed
});
