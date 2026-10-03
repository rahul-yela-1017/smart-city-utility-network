from typing import List
from ..schemas import CapacityReport, CapacityDetail

def run_capacity_analysis(connections: List[dict], locations: List[dict]) -> CapacityReport:
    """
    Evaluates infrastructure connection load against capacity limits.
    Classifies connections into:
    - Healthy: < 70%
    - Monitor: 70% - 85%
    - Warning: 85% - 95%
    - Critical: > 95%
    """
    loc_map = {loc["id"]: loc["name"] for loc in locations}
    
    healthy = 0
    monitor = 0
    warning = 0
    critical = 0

    overloaded: List[CapacityDetail] = []

    for conn in connections:
        cap = conn["capacity"]
        util = conn["utilization"]  # utilization rate in %
        
        # Calculate utilization percentage if needed
        rate = util if util <= 100.0 else min(100.0, (util / cap * 100.0) if cap > 0 else 100.0)

        u_name = loc_map.get(conn["source_id"], conn["source_id"])
        v_name = loc_map.get(conn["target_id"], conn["target_id"])

        if rate < 70.0:
            status = "Healthy"
            healthy += 1
            rec = "Operating within nominal design parameters."
        elif 70.0 <= rate < 85.0:
            status = "Monitor"
            monitor += 1
            rec = "Monitor seasonal load spikes."
        elif 85.0 <= rate < 95.0:
            status = "Warning"
            warning += 1
            rec = f"Schedule capacity expansion for {conn['infrastructure_type']} line '{conn['id']}'."
        else:
            status = "Critical"
            critical += 1
            rec = f"URGENT: Imminent bottleneck on {conn['infrastructure_type']} line '{conn['id']}' ({u_name} ↔ {v_name}). Upgrade pipeline/transformer immediately."

        if status in ["Warning", "Critical"]:
            overloaded.append(CapacityDetail(
                connection_id=conn["id"],
                source_name=u_name,
                target_name=v_name,
                infrastructure_type=conn["infrastructure_type"],
                capacity=cap,
                utilization_rate=round(rate, 1),
                status=status,
                recommendation=rec
            ))

    overloaded.sort(key=lambda x: x.utilization_rate, reverse=True)

    return CapacityReport(
        healthy_count=healthy,
        monitor_count=monitor,
        warning_count=warning,
        critical_count=critical,
        overloaded_connections=overloaded
    )
