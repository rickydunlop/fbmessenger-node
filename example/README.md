# fbmessenger example

Create a `.env` file that contains the follwing

```
VERIFY_TOKEN=<your verification token>
PAGE_ACCESS_TOKEN=<your page access token>
```

## Install the dpeendencies

    npm install
    
## Run the app

    npm start

You can use a tool like [ngrok](https://ngrok.com/) to tunnel connections to your localhost to make testing simple. Just set the Facebook app's webhook url to the https url that ngrok generates for you.
