const { Kafka } = require("kafkajs")
const type = require("./models/eventType");
const dotenv = require('dotenv');

dotenv.config();
const clientId = "backend"
const brokers = ["localhost:9092"] 
const topic = "message-log"

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers })
// create a new consumer from the kafka client, and set its group ID
// the group ID helps Kafka keep track of the messages that this client
// is yet to receive
const consumer = kafka.consumer({ groupId: clientId })

const consume = async () => {
	// first, we wait for the client to connect and subscribe to the given topic
	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		// this function is called every time the consumer gets a new message
		eachMessage: ({ message }) => {
			// here, we just log the message to the standard output
			console.log(`received message: ${type.fromBuffer(message.value)}`)
		},
	})
}
 

 module.exports = consume