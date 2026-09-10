# TransLog

## Tech Stack
- NestJS
- PostgreSQL
- TypeORM
- JWT
- Docker
- Angular

## About the project
TransLog is a logistics application for managing shipments.
Users can create shipments, update their status and see shipment history.
Customers can track a shipment using a public tracking code.

There are two user roles:
- OPERATOR
- SUPERVISOR

Supervisors can also register new users and access the dashboard.

## Technical decisions
The project is orginized as a monorepo with separate backend and frontend folders.
Shipment status changes are handled separately from shipment creation logic, and every status change creates a shipment event.
The frontend uses standalone Angular components and lazy loaded routes.
CSV export is handled through a separate backend endpoint so all shipments can be exported, not only the current paginated page.

## Shipment status flow
CREATED -> IN_WAREHOUSE -> IN_TRANSIT -> OUT_FOR_DELIVERY -> DELIVERED  
A shipment can also transition from OUT_FOR_DELIVERY to RETURNED.  
A shipment can be cancelled from any status except DELIVERED.

## Vehicle assignment algorithm
The vehicle assignment uses FFD (First Fit Decreasing) algorithm.
Shipments are sorted by weight from highest to lowest. Each shipment is placed in the first vehicle where it fits. If it does not, a new vehicle is created.
Only shipments in IN_WAREHOUSE status can be assigned.

## Initial supervisor

An initial supervisor user is created from environment variables when the application starts.
These values can be changed in the environment configuration.

## CI
GitHub Actions checks the backend and frontend automatically.

## Main features
- Login with JWT
- User registration for supervisors
- Shipment creation
- Shipment list with pagination and status filter
- Shipment status updates
- Shipment history
- Shipment cancellation
- Public shipment tracking
- Vehicle assignment
- Supervisor dashboard
- CSV export

# Running the Project

## Environment variables
Before starting the project, create a `.env` file in the project root using `.env.example`:

The `.env` file contains the configuration used by Docker Compose, including the initial supervisor credentials.

After starting the application, use the supervisor email and password from `.env` to log in.

### Docker
from the project root:

```bash
docker compose up --build
```

The app will be available at:
- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend: [http://localhost:3000](http://localhost:3000)
- Swagger: [http://localhost:3000/api](http://localhost:3000/api)

## How to use
When the application is opened, the public tracking page is shown.
The Login button is available in the top right corner.
Log in using the initial supervisor credentials configured in the environment variables.
After login, create a shipment from the Shipments page. A tracking code is generated automatically for every new shipment.
The tracking code can be entered on the main page to check the current shipment status and its history without authentication.

On the shipment detail page there are two separate sections:
- Update Status is used to move the shipment to the next valid status and add a location and optional notes.
- Cancel Shipment is used to cancel the shipment and has its own location and notes fields.

Other available features can be accessed from the navigation header.



To stop the containers:

```bash
docker compose down
```

## Tests

To run the backend tests:
```bash
cd backend
npm test
```
