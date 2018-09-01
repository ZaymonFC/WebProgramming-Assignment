# Sockets

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Assignment Spec
- Create a chat application (Server and front end)
- Build the dashboard for the chat system.

- The system will have the following roles
    - Group Admin
        - Ability to create groups
        - Ability to create channels within groups
        - Can create/invite users to a chanel (If the user has already been created they will simply be added to the chanel)
        - Ability to remove groups, channels and users from channels
        - Can allow other users to become group admins of the group
    - Super Admin
        - Inherits all permissions from Group Admin
        - Can create users with Group Admin Role
        - Remove users
    - User
        - Identified by username
        - Has an email address

> Initially there is one user called Super who is also a super admin.

