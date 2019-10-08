var express = require("express");
bodyParser = require("body-parser");
app = express();

var routes = require("./cms/app/crm");
app.use(express.static(__dirname));
console.log(__dirname);
app.listen(8081, function() {
  console.log("Example app listening on port 8081!");
});
