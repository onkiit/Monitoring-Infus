var sys = require('sys');
var net = require('net');
var mqtt = require('./MQTTClient.js');

var io = require('socket.io').listen(5000);
var client = new mqtt.MQTTClient(1883, '192.168.100.9', 'ESP8266Client-');

io.sockets.on('connection', function(socket) {
    socket.on('subscribe', function(data) {
        console.log('Subscribing to ' + data.topic);
        socket.join(data.topic);
        client.subscribe(data.topic);
    });
});

client.addListener('mqttData', function(topic, payload) {
    sys.puts(topic + '=' + payload);
    io.sockets.in(topic).emit('mqtt', {
        'topic': String(topic),
        'payload': String(payload)
    });
});
