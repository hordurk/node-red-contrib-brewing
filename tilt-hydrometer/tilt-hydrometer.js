module.exports = function(RED) {
    function TiltHydrometerNode(config) {

        var serviceUUIDs = [
                            "a495bb10c5b14b44b5121370f02d74de",
                            "a495bb20c5b14b44b5121370f02d74de",
                            "a495bb30c5b14b44b5121370f02d74de",
                            "a495bb40c5b14b44b5121370f02d74de",
                            "a495bb50c5b14b44b5121370f02d74de",
                            "a495bb60c5b14b44b5121370f02d74de",
                            "a495bb70c5b14b44b5121370f02d74de",
                            "a495bb80c5b14b44b5121370f02d74de",
                            "a495ff10c5b14b44b5121370f02d74de"
                          ];
        RED.nodes.createNode(this,config);
        var node = this;
        this.color = config.color;

        node.status({text: 'Offline', fill: 'red', shape: 'dot'});

        var noble = require('noble');

        function startScan() {
          node.status({text: 'Scanning', fill: 'green', shape: 'dot'});
          noble.startScanning(serviceUUIDs, true);
        }

        this.on('close', function(){
          noble.stopScanning();
          noble.removeAllListeners();
        });

        noble.on('stateChange', function(state) {
            if (state === 'poweredOn') {
                startScan();
            } else {
                noble.stopScanning();
            }
        });

        noble.on('discover', function(peripheral) {
            if (peripheral.advertisement.manufacturerData) {
                var temp = (peripheral.advertisement.manufacturerData[20]*256+peripheral.advertisement.manufacturerData[21] - 32)/1.8;
                var sg = (peripheral.advertisement.manufacturerData[22]*256+peripheral.advertisement.manufacturerData[23])/1000.0;
                node.send([{payload: temp}, {payload: sg}]);
            }
        });

        if(noble.state==='poweredOn') {
          startScan();
        }


    }
    RED.nodes.registerType("tilt-hydrometer",TiltHydrometerNode);
}
