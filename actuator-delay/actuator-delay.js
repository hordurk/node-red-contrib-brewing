module.exports = function(RED) {
    function ActuatorDelayNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.delay = config.delay * 1000;
        this.delayOn = true; //config.delayOn;
        this.delayOff = false; //config.delayOff;

        this.lastMeasurement = undefined;
        this.lastMeasurementTime = 0;
        this.lastChange = 0;
        this.lastOutput = undefined;

        this.dt = 1000;

        node.on('input', function(msg) {
          var m = Number(msg.payload);

          if (m!==node.lastMeasurement) {
            node.lastChange = Date.now();
          }

          node.lastMeasurement = m;
          node.lastMeasurementTime = Date.now();
        });

        this.interval = setInterval(function() {
          var t = Date.now();

          var statusText = ' ';
          var statusColor = 'red';
          var statusOk = false;

          var output = undefined;

          if ((node.delayOn && node.lastMeasurement === 1) || (node.delayOff && node.lastMeasurement === 0)) {
            var dt = t - node.lastChange;
            if (dt >= node.delay) {
              output = node.lastMeasurement;
              statusText = ' ';
              statusOk = true;
            } else {
              statusText = 'Delay remaining: ' + Math.round((node.delay - dt)/1000);
              statusOk = false;
            }
          } else if(node.lastMeasurement !== node.lastOutput) {
            output = node.lastMeasurement;
          }

          if (output!==undefined) {
            node.send({payload: output});
            node.lastOutput = output;
          }

          node.status({text: statusText, fill: statusOk ? 'green' : 'yellow', shape: statusOk ? 'dot' : 'ring'});

        }, this.dt);

        this.on('close', function(){
          if(node.interval) {
            clearInterval(node.interval);
          }
        });
    }
    RED.nodes.registerType("actuator-delay",ActuatorDelayNode);
}
