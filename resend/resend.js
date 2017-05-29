module.exports = function(RED) {
    function RepeatNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.rate = 1000.0/Number(config.rate);

        this.lastMessage = undefined;
        this.lastSend = 0;
        this.counter = 0;

        node.status({text: 'No message received', fill: 'red', shape: 'dot'});

        node.on('input', function(msg) {
          node.lastMessage = msg;
          node.counter = 0;
        });

        this.interval = setInterval(function() {
          //var t = Date.now();

          //var dt = t - node.lastSend;
          // dt > node.rate &&

          if (node.lastMessage !== undefined) {
            node.send(node.lastMessage);
            node.counter++;
            node.status({text: 'Message sent: '+node.counter, fill: 'green', shape: 'dot'});
          }
        }, this.rate);

        this.on('close', function(){
          if(node.interval) {
            clearInterval(node.interval);
          }
        });
    }
    RED.nodes.registerType("message-repeater",RepeatNode);
}
