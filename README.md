An HTTPS version of Jorge Silva’s [“Using PassportJS OAuth with RethinkDB”](https://rethinkdb.com/blog/passport-oauth-with-rethinkdb/).

Follow the instructions in Silva's article to complete `config/default.js`.

But before launching Node, edit and run `$ bash oneshot-create-root-and-server-cert-and-sign.sh` in the top-level directory to create and populate `certs/` directory with a personal certificate authority (CA) and an SSL key signed by this CA.

Launch Node with `npm run dev`.

Visit [`https://localhost:9000`], add a security exception (since the SSL key being presented was signed by a home-made CA—and potentially twice: once upon visiting this URL and then again when you are done authorizing the app at GitHub/Twitter) to confirm that the app works.
