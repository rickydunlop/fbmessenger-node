# fbmessenger example

This is setup to run with Node >= 6

Create a `.env` file that contains the following

```
VERIFY_TOKEN=<your verification token>
PAGE_ACCESS_TOKEN=<your page access token>
APP_SECRET=<your app secret>
```

## Install the dependencies

    yarn

## Run the app

    yarn start


You can use a tool like [ngrok](https://ngrok.com/) to tunnel connections to your localhost to make testing simple. Just set the Facebook app's webhook url to the https url that ngrok generates for you.

## Setup the bot

  browse to `/init` in a web browser and this will run a series of steps including setting a Persistent Menu, the Greeting Text and a Get Started button.
