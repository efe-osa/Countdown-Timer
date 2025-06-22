# MyCountdownApp

### Description

    This is a timer application for special events

URL: https://nc-countdown-timer.netlify.app/

## Requirement

- `Git` : It is used `git` as a version control system via `github`
- `Node`: v22.15.0. You can install it from [here](https://nodejs.org/en/download)
- `NPM`: It is used install packages and manage the dependencies. This is a link [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) with directions on how to download node package manager
- `Angular CLI`: This is required to run the project on your local machine and can be download using the command showed in this [example](https://angular.dev/installation#example-1)

### Installation steps

- Verify that `node` and `npm` is installed on your local machine by running the command `node -v` and `npm -v`
- Clone the repository to the folder of choice using `git clone https://github.com/efe-osa/Countdown-Timer.git`
- In the project root directory install project dependencies using `npm install`.

To run this project in dev mode run,

    ng serve

Navigate to http://localhost:4200/ on your browser to see the result.

To build the project, run

    ng build

The build artifacts will be stored in the `dist/` directory. Use the `--configuration production` flag for a production build.

To test the project with details of the code covergae, run

    ng test:ci

### Tools

- Angular
- Typescript

### Improvements

- Add a button to cancel the timer
- Add an error logging service like Sentry
- Add dark mode for color accessibility
