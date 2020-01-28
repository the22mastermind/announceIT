[![Build Status](https://travis-ci.com/the22mastermind/announceIT.svg?branch=ft-user-signup-endpoint-170816210)](https://travis-ci.com/the22mastermind/announceIT)    [![Coverage Status](https://coveralls.io/repos/github/the22mastermind/announceIT/badge.svg?branch=develop)](https://coveralls.io/github/the22mastermind/announceIT?branch=develop)    [![Maintainability](https://api.codeclimate.com/v1/badges/9ec457ea535343b7424b/maintainability)](https://codeclimate.com/github/the22mastermind/announceIT/maintainability)


# announceIT

AnnounceIT is a solution for broadcasting agencies which allows them to be able to receive and manage announcements.


###### User Interface (https://the22mastermind.github.io/announceIT/)
###### API Docs (https://documenter.getpostman.com/view/10187591/SWT8fyXe?version=latest)


### Prerequisites
To be able to run this project on your local machine you need to install Nodejs along with npm.
Click [here](https://nodejs.org/en/download/) to download and install Nodejs.
Then open your terminal and run `npm install npm@latest -g` to install npm globally on your system.

To check if Nodejs and npm are installed, open your terminal and run `node -v && npm -v`.
It should display the version number you have installed. 

### Installation
1. Open your terminal and run `https://github.com/the22mastermind/announceIT.git` to get a copy this project on your local system.
2. run `cd announceIT` to go into the project's root directory.
3. run `npm install` to install the dependencies.

### Running the server and Tests
* run `npm run dev` to start the server locally. It should display "AnnounceIT running on port ${port}"
* run `npm run test` to test the project. It will display a list of all the tests and a test coverage summary table.

### Testing endpoints with POSTMAN
Postman is an API development environment used for creating and testing APIs by sending HTTP requests.
Click [here](https://www.getpostman.com/downloads/) to download and install POSTMAN.

After setting up POSTMAN, run it then make requests using the the API Endpoints table below.

Example of a request URL: POST `http://localhost:4000/api/v1/auth/signup`

### API Endpoints
| HTTP Method | Endpoint                                               | Description                             |
| :--------   | :------------------------------------------------------| :---------------------------------------|
| GET         | `/`                                                    | Welcome message                         |
| POST        | `/api/v1/auth/signup`                                  | User sign up                            |
| POST        | `/api/v1/auth/signin`                                  | User sign in                            |
| POST        | `/api/v1/advertiser/announcement`                      | Create an announcement                  |
| GET         | `/api/v1/advertiser/announcements<announcementStatus>` | Fetch announcement of a specific status |
| PATCH       | `/api/v1/advertiser/announcements/<announcement-id>`   | Update an announcement                  |
| DELETE      | `/api/v1/admin/announcements/<announcement-id> `       | Delete a specific announcement          |
| PATCH       | `/api/v1/admin/announcements/<announcement-id>`        | Update status of an announcement        |
| GET         | `/api/v1/admin/announcements`                          | Fetch all users announcements           |
| GET         | `/api/v1/advertiser/announcements`                     | Fetch all announcements                 |

### Author
Bertrand 'B' Masabo

### Contributors
* Alain Burindi
