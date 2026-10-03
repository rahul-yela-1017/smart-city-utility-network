from sqlalchemy import Column, String, Float, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class LocationModel(Base):
    __tablename__ = "locations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    type = Column(String, nullable=False)  # Hospital, Power Station, Water Plant, Residential, Industrial, etc.
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    population = Column(Integer, default=0)
    priority = Column(String, default="Medium")  # Critical, High, Medium, Low
    electricity_demand = Column(Float, default=0.0)  # in MW
    water_demand = Column(Float, default=0.0)  # in ML/day
    traffic_demand = Column(Float, default=0.0)  # in vehicles/day
    criticality = Column(Float, default=50.0)  # 0 to 100

    # Relationships
    outgoing_connections = relationship("ConnectionModel", foreign_keys="ConnectionModel.source_id", back_populates="source_location", cascade="all, delete-orphan")
    incoming_connections = relationship("ConnectionModel", foreign_keys="ConnectionModel.target_id", back_populates="target_location", cascade="all, delete-orphan")


class ConnectionModel(Base):
    __tablename__ = "connections"

    id = Column(String, primary_key=True, index=True)
    source_id = Column(String, ForeignKey("locations.id"), nullable=False)
    target_id = Column(String, ForeignKey("locations.id"), nullable=False)
    infrastructure_type = Column(String, nullable=False)  # Electricity, Water, Road
    cost = Column(Float, nullable=False)  # in ₹ Lakhs
    distance = Column(Float, nullable=False)  # in km
    capacity = Column(Float, nullable=False)  # capacity limit
    utilization = Column(Float, default=50.0)  # % or current load
    reliability = Column(Float, default=95.0)  # %
    construction_time = Column(Integer, default=6)  # months
    status = Column(String, default="Active")  # Active, Maintenance, Failed, Proposed

    source_location = relationship("LocationModel", foreign_keys=[source_id], back_populates="outgoing_connections")
    target_location = relationship("LocationModel", foreign_keys=[target_id], back_populates="incoming_connections")


class ScenarioModel(Base):
    __tablename__ = "scenarios"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    population_growth = Column(Integer, default=0)
    electricity_increase_mw = Column(Float, default=0.0)
    water_increase_mld = Column(Float, default=0.0)
    road_increase_vpd = Column(Float, default=0.0)
    created_at = Column(String, nullable=False)
