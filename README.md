# Anemo
### Your Campus, Right Away!

<div id="top"></div>
This repository contains the code for the backend of the app.
<br />
The code for the fronted can be found at (https://github.com/rahash72/anemo-frontend).

<br /><br />
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

## About the Project

Anemo has been designed with the purpose of helping students in a campus connect with each other.<br />
- It gives you the feature of an inclusive micro-blogging site where you can add your own posts and also interact with
the posts of other students by liking and commenting on them.
- You can find another student of your campus on the app and have a realtime one-to-one chat with him/her. You can
personalize your profile by adding details of yourself, as well as a profile picture.
- It provides a platform for e-commerce trade of skills, services as well as products within the campus community

<p align="right">(<a href="#top">Back to top</a>)</p>

### Built With

* [![Node.js][Node.js]][Node-url]
* [![Express.js][Express.js]][Express-url]
* [![MongoDB][MongoDB]][MongoDB-url]
* [![Pusher][Pusher]][Pusher-url]

<p align="right">(<a href="#top">Back to top</a>)</p>

## Getting Started

### Prerequisites

You need to install Node Package Manager(npm).
* npm
  ```sh
  npm install npm@latest -g
  ```
  
### Installation

1. Get a free API Key at [Pusher](https://pusher.com/)
2. Create a new MongoDB collection at [MongoDB](https://www.mongodb.com/)
3. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
4. Install NPM packages
   ```sh
   npm install
   ```
5. Enter your Pusher API Key details in `.env`
   ```js
   app_id = 'Your app_id'
   key = 'Your key'
   secret = 'Your secret'
   cluster = 'Your cluster'
6. Enter the URI of your MongoDB collection in `.env`
   ```js
   MONGO_URI = 'Your URI'
7. Run the backend server. It runs at localhost:8080
   ```sh
   npm start
   ```

<p align="right">(<a href="#top">Back to top</a>)</p>


[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en/
[Express-url]: https://expressjs.com/
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Pusher-url]: https://pusher.com/
[Pusher]: https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/d7qbtxjvzkenornpfqgm
