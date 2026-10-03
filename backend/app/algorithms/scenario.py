from typing import List, Dict, Any
from ..schemas import ScenarioResult

def run_scenario_planning(
    locations: List[dict],
    connections: List[dict],
    scenario_name: str,
    population: int,
    elec_demand_mw: float,
    water_demand_mld: float,
    traffic_demand_vpd: float,
    target_location_type: str
) -> ScenarioResult:
    """
    Evaluates What-If urban expansion scenarios (e.g. New Industrial Zone / Satellite City Township).
    Calculates additional infrastructure link requirements, cost estimates in ₹ Lakhs / ₹ Crores, and potential grid bottlenecks.
    """
    # Find nearest sub-station, water treatment plant, and major transport hub
    power_stations = [loc for loc in locations if "Power" in loc["type"] or "Station" in loc["type"]]
    water_plants = [loc for loc in locations if "Water" in loc["type"]]
    transport_hubs = [loc for loc in locations if "Transport" in loc["type"] or "Hub" in loc["type"] or "Road" in loc["type"]]

    nearest_power = power_stations[0]["name"] if power_stations else "Main Grid Substation"
    nearest_water = water_plants[0]["name"] if water_plants else "Central Water Reservoir"
    nearest_hub = transport_hubs[0]["name"] if transport_hubs else "City Ring Road"

    # Estimate required new connections
    elec_cost = round(elec_demand_mw * 12.5, 1)  # ₹ Lakhs per MW
    water_cost = round(water_demand_mld * 18.0, 1)  # ₹ Lakhs per MLD
    road_cost = round(traffic_demand_vpd * 0.05, 1)  # ₹ Lakhs per vehicle capacity

    total_const_cost = elec_cost + water_cost + road_cost
    total_maint_cost = round(total_const_cost * 0.08, 1)  # 8% annual maintenance

    new_conns = [
        {
            "infrastructure": "Electricity",
            "source": nearest_power,
            "target": f"Proposed {scenario_name}",
            "capacity": f"{elec_demand_mw * 1.25:.1f} MW",
            "estimated_cost": f"₹{elec_cost:.1f} Lakhs"
        },
        {
            "infrastructure": "Water",
            "source": nearest_water,
            "target": f"Proposed {scenario_name}",
            "capacity": f"{water_demand_mld * 1.20:.1f} MLD",
            "estimated_cost": f"₹{water_cost:.1f} Lakhs"
        },
        {
            "infrastructure": "Road",
            "source": nearest_hub,
            "target": f"Proposed {scenario_name}",
            "capacity": f"{traffic_demand_vpd * 1.15:.0f} vehicles/day",
            "estimated_cost": f"₹{road_cost:.1f} Lakhs"
        }
    ]

    bottlenecks = [
        f"Heavy load addition of {elec_demand_mw} MW may overload transmission lines from '{nearest_power}' during peak hours.",
        f"Water supply demand of {water_demand_mld} MLD requires pressure booster pumps along main trunk line from '{nearest_water}'."
    ]

    recommendations = [
        f"Construct dual 33kV dedicated power line from '{nearest_power}' to avoid single point of failure.",
        f"Laying 600mm DI water pipeline from '{nearest_water}' with automated telemetry control.",
        f"Expand arterial road connecting '{nearest_hub}' to 4 lanes to handle projected {traffic_demand_vpd:,} vehicles/day."
    ]

    return ScenarioResult(
        scenario_name=scenario_name,
        additional_locations_required=1,
        recommended_new_connections=new_conns,
        estimated_construction_cost=total_const_cost,
        estimated_maintenance_cost=total_maint_cost,
        potential_bottlenecks=bottlenecks,
        infrastructure_upgrade_recommendations=recommendations
    )
