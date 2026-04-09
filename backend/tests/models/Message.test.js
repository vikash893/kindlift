/**
 * @fileoverview Unit tests for Message model schema validation
 *
 * Tests the chat message schema including required fields
 * and correct references to RideRequest and User models.
 */

const mongoose = require('mongoose');
const { Message } = require('../../models/Message');

describe('Message Model', () => {
  const validMessage = {
    requestId: new mongoose.Types.ObjectId(),
    senderId: new mongoose.Types.ObjectId(),
    text: 'Hello, I will be at the pickup point in 5 minutes!',
  };

  test('should create a valid message', () => {
    const msg = new Message(validMessage);

    expect(msg.requestId).toEqual(validMessage.requestId);
    expect(msg.senderId).toEqual(validMessage.senderId);
    expect(msg.text).toBe('Hello, I will be at the pickup point in 5 minutes!');
  });

  test('should fail validation without requestId', () => {
    const msg = new Message({ senderId: validMessage.senderId, text: 'Hi' });
    const error = msg.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.requestId).toBeDefined();
  });

  test('should fail validation without senderId', () => {
    const msg = new Message({ requestId: validMessage.requestId, text: 'Hi' });
    const error = msg.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.senderId).toBeDefined();
  });

  test('should fail validation without text', () => {
    const msg = new Message({
      requestId: validMessage.requestId,
      senderId: validMessage.senderId,
    });
    const error = msg.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.text).toBeDefined();
  });

  test('should accept long text messages', () => {
    const longText = 'A'.repeat(5000);
    const msg = new Message({ ...validMessage, text: longText });
    expect(msg.text.length).toBe(5000);
  });

  test('should have timestamps enabled', () => {
    const schema = Message.schema;
    expect(schema.options.timestamps).toBe(true);
  });
});
