# TransLog

## Tech Stack
- NestJS
- PostgreSQL
- TypeORM
- JWT
- Docker
- Angular

## Use of AI
I used AI to help me with Docker setup and pagination because I had not done these before. I reviewed the code and adapted it to the project.

## Technical decisions
The project is orginized as a monorepo with separate backend and frontend folders.
Shipment status changes are handled separately from shipment creation logic, and every status change creates a shipment event.
PostgreSQL is used as the database with TypeORM.

## Shipment status flow
CREATED -> IN_WAREHOUSE -> IN_TRANSIT -> OUT_FOR_DELIVERY -> DELIVERED  
A shipment can also transition from OUT_FOR_DELIVERY to RETURNED.  
A shipment can be cancelled from any status except DELIVERED.

## Vehicle assignment algorithm
The vehicle assignment uses FFD (First Fit Decreasing) algorithm.
Shipments are sorted by weight from highest to lowest. Each shipment is placed in the first vehicle where it fits. If it does not, a new vehicle is created.

## Running the Project

### Docker
from the project root:

```bash
docker compose up --build



