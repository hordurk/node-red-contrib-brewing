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
        var noble = require('noble');

        this.color = config.color;
        this.log(noble);
        node.status({text: 'Offline', fill: 'red', shape: 'dot'});

        noble.on('stateChange', function(state) {
            if (state === 'poweredOn') {
                node.status({text: 'Scanning', fill: 'green', shape: 'dot'});
                noble.startScanning(serviceUUIDs, true);
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

        // Start discovery
        // -- use either all tilt device uuids or just the selected color
        // -- set status
        // On discovery:
        // -- check if discovery has data
        // -- process data, extract SG and TEMP
        // -- convert temp to celcius
        // -- send messages
        // On error:
        // -- set status

        this.on('close', function(){
          noble.stopScanning();
        });
    }
    RED.nodes.registerType("tilt-hydrometer",TiltHydrometerNode);
}
