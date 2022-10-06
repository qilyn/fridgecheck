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

### Starting the project

```bash
flask --app fridgecheck --debug run
```

### Credentials

Get yours by registering: https://opendata.metlink.org.nz/dashboard


### Why is it called fridgecheck

Because, ideally, it will stay running on a `<device>` that lives on a fridge, where it is unmissable.

You know how you always need to check the fridge to see if there is food in there, even though you know you checked it ten minutes ago? Fridgecheck.