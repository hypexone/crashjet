const { Kafka } = require("kafkajs");
const type = require("./models/eventType");
const dotenv = require('dotenv');

dotenv.config();
const clientId = "backend";
const broker1 = process.env.BROKER;

const brokers = [broker1] 
const topic = process.env.TOPIC

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()

// we define an async function that writes a new message each second
const produce = async (event) => {
	await producer.connect()
	

    
	// after the produce has connected, we start an interval timer
	
		try {
			// send a message to the configured topic with
			// the key and value formed from the current value of `i`
			await producer.send({
				topic,
				messages: [
					{
						value: JSON.stringify(event),
					},
				],
			})

			console.log("writes: ", " msg sent successfully")
		
		} catch (err) {
			console.error("could not write message " + err)
		}
	
}

module.exports = produce