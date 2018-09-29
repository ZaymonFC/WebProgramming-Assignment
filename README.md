# Sockets

## Project Setup
- Both the server and the front end share node modules so installation is as simple as `npm install`

## Front End
- To build the front-end use `ng build --watch`
- Serving the front end must be done with the server

## Server
- To start the server run `npm run start-server`
- To run integration tests run `npm run test-server`

<!-- ## Assignment Spec
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

> Initially there is one user called Super who is also a super admin. -->

## Repository Organization
The git structure of the git repository is simple, the top level directories of the angular project are at the top level of the repository along with the server directory and the documentation directory. The reduction in nesting resulting from not having the Angular app in it's own directory is ideal.

## Git Practices
Throughout the development process git has been used heavily. The first section of the assignment consists of over 33 commits. And the second section of the assignment over 22. A commit has been added to the repository either after each logical increment in development or when fixes are completed for bugs or unfinished features. Each commit has been used as a wrapper for a collection of related changes and the version history of the project reflects the progression and development of the system. Good descriptive commit messages have always been used in order to summarize the changes contained within. In regards to workflow a process did not have to be standardized due to the size of the developer team (1 member), however, consistency in commit messages and commit style has been provided.

## Data Structures
Various types have been used to represent different entities in the system. The types are:

- __User__ | Data type for a user entity.
  - id: string
  - username: string
  - rank: string
  - email: string
- __Group__ | Data type for a group entity. Used on the front-end for the group detail view. Contains nested collections of users and channel summaries.
  - name: string
  - id: string
  - description: string
  - users: User: List<User>
  - channels: List<ChannelSummary>
- __Group Summary__ | Lighter type for group entity that does not require nesting of associated user objects.
  - name: string
  - id: string
  - description: string
  - users: list<string> (user ids)
  - channels: list<string> (channel ids)
- __Channel__ | Type for the channel entity, used in the channel detail view. Contains nested users and a reference to the group it belongs to.
  - id: string
  - name: string
  - users: list<User>
  - groupId: string
- __Channel Summary__ | Lighter weight type for channel entity that does not require nesting of associated user objects.
  - id: string
  - groupId: string (id of group)
  - users: list<string> (user ids)
- __Message__ | Lighter weight type for channel entity that does not require nesting of associated user objects.
  - id: string
  - groupId: string (id of group)
  - users: list<string> (user ids)

## Separation of Responsibilities - REST API and Client
### API Responsibilities
The responsibilities of the rest API are the concerns of data-access and persistence. When entities are created, modified or deleted on the client these changes must persist to be useful. For the client to be useful it must be able to present the user with data (hence the name presentation layer). To persist changes or fetch data the client must interact with the API. These interactions are managed by sending requests to controlled endpoints (routes) where the behavior of the server is unique to the action each route is responsible for. In updated version of the assignment the thin functional data layer over JSON has been replaced with MongoDB. Mongo allows for the storage of document style records in collections. Mongo can also maintain indexes and unique constraints on collections and this was used to the advantage of the project to increase the expressiveness of checking that newly created entities are unique. The transition to Mongo also increased the performance and concurrency control of the application. By using a middleware pattern the API provides each request with a database connection. This allows for better transaction support and means that if the connection fails the server does not require a restart as new requests are provided with new database connections.

### Client Responsibilities
The responsibilities of the angular client are to present data to the user and to allow users to interact with the application in a real time and visual way. In this assignment the client is responsible for presenting the data as well as allowing the users to manage entities such as groups, channels and other users. The client in this assignment also has a granular permission system implemented as simple action guards to hide sets of functionality from users of different ranks. The client makes use of a socket service to communicate in real time with the web sockets implementation on the server allowing for effective real time communication in each channel.

## Routes
- __GET /login/:username__ | A simple route which returns a user object if the user is found in the data otherwise returning null..\
_Parameters:_
    - UserID: string\
_Outputs:_
    - User Object
- __GET /user__ | Route to return the top 100 users (for user lists).\
_Parameters:_
    - None\
_Outputs:_
    - list<User>
- __GET /user/:id__ | Route to find and return a specific user.\
_Parameters:_
    - UserID: string\
_Outputs:_
    - User Object
- __POST /user__ | Route to create a new User entity.\
_Parameters:_
    - username: string
    - email: string
    - rank: string\
_Outputs:_
    - User Object
- __PATCH /user/:id__ | Route to update the contents of some user in the database.\
_Parameters:_
    - UserId: string
    - Object of changes expressed as key value pairs (key attribute name, value is the new value).\
_Outputs:_
    - respond Status Message
- __DELETE /user/:id__ | Route to delete a user and clear all reference to that user in the group and channel collections.\
_Parameters:_
    - UserId: string\
_Outputs:_
    - respond Status Message
- __GET /otherUsers/:id__ | Route to fetch users that are not in a certain group (used for finding lists of users to add to groups).\
_Parameters:_
    - GroupId: string\
_Outputs:_
    - list<User>
- __GET /group__ | Route to get the top 100 groups (used for listing groups).\
_Parameters:_
    - None\
_Outputs:_
    - list<GroupSummary>
- __GET /group/:id__ | Route to find a specific Group, then queries the database and nests all User's associated with the group as nested objects. Also nests ChannelSummary's associated with the group.\
_Parameters:_
    - GroupId: string\
_Outputs:_
    - list<Group>
- __POST /group__ | Route to create a Group entity and store it in the database. Sanitizes input and creates a group with a scheme. Either returns 'non-unique' or the newly created Group object.\
_Parameters:_
    - name: string
    - description: string\
_Outputs:_
    - Group: Group
- __DELETE /group/:id__ | Route to delete a group from the database. (Also deletes all associated channels).\
_Parameters:_
    - groupId: string\
_Outputs:_
    - Status Message
- __POST /channel__ | Route to create a new Channel. Sanitizes input information and then saves a new channel object to the database (includes reference to parent group). Updates group table to include a reference to the Channel. Returns newly created Channel.\
_Parameters:_
    - name: string
    - groupId: string\
_Outputs:_
    - channel: Channel
- __DELETE /channel/:id__ | Route to  delete a channel and the parent groups reference to it.\
_Parameters:_
    - channelId: string\
_Outputs:_
    - Status Message
- __PATCH /group/:id/user__ | Route to add or remove users from group. \
_Parameters:_
    - methodName: string (add or remove user)
    - groupId: string
    - userId: string\
_Outputs:_
    - Status Message
- __GET /channel/:id__ | Route to get a channel with nested users.\
_Parameters:_
    - channelId: string\
_Outputs:_
    - channel: Channel
- __PATCH /channel__ | Route to add and remove users from channels\
_Parameters:_
    - method: string
    - userId: string
    - channelId: string\
_Outputs:_
    - Status Message
- __GET /chat:id__ | Route to get all chat messages for a certain channel\
_Parameters:_
    - channelId: string\
_Outputs:_
    - List of messages
    - Status Message (In error event)
- POST /image__ | Route to post image data and store it on the server\
_Parameters:_
    - channelId: string\
_Outputs:_
    - List of messages
    - Status Message (In error event)

## Angular
### Routes
- __''__, redirects to component HomeComponent
- __'chat'__, redirects to component ChatComponent
- __'404'__, redirects to component NotFoundComponent
- __'dashboard'__, redirects to component DashboardComponent
- __'group/:id'__, redirects to component GroupComponent with a group ID as input
- __'channel/:id'__, redirects to component ChannelComponent with a channel ID as input
- __'**'__, redirectTo component '404' (not found)

### Components
 Various components were created throughout development, some components form hierarchies of parent and child components. The app component is the top level component in the application. The app component in this application contains a simple template which include a router outlet and the menu bar. When the application navigates to other routes the router outlet will be populated with different components.

- __Menu__ | Menu component for logging out and navigation.
- __Home__ | The home component contains the log in form for logging into the application.
- __Chat__ | A simple component containing a basic sockets chat.
- __Dashboard__ | Component for managing and viewing users and groups.
  _Nested Components_
  - __dashboard-group__ | Child list component which handles entering and deleting groups.
  - __dashboard-user__ | Child list component which handles deleting, listing, promoting and demoting users.
- __Group__ | Detail view for a group that contains functions and functionality to create and remove channels, add and remove users from the group.
- __Channel__ | Detail view for a channel that contains functions and functionality to add and remove users from the group.
- __NotFound__ | Component to display if the route is not found.
- __Counter__ | Simple component that displays a badge with the value of the number passed into the parameter.

### Services
- __User Service__\
_Responsibilities_
  - Manages user for current session
  - Creates users
  - Gets users
  - Finds user
  - Deletes users
  - Promotes and demotes users to different ranks
- __Channel Service__\
_Responsibilities_
  - Get channels
  - Remove Channels
  - Add user to channel
  - Remove user from channel
- __Group Service__\
_Responsibilities_
  - Get groups
  - Delete Groups
  - Find Groups
  - Add user to group
  - Remove user from group
- __Permission Service__\
_Responsibilities_
  - Defines granular permissions
  - Creates permission hierarchies based on role
  - Can check whether the current user has a certain permission in their associated permission hierarchy
- __Chat Service__\
_Responsibilities_
  - Get chat history for specific channels
-__Socket Service__\
_Responsibilities_
  - Connect to web sockets provided by the server
  - Send connection information to the sever on entering a channel
  - Send messages to the server
  - Observe socket connection for new messages


### Modules
The main module used during this assignment is the routing module, which defines the virtual routes for the application.