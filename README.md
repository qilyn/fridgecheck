# fridgecheck

The world's simplest webapp for checking if I, a human person with terrible temporal awareness, will be late for the bus or not. Maybe it'll suit you too.

### Setup

Running on: Linux in a virtualenvwrapper

- Clone the repo
- In a terminal
```bash
cd fridgecheck
pip install requirements.txt
```
- Create .env in the project root (not in `fridgecheck` the module) and add your API_KEY, as shown in `example.env`

#### Frontend

Much as I love Python, let's do a React with this. Reminder:

```bash
nvm use 14
# npx create-react-app frontend
npm start
```
##### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

##### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



### Starting the project

```bash
flask --app fridgecheck --debug run
```

### Todo

* Add a database for persistent data storage. (We all knew this day would come!)
  * Once that's done, we can refactor the frontend. 
    1. Enter the stop you're interested in (or choose a saved prediction)
    2. Load the predictions. At the top will be two inputs:
       * Time to walk to stop (mins). Departures will style differently depending on whether you can walk there.
       * Filter by services you're interested in. Departures will be removed if they are not in this list.

### Credentials

Get yours by registering: https://opendata.metlink.org.nz/dashboard


### Why is it called fridgecheck

Because, ideally, it will stay running on a `<device>` that lives on a fridge, where it is unmissable.

You know how you always need to check the fridge to see if there is food in there, even though you know you checked it ten minutes ago? Fridgecheck.