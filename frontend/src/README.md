# src

This repository contains the frontend sourcecode for our application. It follows a layered architecture approach to promote separation of concerns and maintainable code.

## Folder Structure

The repository has the following folder structure:

- `components`: This folder contains reusable UI components responsible for rendering the user interface and handling user interactions. It is further organized into thematic modules to promote code modularity and reusability.

- `hooks`: This folder houses custom React hooks that encapsulate reusable stateful logic and provide functionality to the components in the presentation layer.

- `services`: The services folder contains modules that handle data fetching, server-side rendering, and interface with external APIs or backend services.

- `ssr`: This folder consists of modules, components, middleware, and utilities specifically related to Server-Side Rendering (SSR). It enhances the server-side rendering process and optimizes components for server rendering.

- `utils`: The utils folder includes utility functions or helper classes that support the business logic layer, providing common functionality for data manipulation, validation, formatting, and other common tasks.

- `assets`: This folder holds static assets such as images, fonts, icons, and other files used in the application's UI.

## Layered Architecture

The frontend codebase follows a layered architecture approach, as depicted in the following diagram:

```
                      +-----------------+
                      |    Presentation |
                      |    Layer        |
                      +-----------------+
                      |   /components   |
                      |   /views        |
                      +--------+--------+
                               |
                               |
                               |
                      +--------v--------+
                      |    Business     |
                      |    Logic        |
                      +-----------------+
                      |   /hooks        |
                      |   /utils        |
                      +--------+--------+
                               |
                               |
                               |
                      +--------v--------+
                      |    Data         |
                      |    Layer        |
                      +-----------------+
                      |   /services     |
                      |   /ssr          |
                      +--------+--------+


                      +-----------------+
                      |    External     |
                      |    Systems      |
                      +-----------------+
                      |   /assets       |
                      +-----------------+
```
