# If dtr turned evil

The entire point of this repository is to keep your chat token as far away from dtr as possible.
However, dtr wrote all this code (and is currently speaking about herself in the third person).
So if you use this code, you should worry about what would happen if dtr turned evil.
I mean, hell, *I* worry about what would happen if dtr turned evil. So so should you.

## Things to look out for

If you are set on using this code (please just write your own), you should at least check it for backdoors.
I have tried to minimize access. For exmple, your discord bot only ever reacts, it never calls .send
or any other methods that can send significant data at once. You should verify that now, and after
any updates. Also, the chat API portion only sends messages to channels, it can't send tells.
Again, verify this now and after any updates. Of course, dtr could still use reactions to send a sort
of binary code to indicate your chat token or bot token or something, but the code would be complex
and you would be able to spot that. Right?

Of course, that's all well and good, but this is JS. Check for any eval-style exploits that would let
me send code to be run. Things like eval, the Function constructor, etc. They aren't present, but
check anyway.

Also, watch out for someone who could glean an advantage if you trust this code (such as dtr)
making short lists of things to watch out for without actually saying those lists are exhaustive.
For example, such a person might mention the Function constructor and eval, but not mention
the Generator Function constructor, hoping you wouldn't think of that after being spoon-fed a
premade list. That would be a bad sign.

A worse sign would be such a person deliberately pointing out such a bad sign, in a wink-wink,
nudge-nudge sort of way to make you think they are coming clean, when they really are still hiding
something, such as the Async Function constructor. That would be really bad.

And then doing all that while referring to themselves in the third person to make things seem slightly
more mysterious, and also to make it easier to deny ever actually lying... Yeah, watch out for that.

## Things I can do right now with this code

Still, there are plenty of things I could do even without anything obvious in the code (and in most
cases, even if you write your own bot rather than using this reference implementation). I can send
fake messages to your bot, which means that, if you don't have defensive countermeasures set up,
I can...

* Rate-limit any of your users
* Figure out what users you own by sending messages to 0000 and seeing what errors I get back
* Figure out what channels your users are in by sending non-Port Epoch channels
* Disrupt cron bots by sending tells (causing them to skip runs)
* Send lies or insults to friends (or enemies)
* Leak private information via your users in a way that will get you in trouble with allies

My suggestions to help solve these problems:

1. Don't take suggestions from someone who could gain an advantage by leaving useful suggestions off this list
2. Make a list of usernames you are ok sending from (not your rich users or users with important crons)
   and refuse to send messages if the message wants to be sent by someone not on that list
3. Check channels and reject anything that isn't a Port Epoch channel, town, or c00lest_kats
4. Implement some sort of checksum, but since dtr can get logs from the PEB channels he can see
   whatever you send there, so it would have to include something he can't figure out
