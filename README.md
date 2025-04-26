# Todo App

A simple yet powerful Todo application built with TypeScript and Vite that lets you manage your tasks efficiently.

## Features

- **Add Tasks**: Create new todo items with a clean interface
- **Check Off Tasks**: Mark tasks as completed when done
- **Filter Tasks**: View all tasks, active tasks, or completed tasks
- **Delete Tasks**: Remove individual tasks or clear all completed tasks at once
- **Persistent Storage**: All tasks are saved in your browser's localStorage

## Technologies

- **TypeScript** - For type-safe code
- **Vite** - As the build tool and development server
- **SASS/SCSS** - For advanced styling
- **localStorage API** - For client-side data persistence
- **HTML5** - For markup
- **ES6+ JavaScript** - For modern development practices

## Getting Started

### Prerequisites

- Node.js (v16 or newer recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

## Build for Production

To create a production build:

```
npm run build
```

The build files will be located in the `dist` directory.

## How It Works

This Todo application uses the browser's localStorage API to persist your tasks, allowing you to:

- Add tasks with optional pre-checked status
- Mark tasks as complete or incomplete
- Filter your tasks by status (all, active, completed)
- Delete individual tasks or clear all completed tasks

No backend server or database is required - all data is stored locally in your browser.

## Project Structure

```
todo-app/
├── assets/          # Static assets
├── scss/            # SCSS stylesheets
├── src/
│   ├── types/       # TypeScript interfaces
│   ├── utils/       # Utility classes
│   │   ├── LocalStorageUtils.ts    # LocalStorage management
│   │   └── HtmlUtils.ts     # DOM manipulation helpers
│   └── app.ts       # Main application logic
├── index.html       # Main HTML file
└── package.json     # Project dependencies
```

## Design Inspiration

This app was inspired by the [Todo app challenge](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW) from Frontend Mentor.

## License

This project is open source and available under the [MIT License](LICENSE).
