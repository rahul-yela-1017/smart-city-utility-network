from typing import List, Dict, Set
from ..schemas import ConnectivityResult, ConnectivityComponent

def run_connectivity_analysis(locations: List[dict], connections: List[dict]) -> ConnectivityResult:
    """
    Computes Connected Components of the Smart City Utility network using Breadth-First Search (BFS).
    Tracks isolated nodes, disconnected regions, population impact, and critical facilities.
    """
    node_map = {loc["id"]: loc for loc in locations}
    adjacency: Dict[str, Set[str]] = {loc["id"]: set() for loc in locations}
    
    # Build undirected adjacency list
    for conn in connections:
        if conn["source_id"] in adjacency and conn["target_id"] in adjacency:
            adjacency[conn["source_id"]].add(conn["target_id"])
            adjacency[conn["target_id"]].add(conn["source_id"])

    visited: Set[str] = set()
    components: List[ConnectivityComponent] = []
    isolated_nodes: List[str] = []
    execution_steps: List[str] = []
    
    step_num = 1
    comp_id = 1

    for node_id, loc in node_map.items():
        if node_id not in visited:
            # Start BFS for component
            component_nodes: List[str] = []
            component_names: List[str] = []
            queue: List[str] = [node_id]
            visited.add(node_id)
            
            execution_steps.append(f"Step {step_num}: Start BFS traversal from node '{loc['name']}' (ID: {node_id})")
            step_num += 1

            edge_count_internal = 0
            
            while queue:
                curr = queue.pop(0)
                component_nodes.append(curr)
                component_names.append(node_map[curr]["name"])
                
                for neighbor in adjacency[curr]:
                    edge_count_internal += 1
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
                        execution_steps.append(f"Step {step_num}: Discovered neighbor '{node_map[neighbor]['name']}' from '{node_map[curr]['name']}'")
                        step_num += 1

            # Divide edge count by 2 since undirected
            edge_count_internal = edge_count_internal // 2

            # Calculate stats for this component
            total_pop = sum(node_map[nid]["population"] for nid in component_nodes)
            crit_facilities = [
                f"{node_map[nid]['name']} ({node_map[nid]['type']})"
                for nid in component_nodes
                if node_map[nid]["priority"] in ["Critical", "High"] or node_map[nid]["type"] in ["Hospital", "Power Station", "Water Treatment Plant", "Emergency Facility"]
            ]

            if len(component_nodes) == 1:
                isolated_nodes.append(node_map[node_id]["name"])

            comp_obj = ConnectivityComponent(
                id=comp_id,
                node_ids=component_nodes,
                node_names=component_names,
                population_affected=total_pop,
                critical_facilities=crit_facilities,
                edge_count=edge_count_internal
            )
            components.append(comp_obj)
            comp_id += 1

    # Disconnected facilities check
    disconnected_facilities = []
    if len(components) > 1:
        # Main component is the largest component
        components.sort(key=lambda c: len(c.node_ids), reverse=True)
        main_comp_nodes = set(components[0].node_ids)
        for comp in components[1:]:
            for nid in comp.node_ids:
                if node_map[nid]["priority"] in ["Critical", "High"]:
                    disconnected_facilities.append(f"{node_map[nid]['name']} in Sub-network #{comp.id}")

    largest_size = len(components[0].node_ids) if components else 0

    return ConnectivityResult(
        total_components=len(components),
        largest_component_size=largest_size,
        isolated_nodes=isolated_nodes,
        components=components,
        disconnected_facilities=disconnected_facilities,
        execution_steps=execution_steps[:50]  # Cap execution steps for display
    )
