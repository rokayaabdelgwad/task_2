  // Add more message handling tests as needed
// /test/messageService.test.js

const { expect } = require('chai');
const sinon = require('sinon');
const messageService = require('../services/messageService');
const Message = require('../models/messageModel');

describe('Message Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should save a message to the database', async () => {
    const saveStub = sinon.stub(Message.prototype, 'save').resolves({ text: 'Hello', user: 'userId', room: 'roomId' });

    const result = await messageService.saveMessage('Hello', 'userId', 'roomId');

    expect(result).to.deep.equal({ text: 'Hello', user: 'userId', room: 'roomId' });
    expect(saveStub.calledOnce).to.be.true;
  });
});
