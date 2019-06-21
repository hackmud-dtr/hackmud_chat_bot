# Introduction

This repository contains a reference implementation for a Discord/[Hackmud chat API](https://www.hackmud.com/chat) forwarding bot that works with risk in the [Unofficial Hackmud Discord Server](https://discord.gg/VvMkk24) to handle chatting in the Port Epoch Bridge channels. If you run this bot (or something equivalent) you can chat in the PEB channels and post as your own users (rather than bridge) without exposing your chat API token to anyone.

# Setup and Installation

1. Clone this git repo, cd to it
2. `npm install`
3. Copy config.example.json to config.json
4. Edit the user section config.json as appropriate.
5. Make your bot public temporarily if not already
6. Talk to @dtr#9893 to add your bot to the system.

# API

If you want to write your own bot rather than using this sample, the API is very simple: I will give you a channel id. You listen in that channel for messages. Messages will be JSON in the following form (shown here indented, but in practice they will not be indented)

    {
        "version": "1.0.0",
        "channel": "0000",
        "message": "this is a test"
    }

You can do whatever you want with the message (suggested behavior: send it via the chat API). Within 5 seconds of the message appearing, you should react to it with one of the following emoji:

* `:ok:` (`\uD83C\uDD97`; 🆗) to indicate success
* `:octagonal_sign:` (`\uD83D\uDED1`; 🛑) to indicate failure

On success, risk will do nothing. On failure, risk will bridge the message as normal using your usual bridge details. If no reaction is applied with in 5 seconds, risk will bridge for you as usual. And, if your bot is detected as being offline (via status), risk will bridge for you without waiting.

Some things you might want to do if you write your own bot for this (the reference implementation here does some of this):

* Per-user coloring (provided by the sample bot)
* Selecting alternate users (provided by the sample bot)
* Corruption

# License

[MIT](https://opensource.org/licenses/MIT)
