from typing import List, Set
from ..schemas import FailureSimulationResult, ConnectivityComponent
from .connectivity import run_connectivity_analysis

def run_failure_simulation(
    locations: List[dict],
    connections: List[dict],
    failed_connection_ids: List[str],
    failed_node_ids: List[str]
) -> FailureSimulationResult:
    """
    Simulates physical infrastructure failures (road cut, power line snap, water pipeline burst).
    Calculates before vs after connected components, disconnected population, isolated critical facilities, and alternative route status.
    """
    # Baseline connectivity
    before_result = run_connectivity_analysis(locations, connections)

    # Filter out failed connections and nodes
    active_locs = [loc for loc in locations if loc["id"] not in failed_node_ids]
    failed_nodes_set = set(failed_node_ids)
    failed_conns_set = set(failed_connection_ids)

    active_conns = [
        c for c in connections
        if c["id"] not in failed_conns_set
        and c["source_id"] not in failed_nodes_set
        and c["target_id"] not in failed_nodes_set
    ]

    # After-failure connectivity
    after_result = run_connectivity_analysis(active_locs, active_conns)

    # Affected population delta
    loc_map = {loc["id"]: loc for loc in locations}
    isolated_facilities: List[str] = []

    if after_result.total_components > before_result.total_components:
        # Identify isolated sub-components
        for comp in after_result.components[1:]:
            for nid in comp.node_ids:
                if loc_map[nid]["priority"] in ["Critical", "High"]:
                    isolated_facilities.append(f"{loc_map[nid]['name']} ({loc_map[nid]['type']})")

    disconnected_pop = sum(c.population_affected for c in after_result.components[1:]) if len(after_result.components) > 1 else 0

    has_alternative = (after_result.total_components == before_result.total_components)

    summary = (
        f"FAILURE SIMULATION COMPLETE: Deactivated {len(failed_connection_ids)} connection(s) and {len(failed_node_ids)} location(s). "
        f"Network split from {before_result.total_components} to {after_result.total_components} component(s). "
        f"{disconnected_pop:,} residents disconnected from main grid."
    )

    return FailureSimulationResult(
        before_component_count=before_result.total_components,
        after_component_count=after_result.total_components,
        disconnected_population=disconnected_pop,
        critical_facilities_isolated=isolated_facilities,
        alternative_routes_available=has_alternative,
        affected_components=after_result.components,
        summary_message=summary
    )
