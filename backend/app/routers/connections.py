from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import ConnectionModel, LocationModel
from ..schemas import ConnectionSchema, ConnectionCreate

router = APIRouter(prefix="/api/connections", tags=["Connections"])

@router.get("", response_model=List[ConnectionSchema])
def get_all_connections(db: Session = Depends(get_db)):
    return db.query(ConnectionModel).all()

@router.post("", response_model=ConnectionSchema)
def create_connection(conn: ConnectionCreate, db: Session = Depends(get_db)):
    # Validate source and target locations
    source = db.query(LocationModel).filter(LocationModel.id == conn.source_id).first()
    target = db.query(LocationModel).filter(LocationModel.id == conn.target_id).first()
    if not source or not target:
        raise HTTPException(status_code=400, detail="Invalid source or destination location ID.")
    if conn.cost < 0 or conn.distance < 0 or conn.capacity < 0:
        raise HTTPException(status_code=400, detail="Cost, distance, and capacity must be non-negative numbers.")
    
    db_conn = ConnectionModel(**conn.model_dump())
    db.add(db_conn)
    db.commit()
    db.refresh(db_conn)
    return db_conn

@router.put("/{connection_id}", response_model=ConnectionSchema)
def update_connection(connection_id: str, conn: ConnectionCreate, db: Session = Depends(get_db)):
    db_conn = db.query(ConnectionModel).filter(ConnectionModel.id == connection_id).first()
    if not db_conn:
        raise HTTPException(status_code=404, detail=f"Connection '{connection_id}' not found.")
    for key, value in conn.model_dump().items():
        setattr(db_conn, key, value)
    db.commit()
    db.refresh(db_conn)
    return db_conn

@router.delete("/{connection_id}")
def delete_connection(connection_id: str, db: Session = Depends(get_db)):
    db_conn = db.query(ConnectionModel).filter(ConnectionModel.id == connection_id).first()
    if not db_conn:
        raise HTTPException(status_code=404, detail=f"Connection '{connection_id}' not found.")
    db.delete(db_conn)
    db.commit()
    return {"message": f"Connection '{connection_id}' deleted successfully."}
