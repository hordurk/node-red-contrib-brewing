module.exports = function(RED) {
    function IsStaleNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.maxAge = Number(config.maxAge) * 1000;
        this.dt = Math.min(this.maxAge / 10, 100);
        this.lastReceive = 0;
        this.lastOutput = undefined;

        node.on('input', function(msg) {
          node.lastReceive = Date.now();
        });

        this.interval = setInterval(function() {

          var stale = (Date.now() - node.lastReceive > node.maxAge);

          if (stale !== node.lastOutput) {
            node.status({fill: stale ? 'red' : 'green'});
            node.send({payload: stale});
            node.lastOutput = stale;
          }

        }, this.dt);

        this.on('close', function(){
          if(node.interval) {
            clearInterval(node.interval);
          }
        });
    }
    RED.nodes.registerType("is-stale",IsStaleNode);
}
