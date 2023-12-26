require('dotenv').config();
const amqp = require('amqplib');
let channel, connection;

const exchangeName = 'notifications-exchange';
const exchangeType = 'fanout';

const connectQueue = async () => {
  try {
    connection = await amqp.connect(process.env.AMQP_URL || 'amqp://localhost:5672');
    channel = await connection.createChannel();

    process.once('SIGINT', async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertExchange(exchangeName, exchangeType, {
      durable: false
    });
  } catch (error) {
    console.log(error);
  }
};

const sendMessageToQueue = async (message) => {
  const queueName = 'notification-queue';
  await channel.publish(
    exchangeName,
    queueName,
    Buffer.from(message)
  );
};

module.exports = { connectQueue, sendMessageToQueue };
