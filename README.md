An HTTPS version of Jorge Silva’s [“Using PassportJS OAuth with RethinkDB”](https://rethinkdb.com/blog/passport-oauth-with-rethinkdb/).

Follow the instructions in Silva’s article to complete `config/default.js`, except use `https://127.0.0.1:9000` as the callback URL, i.e., `https://127.0.0.1:9000/auth/login/callback/github` and `https://127.0.0.1:9000/auth/login/callback/twitter`.

But before launching Node, edit and run `$ bash oneshot-create-root-and-server-cert-and-sign.sh` in the top-level directory to create and populate `certs/` directory with a personal certificate authority (CA) and an SSL key signed by this CA.

Launch Node with `npm run dev`.

Visit [`https://localhost:9000`](https://localhost:9000), add a security exception (since the SSL key being presented was signed by a home-made CA—and potentially twice: once upon visiting this URL and then again when you are done authorizing the app at GitHub/Twitter) to confirm that the app works.

**N.B.** The current 0.0.4 version of [rethinkdb-init](https://github.com/thejsj/rethinkdb-init) throws an error if it finds a database with the same name, because RethinkDB’s error names changed. You may need to incorporate [https://github.com/thejsj/rethinkdb-init/pull/7](https://github.com/thejsj/rethinkdb-init/pull/7) by editing `node_modules/rethinkdb-init/index.js` if you actually edit and rerun the code.

**N.B. 2** The self-signed certificate magic script, based on [coolaj86’s notes](https://coolaj86.com/articles/how-to-create-a-csr-for-https-tls-ssl-rsa-pems/), will become much simpler when [Let’s Encrypt](https://letsencrypt.org/) goes online later in 2015—stay tuned.
