from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import LocationModel, ConnectionModel
from ..seed_data import DEMO_LOCATIONS, DEMO_CONNECTIONS

router = APIRouter(prefix="/api/demo", tags=["Demo"])

@router.post("/seed")
def seed_demo_data(db: Session = Depends(get_db)):
    """
    Clears current network and seeds 50+ locations and 100+ connections realistic metro dataset.
    """
    db.query(ConnectionModel).delete()
    db.query(LocationModel).delete()
    db.commit()

    for loc in DEMO_LOCATIONS:
        db.add(LocationModel(**loc))

    for conn in DEMO_CONNECTIONS:
        db.add(ConnectionModel(**conn))

    db.commit()

    return {
        "message": "Successfully seeded demo city dataset.",
        "location_count": len(DEMO_LOCATIONS),
        "connection_count": len(DEMO_CONNECTIONS)
    }
