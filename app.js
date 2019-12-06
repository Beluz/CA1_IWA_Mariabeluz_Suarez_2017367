var http = require('http'),
    path = require('path'),
    express = require('express'),
    fs = require('fs'),  
    xmlParse = require('xslt-processor').xmlParse,
    xsltProcess = require('xslt-processor').xsltProcess,
    xml2js = require('xml2js');

var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'views')));
router.use(express.urlencoded({extended: true}));
router.use(express.json());

// Function to read in XML file and convert it to JSON
function xmlFileToJs(filename, cb) {
  var filepath = path.normalize(path.join(__dirname, filename));
  fs.readFile(filepath, 'utf8', function(err, xmlStr) {
    if (err) throw (err);
    xml2js.parseString(xmlStr, {}, cb);
  });
}

//Function to convert JSON to XML and save it
function jsToXmlFile(filename, obj, cb) {
  var filepath = path.normalize(path.join(__dirname, filename));
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(obj);
  fs.writeFile(filepath, xml, cb);
}

router.get('/', function(req, res){

    res.render('index');

})

router.get('/get/html', function(req, res) {

    res.writeHead(200, {'Content-Type': 'text/html'});

    var xml = fs.readFileSync('Spa.xml', 'utf8');
    var xsl = fs.readFileSync('Spa.xsl', 'utf8');
   // console.log(xml);
    var doc = xmlParse(xml);
    var stylesheet = xmlParse(xsl);

    var result = xsltProcess(doc, stylesheet);

    res.end(result.toString());

});

//POST request to add JSON & xml files
router.post('/post/json', function(req, res){ 
    
    //'router.post'> posts info to the function
    function appendJSON(obj){
       // console.log(obj);
        //function to read in XML file, converted to JSON, add a new object and write back to XML
        xmlFileToJs('Spa.xml', function(err, result){
            if(err) throw (err);
                result.Spa.section[obj.sec_n].entree.push({'item': obj.item, 'price': obj.price}); //read xml adn converts to JSON
               // console.log(result);
                jsToXmlFile('Spa.xml', result, function(err){
                    if(err) console.log(err);
                })
        })
    }

    //call appendJSON function and pass in body of the current POST request
    appendJSON(req.body);

    //Re-direct the browser back to the page  where the POST request came from
    res.redirect('back');
    
});

// POST request to add to JSON & XML files
router.post('/post/delete', function(req, res) {

  // Function to read in a JSON file, add to it & convert to XML
  function deleteJSON(obj) {
    // Function to read in XML file, convert it to JSON, delete the required object and write back to XML file
    xmlFileToJs('Spa.xml', function(err, result) {
      if (err) throw (err);
      //This is where we delete the object based on the position of the Spa, section and position of the entree, as being passed on from index.
      delete result.Spa.section[obj.section].entree[obj.entree];
      //This is where we convert from JSON and write back our XML file
      jsToXmlFile('Spa.xml', result, function(err) {
        if (err) console.log(err);
      })
    })
  }

  // Call appendJSON function and pass in body of the current POST request
  deleteJSON(req.body);

});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});