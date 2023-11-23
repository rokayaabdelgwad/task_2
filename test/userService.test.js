// /test/userService.test.js

const { expect } = require('chai');
const sinon = require('sinon');
const userService = require('../services/userService');
const User = require('../models/userModel');

describe('User Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should register a new user', async () => {
    const saveStub = sinon.stub(User.prototype, 'save').resolves({ username: 'newUser', password: 'hashedPassword' });
    const hashPasswordStub = sinon.stub(userService, 'hashPassword').resolves('hashedPassword');

    const result = await userService.registerUser('newUser', 'password');

    expect(result).to.deep.equal({ username: 'newUser', password: 'hashedPassword' });
    expect(saveStub.calledOnce).to.be.true;
    expect(hashPasswordStub.calledOnce).to.be.true;
  });
});
