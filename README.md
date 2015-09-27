A slightly-expanded version of Jorge Silva’s [“Using PassportJS OAuth with RethinkDB”](https://rethinkdb.com/blog/passport-oauth-with-rethinkdb/) that demonstrates the use of Express' [`cors`](https://github.com/expressjs/cors) module to authenticated POSTs for, e.g., RESTful APIs.

Follow the instructions in Silva’s article to complete `config/default.js` and launch Node with `npm run dev`.

Visit [`http://localhost:8000`](http://localhost:8000), log in via GitHub or Twitter, and make sure all is well so far.

Then, click the `POST` button at [`http://localhost:8000`](http://localhost:8000) which will attempt to POST a JSON object to that same URL via `XMLHttpRequest`. The result of this request will be appended to the page, and also printed out in the JavaScript console. If it ends in `* readyState: 4, status: 200, responseText: Ok`, then success! Browser clients serving same-domain content can POST to your HTTPS server. Node will also print a notification.

*But!* what about other clients? If you're running a REST API and want third-party clients to POST requests via XMLHttpRequest, this demo supports it through a customized CORS-enabled `OPTIONS` route which allows browser clients to pass Express' session information (saved in a cookie) along with the POST request.

To test this, open any [page](https://news.ycombinator.com) on the web not on this domain (and *not* Github or Medium or anywhere that employs draconian [Content Security Policy](https://github.com/blog/1477-content-security-policy)), pop open the JavaScript console, and run the following:
```js
    var req = new XMLHttpRequest();
    req.onreadystatechange = (() => {
      console.log(req.readyState || 'no readyState',
                  req.status || 'no status',
                  req.responseText || 'no responseText');
      var div = document.createElement('div');
      div.innerHTML = "* readyState: " + (req.readyState || 'none') +
                      ', status: ' + (req.status || 'none') +
                      ', responseText: ' + (req.responseText || 'none');
      document.body.appendChild(div);
    });
    req.open('POST', 'http://127.0.0.1:8000/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.withCredentials = true;
    req.send(JSON.stringify({hi : 'there!'}));
```
It's the same script that's run when you click the button above. If you get the same set of printouts, ending with `* readyState: 4, status: 200, responseText: Ok` (and of course Node printing out a message), great!  CORS is working.

### HTTPS
This extension comes in two flavors. The above refers to the current `http` branch. The `https` branch is an even more minor extension that adds HTTPS/SSL support to Node. This is usually not seen in practice since it's more common to let Nginx handle SSL and forward traffic unencrypted to the Node server.
