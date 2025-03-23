# PWr Students' Camp - Vue.js Project
### Obóz Studnetów PWr 

This project is a frontend built with Vue.js + Capacitor for an application that manages camps for students of Wrocław University of Science and Technology. The project includes a Django backend and a Vue.js frontend.

## Project Structure

- **src/** - The main source directory of the application.
  - **assets/** - Static resources such as CSS styles and images.
    - `main.css` - Main application styles.
    - `variables.css` - CSS variables for the theme.
  - **components/** - Vue components used in the application.
    - `ExampleComponent.vue` - Example component.
  - **router/** - Application routing configuration.
    - `index.js` - Application route definitions.
  - **store/** - Application state management (Pinia).
  - **App.vue** - The main application component.
  - **main.js** - The application's entry point.
- **public/** - Public files that are directly accessible (e.g., `index.html`).
- **package.json** - Project configuration file containing dependencies and scripts.
- **vite.config.js** - Configuration for the Vite tool.

## Requirements

- Node.js
- npm

## Installation

1. Clone the repository:
```bash
git clone <REPO_URL>
cd oboz_studentow_pwr_frontend
```

2. Install dependencies:
```bash
npm install
```

## Running development server

1. Set environment variables with API URL:
```bash
export VITE_API_URL='http://localhost:8000/api/'
export VITE_WS_API_URL='ws://localhost:8000/'
```

2. Make sure API server is running.
2. Run the app
```bash
ionic serve
```

## Running E2E tests
1. Add the below environment variables to the API server. It will disable throttling for tests:
```env
ANON_THROTTLE_RATE = 'None'
USER_THROTTLE_RATE = 'None'
```

2. Run the following commands in the terminal:
```bash
npx cypress open
```

3. in second terminal run:
```bash
ionic serve
```

