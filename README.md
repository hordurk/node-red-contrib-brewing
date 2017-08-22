# node-red-contrib-brewing
A collection of node-red nodes useful for controlling homebrewing processes.

## actuator-delay
Makes sure a 0/1 input has a stable value for a minimum amount of time before
passing the message through. Useful as a compressor delay for a refrigerator.

## is-stale
Monitors that messages are coming at least every X seconds. Outputs 1 if input
is stale, 0 otherwise.

## resend
Repeats input message at a configurable rate.

## temperature-control
Simple temperature control with a deadband. Has two outputs, one for heater and
one for cooler. When input temperature is > set temp + deadband, then cooler is
activated. When input temperature is < set temp - deadband, then heater is
activated. Set point can also be set via message, using topic "setpoint".

## tilt-hydrometer
Node for reading input from tilt-hydrometer. Outputs separate outputs for
temperature and specific gravity. Configurable what colors it should output
messages for. You should only create one connection object (see node settings)
for all your tilt-hydrometer nodes.

# Dependencies
The tilt-hydrometer node requires some dependencies to be installed. On debian
based systems:
    sudo apt-get -y install git bluetooth bluez libbluetooth-dev libudev-dev
