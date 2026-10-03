from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import LocationModel
from ..schemas import LocationSchema, LocationCreate

router = APIRouter(prefix="/api/locations", tags=["Locations"])

@router.get("", response_model=List[LocationSchema])
def get_all_locations(db: Session = Depends(get_db)):
    return db.query(LocationModel).all()

@router.post("", response_model=LocationSchema)
def create_location(loc: LocationCreate, db: Session = Depends(get_db)):
    existing = db.query(LocationModel).filter(LocationModel.id == loc.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Location with ID '{loc.id}' already exists.")
    db_loc = LocationModel(**loc.model_dump())
    db.add(db_loc)
    db.commit()
    db.refresh(db_loc)
    return db_loc

@router.put("/{location_id}", response_model=LocationSchema)
def update_location(location_id: str, loc: LocationCreate, db: Session = Depends(get_db)):
    db_loc = db.query(LocationModel).filter(LocationModel.id == location_id).first()
    if not db_loc:
        raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found.")
    for key, value in loc.model_dump().items():
        setattr(db_loc, key, value)
    db.commit()
    db.refresh(db_loc)
    return db_loc

@router.delete("/{location_id}")
def delete_location(location_id: str, db: Session = Depends(get_db)):
    db_loc = db.query(LocationModel).filter(LocationModel.id == location_id).first()
    if not db_loc:
        raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found.")
    db.delete(db_loc)
    db.commit()
    return {"message": f"Location '{location_id}' deleted successfully."}
