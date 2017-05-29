module.exports = function(RED) {
    function TemperatureControlNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.setPointTopic = config.setPointTopic;
        this.deadBandTopic = config.deadBandTopic;

        this.setPoint = config.setPoint;
        this.deadBand = config.deadBand;

        this.meas = undefined;

        this.disabled = false;

        var context = this.context();

        node.on('input', function(msg) {
          if(msg.topic && msg.topic === 'setpoint') {
            node.log('Setpoint '+msg.payload);
            node.setPoint = Number(msg.payload);
          } else if(msg.topic && msg.topic === 'deadband') {
            node.deadBand = Number(msg.payload);
          } else if(msg.topic && msg.topic === 'disable') {
            node.disabled = msg.payload;
          } else {
            node.meas = Number(msg.payload);
          }
          node.log('setPoint: '+node.setPoint);

          if (node.setPoint === undefined) {
            node.status({text: 'Invalid set point', fill: 'red', shape: 'dot'});
          } else if (node.meas === undefined) {
            node.status({text: 'Invalid temp', fill: 'red', shape: 'dot'});
          } else {
            var err = node.setPoint - node.meas;
            var cool, heat;
            if (node.disabled) {
              cool = heat = false;
              node.status({text: 'Disabled', fill: 'yellow', shape: 'dot'});
            } else {
              cool = (node.meas > Number(node.setPoint) + Number(node.deadBand));
              heat = (node.meas < Number(node.setPoint) + Number(node.deadBand));
              node.status({text: 'e='+err+' sp='+node.setPoint, fill: 'green', shape: 'dot'});
            }


            node.send([{payload: heat ? 1 : 0}, {payload: cool ? 1 : 0}]);
          }

        });
    }
    RED.nodes.registerType("temperature-control",TemperatureControlNode);
}
