from typing import List, Dict

# REAL HYDERABAD CITY UTILITY NETWORK DATASET
DEMO_LOCATIONS: List[Dict] = [
    # Power Stations & Grid Substations
    {"id": "LOC-HYD-1", "name": "Begumpet 220kV Transmission Substation", "type": "Power Station", "lat": 17.4447, "lng": 78.4664, "population": 0, "priority": "Critical", "electricity_demand": 0.0, "water_demand": 5.0, "traffic_demand": 300, "criticality": 98.0},
    {"id": "LOC-HYD-2", "name": "HITEC City 132kV Power Grid", "type": "Power Station", "lat": 17.4474, "lng": 78.3762, "population": 0, "priority": "Critical", "electricity_demand": 0.0, "water_demand": 3.0, "traffic_demand": 250, "criticality": 96.0},
    {"id": "LOC-HYD-3", "name": "Gachibowli Energy Switching Station", "type": "Power Station", "lat": 17.4401, "lng": 78.3489, "population": 0, "priority": "High", "electricity_demand": 0.0, "water_demand": 2.5, "traffic_demand": 200, "criticality": 90.0},
    {"id": "LOC-HYD-4", "name": "Chandrayangutta Thermal Substation", "type": "Power Station", "lat": 17.3480, "lng": 78.4740, "population": 0, "priority": "High", "electricity_demand": 0.0, "water_demand": 4.0, "traffic_demand": 180, "criticality": 88.0},
    {"id": "LOC-HYD-5", "name": "Mallapur Industrial Substation", "type": "Power Station", "lat": 17.4480, "lng": 78.5580, "population": 0, "priority": "High", "electricity_demand": 0.0, "water_demand": 3.5, "traffic_demand": 150, "criticality": 85.0},

    # Water Treatment Plants & Reservoirs
    {"id": "LOC-HYD-6", "name": "Osmansagar Water Reservoir Gandipet", "type": "Water Treatment Plant", "lat": 17.3820, "lng": 78.2980, "population": 0, "priority": "Critical", "electricity_demand": 18.0, "water_demand": 0.0, "traffic_demand": 400, "criticality": 99.0},
    {"id": "LOC-HYD-7", "name": "Himayatsagar Water Treatment Plant", "type": "Water Treatment Plant", "lat": 17.3270, "lng": 78.3580, "population": 0, "priority": "Critical", "electricity_demand": 15.0, "water_demand": 0.0, "traffic_demand": 350, "criticality": 97.0},
    {"id": "LOC-HYD-8", "name": "Krishna Water Pumping Station Malkajgiri", "type": "Water Treatment Plant", "lat": 17.4520, "lng": 78.5300, "population": 0, "priority": "High", "electricity_demand": 12.0, "water_demand": 0.0, "traffic_demand": 280, "criticality": 92.0},
    {"id": "LOC-HYD-9", "name": "Manjeera Water Treatment Plant Patancheru", "type": "Water Treatment Plant", "lat": 17.5300, "lng": 78.2600, "population": 0, "priority": "High", "electricity_demand": 14.0, "water_demand": 0.0, "traffic_demand": 220, "criticality": 91.0},
    {"id": "LOC-HYD-10", "name": "Asif Nagar Water Filtration Works", "type": "Water Treatment Plant", "lat": 17.3950, "lng": 78.4480, "population": 0, "priority": "High", "electricity_demand": 9.0, "water_demand": 0.0, "traffic_demand": 200, "criticality": 86.0},

    # Hospitals & Emergency Centers
    {"id": "LOC-HYD-11", "name": "NIMS Super Specialty Hospital Punjagutta", "type": "Hospital", "lat": 17.4256, "lng": 78.4512, "population": 65000, "priority": "Critical", "electricity_demand": 12.5, "water_demand": 6.8, "traffic_demand": 4500, "criticality": 99.5},
    {"id": "LOC-HYD-12", "name": "Yashoda Hospital Somajiguda", "type": "Hospital", "lat": 17.4265, "lng": 78.4580, "population": 52000, "priority": "Critical", "electricity_demand": 9.8, "water_demand": 5.2, "traffic_demand": 3800, "criticality": 98.0},
    {"id": "LOC-HYD-13", "name": "Apollo Hospitals Jubilee Hills", "type": "Hospital", "lat": 17.4168, "lng": 78.4115, "population": 58000, "priority": "Critical", "electricity_demand": 11.2, "water_demand": 6.0, "traffic_demand": 4200, "criticality": 98.5},
    {"id": "LOC-HYD-14", "name": "KIMS Hospital Secunderabad", "type": "Hospital", "lat": 17.4350, "lng": 78.4870, "population": 48000, "priority": "Critical", "electricity_demand": 8.5, "water_demand": 4.8, "traffic_demand": 3200, "criticality": 96.5},
    {"id": "LOC-HYD-15", "name": "Continental Hospital Gachibowli", "type": "Hospital", "lat": 17.4280, "lng": 78.3410, "population": 42000, "priority": "Critical", "electricity_demand": 7.9, "water_demand": 4.5, "traffic_demand": 2800, "criticality": 95.0},
    {"id": "LOC-HYD-16", "name": "Osmania General Hospital Afzal Gunj", "type": "Hospital", "lat": 17.3710, "lng": 78.4770, "population": 85000, "priority": "Critical", "electricity_demand": 14.0, "water_demand": 8.0, "traffic_demand": 6500, "criticality": 99.0},
    {"id": "LOC-HYD-17", "name": "Telangana Emergency Operations Center Lakdikapul", "type": "Emergency Facility", "lat": 17.4040, "lng": 78.4650, "population": 12000, "priority": "Critical", "electricity_demand": 6.0, "water_demand": 2.5, "traffic_demand": 1800, "criticality": 97.5},
    {"id": "LOC-HYD-18", "name": "Cyberabad Police & Command Center Gachibowli", "type": "Emergency Facility", "lat": 17.4390, "lng": 78.3650, "population": 8000, "priority": "High", "electricity_demand": 4.5, "water_demand": 2.0, "traffic_demand": 1500, "criticality": 92.0},

    # IT & Industrial Parks
    {"id": "LOC-HYD-19", "name": "Cyber Towers HITEC City", "type": "Industrial Zone", "lat": 17.4504, "lng": 78.3808, "population": 140000, "priority": "Critical", "electricity_demand": 45.0, "water_demand": 22.0, "traffic_demand": 38000, "criticality": 96.0},
    {"id": "LOC-HYD-20", "name": "Financial District Nanakramguda", "type": "Industrial Zone", "lat": 17.4180, "lng": 78.3420, "population": 95000, "priority": "High", "electricity_demand": 38.0, "water_demand": 18.0, "traffic_demand": 28000, "criticality": 92.0},
    {"id": "LOC-HYD-21", "name": "Mindspace IT Park Madhapur", "type": "Industrial Zone", "lat": 17.4380, "lng": 78.3820, "population": 110000, "priority": "High", "electricity_demand": 32.0, "water_demand": 16.0, "traffic_demand": 25000, "criticality": 90.0},
    {"id": "LOC-HYD-22", "name": "Cherlapally Industrial Estate", "type": "Industrial Zone", "lat": 17.4680, "lng": 78.6050, "population": 65000, "priority": "Medium", "electricity_demand": 42.0, "water_demand": 25.0, "traffic_demand": 12000, "criticality": 82.0},
    {"id": "LOC-HYD-23", "name": "Sanathnagar Industrial Hub", "type": "Industrial Zone", "lat": 17.4580, "lng": 78.4420, "population": 55000, "priority": "Medium", "electricity_demand": 35.0, "water_demand": 20.0, "traffic_demand": 10000, "criticality": 80.0},
    {"id": "LOC-HYD-24", "name": "Balanagar Precision Engineering Cluster", "type": "Industrial Zone", "lat": 17.4720, "lng": 78.4550, "population": 48000, "priority": "Medium", "electricity_demand": 28.0, "water_demand": 15.0, "traffic_demand": 8500, "criticality": 78.0},
    {"id": "LOC-HYD-25", "name": "Jeedimetla Industrial Zone", "type": "Industrial Zone", "lat": 17.5120, "lng": 78.4520, "population": 72000, "priority": "Medium", "electricity_demand": 48.0, "water_demand": 30.0, "traffic_demand": 14000, "criticality": 84.0},

    # Transport Hubs
    {"id": "LOC-HYD-26", "name": "Secunderabad Railway Station Junction", "type": "Transport Hub", "lat": 17.4338, "lng": 78.5016, "population": 180000, "priority": "Critical", "electricity_demand": 18.0, "water_demand": 10.0, "traffic_demand": 55000, "criticality": 97.0},
    {"id": "LOC-HYD-27", "name": "Rajiv Gandhi International Airport Shamshabad", "type": "Transport Hub", "lat": 17.2403, "lng": 78.4294, "population": 150000, "priority": "Critical", "electricity_demand": 55.0, "water_demand": 28.0, "traffic_demand": 42000, "criticality": 99.0},
    {"id": "LOC-HYD-28", "name": "Mahatma Gandhi Bus Station MGBS Imlibun", "type": "Transport Hub", "lat": 17.3760, "lng": 78.4820, "population": 120000, "priority": "High", "electricity_demand": 12.0, "water_demand": 8.0, "traffic_demand": 38000, "criticality": 94.0},
    {"id": "LOC-HYD-29", "name": "Hyderabad Deccan Nampally Station", "type": "Transport Hub", "lat": 17.3920, "lng": 78.4700, "population": 95000, "priority": "High", "electricity_demand": 10.0, "water_demand": 6.5, "traffic_demand": 28000, "criticality": 91.0},
    {"id": "LOC-HYD-30", "name": "Miyapur Metro Terminal & Depot", "type": "Transport Hub", "lat": 17.4960, "lng": 78.3600, "population": 85000, "priority": "High", "electricity_demand": 15.0, "water_demand": 5.0, "traffic_demand": 32000, "criticality": 89.0},
    {"id": "LOC-HYD-31", "name": "LB Nagar Junction & ORR Interchange", "type": "Transport Hub", "lat": 17.3480, "lng": 78.5520, "population": 110000, "priority": "High", "electricity_demand": 8.0, "water_demand": 4.5, "traffic_demand": 48000, "criticality": 88.0},

    # Residential & Commercial Zones
    {"id": "LOC-HYD-32", "name": "Kukatpally KPHB Housing Colony", "type": "Residential Area", "lat": 17.4850, "lng": 78.3900, "population": 185000, "priority": "Medium", "electricity_demand": 28.0, "water_demand": 18.0, "traffic_demand": 18000, "criticality": 76.0},
    {"id": "LOC-HYD-33", "name": "Banjara Hills Road No 1 Commercial Zone", "type": "Commercial Zone", "lat": 17.4150, "lng": 78.4350, "population": 82000, "priority": "High", "electricity_demand": 24.0, "water_demand": 12.0, "traffic_demand": 22000, "criticality": 85.0},
    {"id": "LOC-HYD-34", "name": "Jubilee Hills Residential Sector", "type": "Residential Area", "lat": 17.4310, "lng": 78.4070, "population": 75000, "priority": "Medium", "electricity_demand": 22.0, "water_demand": 14.0, "traffic_demand": 15000, "criticality": 78.0},
    {"id": "LOC-HYD-35", "name": "Kondapur Tech Residential Sector", "type": "Residential Area", "lat": 17.4620, "lng": 78.3680, "population": 125000, "priority": "Medium", "electricity_demand": 26.0, "water_demand": 16.0, "traffic_demand": 16000, "criticality": 74.0},
    {"id": "LOC-HYD-36", "name": "Dilsukhnagar Commercial Market", "type": "Commercial Zone", "lat": 17.3680, "lng": 78.5250, "population": 140000, "priority": "High", "electricity_demand": 25.0, "water_demand": 15.0, "traffic_demand": 32000, "criticality": 83.0},
    {"id": "LOC-HYD-37", "name": "Begumpet Commercial Corridor", "type": "Commercial Zone", "lat": 17.4420, "lng": 78.4670, "population": 68000, "priority": "Medium", "electricity_demand": 18.0, "water_demand": 9.5, "traffic_demand": 19000, "criticality": 77.0},
    {"id": "LOC-HYD-38", "name": "Ameerpet Educational Hub", "type": "School", "lat": 17.4370, "lng": 78.4480, "population": 95000, "priority": "Medium", "electricity_demand": 16.0, "water_demand": 10.0, "traffic_demand": 21000, "criticality": 75.0},
    {"id": "LOC-HYD-39", "name": "Abids Heritage Commercial Center", "type": "Commercial Zone", "lat": 17.3880, "lng": 78.4740, "population": 88000, "priority": "Medium", "electricity_demand": 17.5, "water_demand": 11.0, "traffic_demand": 24000, "criticality": 79.0},
    {"id": "LOC-HYD-40", "name": "Himayatnagar Residential Sector", "type": "Residential Area", "lat": 17.4020, "lng": 78.4850, "population": 92000, "priority": "Medium", "electricity_demand": 19.0, "water_demand": 12.5, "traffic_demand": 14000, "criticality": 72.0},
    {"id": "LOC-HYD-41", "name": "Tarnaka Academic Sector", "type": "School", "lat": 17.4280, "lng": 78.5280, "population": 62000, "priority": "Medium", "electricity_demand": 11.0, "water_demand": 7.0, "traffic_demand": 11000, "criticality": 70.0},
    {"id": "LOC-HYD-42", "name": "Osmania University Main Campus", "type": "School", "lat": 17.4130, "lng": 78.5280, "population": 45000, "priority": "High", "electricity_demand": 14.0, "water_demand": 9.0, "traffic_demand": 8000, "criticality": 81.0},
    {"id": "LOC-HYD-43", "name": "Gachibowli Bio-Tech Park Phase 3", "type": "Industrial Zone", "lat": 17.4300, "lng": 78.3700, "population": 52000, "priority": "High", "electricity_demand": 22.0, "water_demand": 13.0, "traffic_demand": 14000, "criticality": 84.0},
    {"id": "LOC-HYD-44", "name": "Uppal Ring Road Transport Hub", "type": "Transport Hub", "lat": 17.3980, "lng": 78.5580, "population": 105000, "priority": "High", "electricity_demand": 12.0, "water_demand": 7.5, "traffic_demand": 36000, "criticality": 87.0},
    {"id": "LOC-HYD-45", "name": "Mehdipatnam Junction", "type": "Commercial Zone", "lat": 17.3920, "lng": 78.4400, "population": 115000, "priority": "Medium", "electricity_demand": 21.0, "water_demand": 14.0, "traffic_demand": 29000, "criticality": 76.0},
    {"id": "LOC-HYD-46", "name": "Charminar Old City Heritage Zone", "type": "Commercial Zone", "lat": 17.3616, "lng": 78.4747, "population": 195000, "priority": "High", "electricity_demand": 26.0, "water_demand": 18.0, "traffic_demand": 45000, "criticality": 88.0},
    {"id": "LOC-HYD-47", "name": "Falaknuma Palace District", "type": "Residential Area", "lat": 17.3310, "lng": 78.4670, "population": 78000, "priority": "Medium", "electricity_demand": 14.0, "water_demand": 9.5, "traffic_demand": 12000, "criticality": 68.0},
    {"id": "LOC-HYD-48", "name": "Telangana Secretariat Complex Secretariat", "type": "Government Building", "lat": 17.4080, "lng": 78.4720, "population": 25000, "priority": "Critical", "electricity_demand": 15.0, "water_demand": 8.0, "traffic_demand": 12000, "criticality": 99.0},
    {"id": "LOC-HYD-49", "name": "High Court of Telangana Nayapul", "type": "Government Building", "lat": 17.3680, "lng": 78.4720, "population": 18000, "priority": "High", "electricity_demand": 10.0, "water_demand": 5.5, "traffic_demand": 9500, "criticality": 93.0},

    # Peripheral Disconnected Rural Villages (For Testing Connectivity BFS/DFS & SPOF!)
    {"id": "LOC-HYD-50", "name": "Shamirpet Rural Reserve Cluster", "type": "Village", "lat": 17.5950, "lng": 78.5720, "population": 16000, "priority": "Low", "electricity_demand": 3.2, "water_demand": 2.5, "traffic_demand": 600, "criticality": 42.0},
    {"id": "LOC-HYD-51", "name": "Shamirpet Agricultural Village", "type": "Village", "lat": 17.6020, "lng": 78.5800, "population": 9500, "priority": "Low", "electricity_demand": 1.8, "water_demand": 1.5, "traffic_demand": 350, "criticality": 38.0},
    {"id": "LOC-HYD-52", "name": "Ibrahimpatnam Rural Sector", "type": "Village", "lat": 17.1850, "lng": 78.6500, "population": 12000, "priority": "Low", "electricity_demand": 2.5, "water_demand": 2.0, "traffic_demand": 450, "criticality": 40.0},
    {"id": "LOC-HYD-53", "name": "Ibrahimpatnam Farm Settlement", "type": "Village", "lat": 17.1920, "lng": 78.6580, "population": 7200, "priority": "Low", "electricity_demand": 1.2, "water_demand": 1.0, "traffic_demand": 200, "criticality": 35.0},
    {"id": "LOC-HYD-54", "name": "Medchal Suburban Farming Zone", "type": "Village", "lat": 17.6300, "lng": 78.4800, "population": 14000, "priority": "Low", "electricity_demand": 2.8, "water_demand": 2.2, "traffic_demand": 500, "criticality": 44.0},
    {"id": "LOC-HYD-55", "name": "Medchal Dairy Cooperative Hub", "type": "Industrial Zone", "lat": 17.6380, "lng": 78.4880, "population": 6500, "priority": "Low", "electricity_demand": 3.5, "water_demand": 4.0, "traffic_demand": 800, "criticality": 48.0}
]

# REAL HYDERABAD MULTI-UTILITY CONNECTIONS (100+ Edges)
DEMO_CONNECTIONS: List[Dict] = []

def add_c(cid, s, t, itype, cost, dist, cap, util=55.0, rel=97.0, status="Active"):
    DEMO_CONNECTIONS.append({
        "id": cid,
        "source_id": s,
        "target_id": t,
        "infrastructure_type": itype,
        "cost": float(cost),  # ₹ Lakhs
        "distance": float(dist),  # km
        "capacity": float(cap),
        "utilization": float(util),
        "reliability": float(rel),
        "construction_time": 6,
        "status": status
    })

# 1. HYDERABAD ELECTRICITY GRID TRANSMISSION (Power Lines)
add_c("E-HYD-101", "LOC-HYD-1", "LOC-HYD-11", "Electricity", 28.5, 2.8, 65.0, 82.0, 99.5)  # Begumpet to NIMS Hospital
add_c("E-HYD-102", "LOC-HYD-1", "LOC-HYD-12", "Electricity", 22.0, 2.2, 55.0, 78.0, 99.0)  # Begumpet to Yashoda Hospital
add_c("E-HYD-103", "LOC-HYD-1", "LOC-HYD-37", "Electricity", 15.0, 1.4, 45.0, 68.0, 98.5)
add_c("E-HYD-104", "LOC-HYD-1", "LOC-HYD-48", "Electricity", 32.0, 4.2, 70.0, 94.0, 99.8)  # SPOF bridge to Secretariat!
add_c("E-HYD-105", "LOC-HYD-2", "LOC-HYD-19", "Electricity", 18.0, 1.2, 90.0, 91.0, 99.2)  # HITEC Grid to Cyber Towers
add_c("E-HYD-106", "LOC-HYD-2", "LOC-HYD-21", "Electricity", 24.0, 1.8, 75.0, 86.0, 98.8)  # HITEC Grid to Mindspace
add_c("E-HYD-107", "LOC-HYD-2", "LOC-HYD-32", "Electricity", 35.0, 4.5, 80.0, 88.0, 97.5)  # HITEC Grid to KPHB
add_c("E-HYD-108", "LOC-HYD-2", "LOC-HYD-35", "Electricity", 20.0, 2.1, 60.0, 72.0, 98.0)
add_c("E-HYD-109", "LOC-HYD-3", "LOC-HYD-15", "Electricity", 16.0, 1.5, 50.0, 64.0, 99.0)  # Gachibowli to Continental Hosp
add_c("E-HYD-110", "LOC-HYD-3", "LOC-HYD-20", "Electricity", 28.0, 2.9, 85.0, 89.0, 98.5)  # Gachibowli to Financial Dist
add_c("E-HYD-111", "LOC-HYD-3", "LOC-HYD-43", "Electricity", 22.0, 2.5, 65.0, 76.0, 97.8)
add_c("E-HYD-112", "LOC-HYD-4", "LOC-HYD-16", "Electricity", 25.0, 3.2, 60.0, 84.0, 98.0)  # Chandrayangutta to Osmania Hosp
add_c("E-HYD-113", "LOC-HYD-4", "LOC-HYD-46", "Electricity", 19.0, 2.1, 55.0, 75.0, 97.2)  # Chandrayangutta to Charminar
add_c("E-HYD-114", "LOC-HYD-4", "LOC-HYD-47", "Electricity", 14.0, 1.8, 40.0, 60.0, 96.5)
add_c("E-HYD-115", "LOC-HYD-5", "LOC-HYD-22", "Electricity", 38.0, 4.8, 80.0, 92.0, 97.0)  # Mallapur to Cherlapally
add_c("E-HYD-116", "LOC-HYD-5", "LOC-HYD-44", "Electricity", 29.0, 3.6, 60.0, 70.0, 98.0)
add_c("E-HYD-117", "LOC-HYD-11", "LOC-HYD-12", "Electricity", 8.0, 0.9, 35.0, 45.0, 99.5)  # NIMS ↔ Yashoda backup
add_c("E-HYD-118", "LOC-HYD-13", "LOC-HYD-34", "Electricity", 16.0, 1.8, 45.0, 62.0, 98.8)  # Apollo ↔ Jubilee Hills
add_c("E-HYD-119", "LOC-HYD-14", "LOC-HYD-26", "Electricity", 18.0, 1.9, 50.0, 66.0, 99.0)  # KIMS ↔ Secunderabad
add_c("E-HYD-120", "LOC-HYD-17", "LOC-HYD-48", "Electricity", 9.0, 0.8, 40.0, 52.0, 99.8)  # Emergency ↔ Secretariat
add_c("E-HYD-121", "LOC-HYD-19", "LOC-HYD-21", "Electricity", 12.0, 1.5, 70.0, 85.0, 98.5)
add_c("E-HYD-122", "LOC-HYD-23", "LOC-HYD-24", "Electricity", 17.0, 2.0, 50.0, 74.0, 96.8)  # Sanathnagar ↔ Balanagar
add_c("E-HYD-123", "LOC-HYD-26", "LOC-HYD-41", "Electricity", 21.0, 2.8, 45.0, 65.0, 98.2)
add_c("E-HYD-124", "LOC-HYD-27", "LOC-HYD-31", "Electricity", 55.0, 18.0, 90.0, 72.0, 98.0) # Airport grid line
add_c("E-HYD-125", "LOC-HYD-28", "LOC-HYD-29", "Electricity", 11.0, 1.6, 35.0, 50.0, 99.0)
add_c("E-HYD-126", "LOC-HYD-30", "LOC-HYD-32", "Electricity", 16.0, 2.4, 50.0, 68.0, 97.5)
add_c("E-HYD-127", "LOC-HYD-33", "LOC-HYD-34", "Electricity", 14.0, 1.9, 40.0, 58.0, 98.2)
add_c("E-HYD-128", "LOC-HYD-38", "LOC-HYD-23", "Electricity", 13.0, 1.7, 45.0, 62.0, 97.8)
add_c("E-HYD-129", "LOC-HYD-39", "LOC-HYD-40", "Electricity", 10.0, 1.5, 35.0, 54.0, 98.0)
add_c("E-HYD-130", "LOC-HYD-41", "LOC-HYD-42", "Electricity", 7.0, 1.1, 30.0, 48.0, 98.5)
add_c("E-HYD-131", "LOC-HYD-50", "LOC-HYD-51", "Electricity", 8.0, 1.4, 15.0, 40.0, 91.0)  # Isolated Shamirpet cluster E line
add_c("E-HYD-132", "LOC-HYD-52", "LOC-HYD-53", "Electricity", 6.5, 1.1, 12.0, 32.0, 90.0)  # Isolated Ibrahimpatnam cluster E line
add_c("E-HYD-133", "LOC-HYD-54", "LOC-HYD-55", "Electricity", 9.0, 1.5, 18.0, 42.0, 92.0)  # Isolated Medchal cluster E line

# 2. HYDERABAD WATER SUPPLY PIPELINE NETWORK (Water Pipes)
add_c("W-HYD-201", "LOC-HYD-6", "LOC-HYD-13", "Water", 38.0, 6.5, 35.0, 88.0, 97.0)  # Osmansagar to Apollo/Jubilee
add_c("W-HYD-202", "LOC-HYD-6", "LOC-HYD-19", "Water", 45.0, 8.2, 45.0, 95.0, 96.5)  # Osmansagar to HITEC City
add_c("W-HYD-203", "LOC-HYD-6", "LOC-HYD-45", "Water", 32.0, 5.4, 30.0, 82.0, 97.5)  # Osmansagar to Mehdipatnam
add_c("W-HYD-204", "LOC-HYD-7", "LOC-HYD-20", "Water", 40.0, 7.1, 40.0, 92.0, 96.0)  # Himayatsagar to Financial Dist
add_c("W-HYD-205", "LOC-HYD-7", "LOC-HYD-27", "Water", 58.0, 12.0, 50.0, 78.0, 98.0) # Himayatsagar to Airport
add_c("W-HYD-206", "LOC-HYD-7", "LOC-HYD-46", "Water", 36.0, 6.8, 35.0, 86.0, 97.0)  # Himayatsagar to Charminar
add_c("W-HYD-207", "LOC-HYD-8", "LOC-HYD-26", "Water", 22.0, 2.9, 25.0, 76.0, 98.0)  # Krishna Water to Secunderabad
add_c("W-HYD-208", "LOC-HYD-8", "LOC-HYD-41", "Water", 18.0, 2.4, 20.0, 68.0, 97.5)
add_c("W-HYD-209", "LOC-HYD-8", "LOC-HYD-44", "Water", 28.0, 4.2, 30.0, 84.0, 96.8)
add_c("W-HYD-210", "LOC-HYD-9", "LOC-HYD-30", "Water", 35.0, 6.0, 35.0, 80.0, 96.0)  # Manjeera to Miyapur
add_c("W-HYD-211", "LOC-HYD-9", "LOC-HYD-32", "Water", 42.0, 7.5, 40.0, 89.0, 95.5)  # Manjeera to Kukatpally
add_c("W-HYD-212", "LOC-HYD-10", "LOC-HYD-11", "Water", 20.0, 2.8, 20.0, 74.0, 98.2) # Asif Nagar to NIMS Hospital
add_c("W-HYD-213", "LOC-HYD-10", "LOC-HYD-17", "Water", 16.0, 1.9, 15.0, 65.0, 98.5) # Asif Nagar to Lakdikapul Emergency
add_c("W-HYD-214", "LOC-HYD-10", "LOC-HYD-48", "Water", 24.0, 3.2, 22.0, 85.0, 98.0) # Asif Nagar to Secretariat
add_c("W-HYD-215", "LOC-HYD-11", "LOC-HYD-12", "Water", 10.0, 0.9, 12.0, 50.0, 99.0)
add_c("W-HYD-216", "LOC-HYD-14", "LOC-HYD-37", "Water", 19.0, 2.5, 18.0, 62.0, 97.8)
add_c("W-HYD-217", "LOC-HYD-16", "LOC-HYD-28", "Water", 14.0, 1.4, 15.0, 68.0, 98.0)
add_c("W-HYD-218", "LOC-HYD-19", "LOC-HYD-21", "Water", 15.0, 1.5, 25.0, 94.0, 95.0)  # Overload warning line!
add_c("W-HYD-219", "LOC-HYD-22", "LOC-HYD-44", "Water", 31.0, 4.9, 30.0, 88.0, 96.2)
add_c("W-HYD-220", "LOC-HYD-28", "LOC-HYD-36", "Water", 26.0, 3.8, 22.0, 75.0, 97.0)
add_c("W-HYD-221", "LOC-HYD-31", "LOC-HYD-36", "Water", 22.0, 3.1, 20.0, 70.0, 97.5)
add_c("W-HYD-222", "LOC-HYD-33", "LOC-HYD-34", "Water", 18.0, 2.2, 18.0, 60.0, 98.0)
add_c("W-HYD-223", "LOC-HYD-38", "LOC-HYD-23", "Water", 17.0, 2.1, 16.0, 58.0, 97.2)
add_c("W-HYD-224", "LOC-HYD-39", "LOC-HYD-49", "Water", 12.0, 1.3, 14.0, 52.0, 98.5)
add_c("W-HYD-225", "LOC-HYD-41", "LOC-HYD-42", "Water", 9.0, 1.1, 12.0, 48.0, 99.0)
add_c("W-HYD-226", "LOC-HYD-50", "LOC-HYD-51", "Water", 6.0, 1.4, 6.0, 35.0, 89.0)   # Isolated Shamirpet W line
add_c("W-HYD-227", "LOC-HYD-52", "LOC-HYD-53", "Water", 5.0, 1.1, 5.0, 30.0, 88.0)   # Isolated Ibrahimpatnam W line
add_c("W-HYD-228", "LOC-HYD-54", "LOC-HYD-55", "Water", 7.0, 1.5, 7.0, 38.0, 90.0)   # Isolated Medchal W line

# 3. HYDERABAD ROAD TRANSPORTATION ARTERIAL NETWORK (Road Arterials, Expressways, Flyovers)
add_c("R-HYD-301", "LOC-HYD-19", "LOC-HYD-21", "Road", 42.0, 1.5, 45000.0, 88.0, 98.0) # HITEC Cyber Towers ↔ Mindspace
add_c("R-HYD-302", "LOC-HYD-19", "LOC-HYD-35", "Road", 38.0, 2.1, 38000.0, 82.0, 97.5) # Cyber Towers ↔ Kondapur
add_c("R-HYD-303", "LOC-HYD-19", "LOC-HYD-32", "Road", 55.0, 4.5, 52000.0, 96.0, 96.5) # Cyber Towers ↔ KPHB (Critical traffic!)
add_c("R-HYD-304", "LOC-HYD-20", "LOC-HYD-15", "Road", 28.0, 1.8, 30000.0, 75.0, 98.0) # Financial Dist ↔ Continental Hosp
add_c("R-HYD-305", "LOC-HYD-20", "LOC-HYD-18", "Road", 32.0, 2.5, 32000.0, 78.0, 97.8) # Financial Dist ↔ Police Command
add_c("R-HYD-306", "LOC-HYD-13", "LOC-HYD-34", "Road", 25.0, 1.8, 28000.0, 68.0, 98.5) # Apollo ↔ Jubilee Hills Road 36
add_c("R-HYD-307", "LOC-HYD-34", "LOC-HYD-33", "Road", 30.0, 2.4, 32000.0, 74.0, 98.0) # Jubilee Hills ↔ Banjara Hills
add_c("R-HYD-308", "LOC-HYD-33", "LOC-HYD-11", "Road", 35.0, 2.9, 36000.0, 85.0, 97.2) # Banjara Hills ↔ NIMS Punjagutta
add_c("R-HYD-309", "LOC-HYD-11", "LOC-HYD-12", "Road", 18.0, 0.9, 25000.0, 60.0, 99.0) # NIMS ↔ Yashoda Somajiguda
add_c("R-HYD-310", "LOC-HYD-12", "LOC-HYD-37", "Road", 22.0, 1.4, 28000.0, 72.0, 98.5) # Somajiguda ↔ Begumpet
add_c("R-HYD-311", "LOC-HYD-37", "LOC-HYD-1", "Road", 16.0, 1.0, 22000.0, 58.0, 99.0)  # Begumpet flyover
add_c("R-HYD-312", "LOC-HYD-1", "LOC-HYD-23", "Road", 32.0, 2.4, 26000.0, 70.0, 97.5) # Begumpet ↔ Sanathnagar
add_c("R-HYD-313", "LOC-HYD-23", "LOC-HYD-38", "Road", 24.0, 1.7, 24000.0, 65.0, 98.0) # Sanathnagar ↔ Ameerpet
add_c("R-HYD-314", "LOC-HYD-38", "LOC-HYD-11", "Road", 20.0, 1.5, 30000.0, 80.0, 98.2) # Ameerpet ↔ Punjagutta
add_c("R-HYD-315", "LOC-HYD-11", "LOC-HYD-17", "Road", 28.0, 2.2, 28000.0, 76.0, 98.5) # Punjagutta ↔ Lakdikapul
add_c("R-HYD-316", "LOC-HYD-17", "LOC-HYD-48", "Road", 15.0, 1.1, 20000.0, 52.0, 99.5) # Lakdikapul ↔ Secretariat
add_c("R-HYD-317", "LOC-HYD-48", "LOC-HYD-29", "Road", 18.0, 1.4, 24000.0, 64.0, 99.0) # Secretariat ↔ Nampally
add_c("R-HYD-318", "LOC-HYD-29", "LOC-HYD-39", "Road", 14.0, 1.0, 22000.0, 60.0, 98.8) # Nampally ↔ Abids
add_c("R-HYD-319", "LOC-HYD-39", "LOC-HYD-28", "Road", 22.0, 1.8, 28000.0, 78.0, 98.2) # Abids ↔ MGBS Imlibun
add_c("R-HYD-320", "LOC-HYD-28", "LOC-HYD-16", "Road", 12.0, 0.9, 20000.0, 55.0, 99.0) # MGBS ↔ Osmania Hospital
add_c("R-HYD-321", "LOC-HYD-16", "LOC-HYD-49", "Road", 10.0, 0.7, 18000.0, 48.0, 99.2) # Osmania ↔ High Court Nayapul
add_c("R-HYD-322", "LOC-HYD-49", "LOC-HYD-46", "Road", 16.0, 1.2, 25000.0, 84.0, 97.8) # Nayapul ↔ Charminar
add_c("R-HYD-323", "LOC-HYD-46", "LOC-HYD-47", "Road", 26.0, 3.4, 22000.0, 68.0, 97.0) # Charminar ↔ Falaknuma
add_c("R-HYD-324", "LOC-HYD-47", "LOC-HYD-4", "Road", 20.0, 2.3, 18000.0, 60.0, 97.5)  # Falaknuma ↔ Chandrayangutta
add_c("R-HYD-325", "LOC-HYD-45", "LOC-HYD-17", "Road", 30.0, 2.8, 35000.0, 82.0, 98.0) # Mehdipatnam ↔ Lakdikapul (PVNR Expressway)
add_c("R-HYD-326", "LOC-HYD-45", "LOC-HYD-27", "Road", 85.0, 16.5, 48000.0, 74.0, 98.8)# PVNR Expressway to Airport Shamshabad
add_c("R-HYD-327", "LOC-HYD-27", "LOC-HYD-31", "Road", 95.0, 22.0, 55000.0, 68.0, 98.5)# Outer Ring Road ORR Shamshabad ↔ LB Nagar
add_c("R-HYD-328", "LOC-HYD-31", "LOC-HYD-36", "Road", 28.0, 3.2, 38000.0, 86.0, 97.5) # LB Nagar ↔ Dilsukhnagar
add_c("R-HYD-329", "LOC-HYD-36", "LOC-HYD-28", "Road", 32.0, 4.1, 40000.0, 90.0, 97.0) # Dilsukhnagar ↔ MGBS
add_c("R-HYD-330", "LOC-HYD-31", "LOC-HYD-44", "Road", 45.0, 6.2, 42000.0, 78.0, 97.2) # LB Nagar ↔ Uppal Ring Road
add_c("R-HYD-331", "LOC-HYD-44", "LOC-HYD-41", "Road", 28.0, 3.5, 30000.0, 70.0, 98.0) # Uppal ↔ Tarnaka
add_c("R-HYD-332", "LOC-HYD-41", "LOC-HYD-26", "Road", 25.0, 3.1, 35000.0, 82.0, 98.2) # Tarnaka ↔ Secunderabad Station
add_c("R-HYD-333", "LOC-HYD-26", "LOC-HYD-14", "Road", 18.0, 1.8, 25000.0, 62.0, 98.8) # Secunderabad ↔ KIMS
add_c("R-HYD-334", "LOC-HYD-14", "LOC-HYD-37", "Road", 24.0, 2.6, 28000.0, 68.0, 98.0) # KIMS ↔ Begumpet
add_c("R-HYD-335", "LOC-HYD-30", "LOC-HYD-32", "Road", 35.0, 4.2, 38000.0, 84.0, 97.5) # Miyapur ↔ Kukatpally KPHB
add_c("R-HYD-336", "LOC-HYD-32", "LOC-HYD-24", "Road", 30.0, 3.8, 30000.0, 72.0, 97.0) # KPHB ↔ Balanagar
add_c("R-HYD-337", "LOC-HYD-24", "LOC-HYD-25", "Road", 32.0, 4.5, 26000.0, 65.0, 96.5) # Balanagar ↔ Jeedimetla
add_c("R-HYD-338", "LOC-HYD-22", "LOC-HYD-44", "Road", 40.0, 5.8, 32000.0, 76.0, 96.8) # Cherlapally ↔ Uppal
add_c("R-HYD-339", "LOC-HYD-40", "LOC-HYD-48", "Road", 16.0, 1.6, 22000.0, 58.0, 99.0) # Himayatnagar ↔ Secretariat
add_c("R-HYD-340", "LOC-HYD-42", "LOC-HYD-40", "Road", 22.0, 2.9, 20000.0, 54.0, 98.2) # Osmania Univ ↔ Himayatnagar
add_c("R-HYD-341", "LOC-HYD-50", "LOC-HYD-51", "Road", 14.0, 1.4, 8000.0, 30.0, 91.0)  # Isolated Shamirpet Road
add_c("R-HYD-342", "LOC-HYD-52", "LOC-HYD-53", "Road", 12.0, 1.1, 6000.0, 25.0, 90.0)  # Isolated Ibrahimpatnam Road
add_c("R-HYD-343", "LOC-HYD-54", "LOC-HYD-55", "Road", 15.0, 1.5, 9000.0, 35.0, 92.0)  # Isolated Medchal Road

print(f"Loaded REAL HYDERABAD CITY DATASET: {len(DEMO_LOCATIONS)} locations and {len(DEMO_CONNECTIONS)} connections.")
