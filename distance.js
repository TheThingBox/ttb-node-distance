module.exports = function(RED) {

  function DistanceNode(n) {
    RED.nodes.createNode(this,n);

    this.latitude = n.latitude;
    this.longitude = n.longitude;
    this.gpsType = n.gpsType;

    var lat1 = this.latitude;
    var lng1 = this.longitude;

    if(this.gpsType == "DMS") {

      lat1 = GestDMS(this.latitude);
      lng1 = GestDMS(this.longitude);
    }

    this.on("input", function(msg) {
      var lat2 = msg.payload.latitude;
      var lng2 = msg.payload.longitude;

      msg.payload = 6366*(Math.acos(Math.sin(lat1*Math.PI/180)*Math.sin(lat2*Math.PI/180)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.cos((lng1*Math.PI/180)-(lng2*Math.PI/180))));

      msg.payload = msg.payload.toFixed(2);

      this.send(msg);
    });
  }
  RED.nodes.registerType("distance",DistanceNode);

  function GestDMS (coordinates) {
    var coord = coordinates.split(" ");
    var sign_co = coord[0];
    var flat_co = 0;

    if(sign_co == "-")
      flat_co = 1;

    var dco = coord[0+flat_co].substr(0,2);
    var mco = coord[1+flat_co].substr(0,2);
    var sco = coord[2+flat_co].substr(0,2);

    var co = parseInt(dco) + parseInt(mco)/60 + parseInt(sco)/3600;

    if(flat_co)
      co = -co;

    return co;
  }
}
