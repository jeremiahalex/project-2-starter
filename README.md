# Your Project Name
GotGig (pronounce with a "?" as in, "GotGig?")

Anyone can do a gig and anyone can post a gig.

https://gotgig.herokuapp.com/

## Getting Started

If you are a developer and would like to contribute or use this code, simply
1. Fork this Repo
2. Git clone this to your local device and open
3. At your terminal, write the command ```yarn install```
4. And after that, at the terminal, ```yarn start```

5. If you do not have **mongodb**, please download from https://robomongo.org/download, create a localhost connection
and once you start adding users and gigs, the data should start adding as well.
6. This app requires a Cloudinary account. After signing up, you should be able to see 3 things that you'd need in your (hidden) .env file:
..* CLOUDINARY_URL
..* API_KEY
..* API_SECRET
You'd need all three to start.

If you would like to contribute, please see below, at "Known Bugs" for some parts that you can contribute!

### Prerequisites

The above "Getting Started" instructions assume that you would have installed these globally

1. Node js
2. yarn

And that you have a text editor like [Atom](https://atom.io/)

Other than that, when you give the command ```yarn install```, all the other dependencies (that you can see in package.json) will be installed locally.

### How to Use

The point of this app is so that Makers, Creatives and Talents (MCTs - shortened since I'd use it often) can find gigs, or short term jobs, that uses their skills.

There are a lot of clients out there that require specialised knowledge and skill in creative work. These clients unfortunately do not have the time to browse through facebook and go for all meetups to find the people that can help them.

Therefore, this app allows users to sign up, post gigs and also connect with the clients.

Rather than separate the users, MCTs vs Clients, I have made it such that anyone can be a gig-er or a gig-ee (think employer, employee). This is for our future development of the "volunteering" aspect of GogGigs. More to come soon.


## Live Version

https://gotgig.herokuapp.com/

## Built With

* Robo 3T
* Cloudinary
* Express
* Handlebars
* Passport
* Bootstrap 4
* [jQuery](http://jquery.com/) - jQuery for example is something you likely used

## Workflow

Wireframes (attempted)
* ![wireframe](/imgs/wireframe.jpg)
* ![wireframe2](/imgs/wireframe2.jpg)

Day 1 (evening):
1. Came up with a basic ERD, Wireframe, List of Routes.
2. Started with Sign up, Login Page and Linked Database of users
3. Post on heroku.

Day 2:
1. Created users and gigs models, routes, views, database. (Create and Read)
2. Set up Authentication and sessions
3. Fixed bugs in the routes and views

Day 3:
1. Got stuck at sessions bugs, fixed after a long time
2. Cleaned up nav bar and tried to implement CSS framework (took longer than expected)
3. Linked Gigs to users

Day 4:
1. Update feature of Users and Gigs
2. Fixed bugs in search engine
3. Added the dropdown Skills feature. (Made new db collection of skills)

Day 5:
1. Delete feature of Users and Gigs
2. Upoad profile image through Cloudinary
3. Set up Heroku db, Cloudinary
4. Made minor changes to Page design

Day 6 - 7 (sunday and monday):
1. Edited Login and Sign up Page
2. Updated ReadMe
3. Edited gigs-card and profile card pages

## Known bugs

Here are some parts that I know this code is lacking/or maybe just plain wrong. If you'd like, you can fix these!

1. When searching for peeps, it won't work if the person doesn't have any profile data.
2. When the gigs are searched, the gig.author.name is undefined :(. Smth wrong with fontend.js line 121 ```${gig.author}``` (tried gig.author.name but turns out undefined.)
3. signup_routes line 16. Currently, if the user does not input an image, the sign up won't work. Technically that's a good thing for this app but this app should at least give a msg to remind to add in image.
4. frontend.js line 35.

## Future Developments

If fixing bugs is not your cup to tea, you can also help in adding these features!
1. Profile Image to be circular (Cloudinary has that feature apparently)
2. Chatbox
3. Payment feature
4. Passport - linkedin, facebook, github

## Acknowledgments

Here are the people that helped me in my greatest need
* **Alex** - for EVERYTHING. But most importantly on teaching me how to debug. The first day I could not even begin to think how to debug, but by the third day I could think.. logically? Anyway I managed to fix code after he taught me!
* **Joseph** - got stuck at Authentication, he got me unstuck
* **Zhengyu** - taught me how to pass two db.find() into one GET post. Would have wasted a lot of time if he didn't come in.
* **Prima** - debug sessions: friends and TA couldn't help but he found the problem: my code was all over the place.
* **Asrar*** - for keeping me sane and sending me home late at night after a long tiring day of coding

Some references that I implemented on my code:
* For handlebars "If a === b" . Refer to gig-card.handlebars line 11 http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates/
