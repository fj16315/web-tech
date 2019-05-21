// Server which delivers only static HTML pages (no content negotiation).
// Response codes: see http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
// When the global data has been initialised, start the server.
let HTTP = require('http');
let FS = require('fs').promises;
let OK = 200, NotFound = 404, BadType = 415;
/*
let types = {
  html : 'application/xhtml+xml',
  css  : 'text/css',
  js   : 'application/javascript',
  png  : 'image/png',
  jpg  : 'image/jpg'
};
*/
start(8080);

// Provide a service to localhost only.
function start(port) {
  let service = HTTP.createServer(handle);
  try { service.listen(port, 'localhost'); }
  catch (err) { throw err; }
  console.log("Visit localhost:" + port);
}

// Deal with a request.
async function handle(request, response) {
  let url = request.url;
  if (url.endsWith("/")) url = url + "index.html";
  if (! url.endsWith(".html") && ! url.endsWith(".css") && ! url.endsWith(".jpg") && ! url.endsWith(".jpeg") && ! url.endsWith(".png") && ! url.endsWith(".js")){
    return fail(response, BadType, "Not .html or .css or other things");
  }
  let file = "./site/public" + url;

  let type;
  if(url.endsWith(".html")){
    type = 'application/xhtml+xml';
  }
  if(url.endsWith(".css")){
    type = 'text/css';
  }
  if(url.endsWith(".png")){
    type = 'image/png';
  }
  if(url.endsWith(".jpg")){
    type = 'image/jpg';
  }
  if(url.endsWith(".jpeg")){
    type = 'image/jpeg';
  }
  if(url.endsWith(".js")){
    type = 'text/js';
  }

  let content;
  try { content = await FS.readFile(file); }
  catch (err) { return fail(response, NotFound, "Not found"); }
  reply(response, content, type);
}

// Send a reply.
function reply(response, content, type) {
  let hdrs = { 'Content-Type': type };
  response.writeHead(OK, hdrs);
  response.write(content);
  response.end();
}

// Send a failure message
function fail(response, code, message) {
  let hdrs = { 'Content-Type': 'text/plain' };
  response.writeHead(code, hdrs);
  response.write(message);
  response.end();
}
