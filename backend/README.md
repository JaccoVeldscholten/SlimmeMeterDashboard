# Smart Meter Backend
The backend is written to process the API calls from the hardware and from the frontend.

The backend is written in NodeJS. All information that comes in on the backend is written in a MongoDB database.

Set up is easy with NPM/Docker/Kubernetes.


## API Description
The table below has been developed to provide an overview of the API calls used. it is easy to call up these Calls in the Postman program.
| Request                                    | Type   | Expected result / description                          |
|--------------------------------------------|--------|--------------------------------------------------------|
| /                                          | GET    | Test API. Result should be "Hello Friend"              |
| /measurements/all                          | GET    | Displays all data from DB                              |
| /measurements/electric/currentConsumption  | GET    | Current Power Consumption                              |
| /measurements/electric/currentYield        | GET    | Current Yield Power                                    |
| /measurements/electric/lowhigh/consumption | GET    | Today's used consumption peak and off-peak consumption |
| /measurements/electric/lowhigh/yield       | GET    | Today's yield power peak and off-peak                  |
| /measurements/gas                          | GET    | Today's Gas consumption                                |
| /measurements/time                         | GET    | Timestamp of latest log                                |
| /measurements/7days                        | GET    | Get usage of the last 7 days                           |
| /measurements                              | POST   | Create new Record                                      |
| /measurements/:id                          | DELETE | Removes Record by Doc ID (not used in application)     |

## Setup
The port used to connect to the backend is port 3010.
The following commands should be executed from this folder.
```python
#from /
npm install
npm start
```


## License
[MIT](https://choosealicense.com/licenses/mit/)