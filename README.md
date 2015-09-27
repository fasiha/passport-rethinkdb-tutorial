An HTTPS version of Jorge Silva’s [“Using PassportJS OAuth with RethinkDB”](https://rethinkdb.com/blog/passport-oauth-with-rethinkdb/).

Follow the instructions in Silva’s article to complete `config/default.js`, except use `https://127.0.0.1:9000` as the callback URL, i.e., `https://127.0.0.1:9000/auth/login/callback/github` and `https://127.0.0.1:9000/auth/login/callback/twitter`.

But before launching Node, edit and run `$ bash oneshot-create-root-and-server-cert-and-sign.sh` in the top-level directory to create and populate `certs/` directory with a personal certificate authority (CA) and an SSL key signed by this CA.

Launch Node with `npm run dev`.

Visit [`https://localhost:9000`](https://localhost:9000), add a security exception (since the SSL key being presented was signed by a home-made CA—and potentially twice: once upon visiting this URL and then again when you are done authorizing the app at GitHub/Twitter) to confirm that the app works.

**N.B.** The self-signed certificate magic script, based on [coolaj86’s notes](https://coolaj86.com/articles/how-to-create-a-csr-for-https-tls-ssl-rsa-pems/), will become much simpler when [Let’s Encrypt](https://letsencrypt.org/) goes online later in 2015—stay tuned.

## Authenticated CORS
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
    req.open('POST', 'https://127.0.0.1:9000/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.withCredentials = true;
    req.send(JSON.stringify({hi : 'there!'}));
```
It's the same script that's run when you click the button above. If you get the same set of printouts, ending with `* readyState: 4, status: 200, responseText: Ok` (and of course Node printing out a message), great!  CORS is working.

## HTTPS vs HTTP
This extension comes in two flavors. The above refers to the current `https` branch. The alternative `http` branch has the same authenticated CORS support but lacks HTTPS/SSL. This may be what you want to do: let Node run a plain HTTP server and use Nginx to handle SSL and reverse-proxy requests to Node.

N.B. POSTing from a site served over HTTPS to an unencrypted HTTP-only endpoint is forbidden by browsers. So if you do make your node app HTTP-only and you want your server to be able to service all clients, you'll need something like Nginx taking care of SSL.
