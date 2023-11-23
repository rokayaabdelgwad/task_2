// /test/fileService.test.js

const { expect } = require('chai');
const sinon = require('sinon');
const fileService = require('../services/fileService');
const File = require('../models/fileModel');

describe('File Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should upload a file and save information to the database', async () => {
    const saveStub = sinon.stub(File.prototype, 'save').resolves({ user: 'userId', room: 'roomId', filename: 'file.txt', path: '/uploads/file.txt' });

    const result = await fileService.uploadFile('userId', 'roomId', { originalname: 'file.txt', buffer: Buffer.from('file content') });

    expect(result).to.deep.equal({ user: 'userId', room: 'roomId', filename: 'file.txt', path: '/uploads/file.txt' });
    expect(saveStub.calledOnce).to.be.true;
  });
});
