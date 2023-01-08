const consume = require("./consume")



// start the consumer, and log any errors
consume().catch((err) => {
	console.error("error in consumer: ", err)
})


// .\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
// .\bin\windows\kafka-server-start.bat .\config\server.properties