import heapq
from typing import List, Dict, Tuple, Optional
from ..schemas import ShortestPathResult, ShortestPathStep

def run_dijkstra(
    locations: List[dict],
    connections: List[dict],
    source_id: str,
    target_id: str,
    metric: str = "cost",
    infra_filter: Optional[str] = "All"
) -> ShortestPathResult:
    """
    Computes the least-cost path between source_id and target_id using Dijkstra's Algorithm with a priority queue (min-heap).
    Metric options: 'cost', 'distance', 'travel_time'.
    Returns optimal route, total cost, total distance, travel time, number of hops, and execution step details.
    """
    node_map = {loc["id"]: loc for loc in locations}
    
    if source_id not in node_map or target_id not in node_map:
        return ShortestPathResult(
            found=False,
            source_id=source_id,
            target_id=target_id,
            route_node_ids=[],
            route_node_names=[],
            edge_ids=[],
            total_cost=0.0,
            total_distance=0.0,
            estimated_travel_time=0.0,
            number_of_hops=0,
            execution_steps=[ShortestPathStep(step_index=1, current_node="", tentative_distances={}, visited_nodes=[], action_description="Error: Source or Target location does not exist in network.")]
        )

    # Filter connections by infra type if needed
    if infra_filter and infra_filter != "All":
        active_conns = [c for c in connections if c["infrastructure_type"] == infra_filter and c.get("status", "Active") != "Failed"]
    else:
        active_conns = [c for c in connections if c.get("status", "Active") != "Failed"]

    # Build adjacency list: node_id -> list of (neighbor_id, weight, distance, cost, travel_time, edge_id)
    adj: Dict[str, List[Tuple[str, float, float, float, float, str]]] = {loc["id"]: [] for loc in locations}

    for conn in active_conns:
        u = conn["source_id"]
        v = conn["target_id"]
        dist = conn["distance"]
        c_cost = conn["cost"]
        
        # Calculate travel time (min) based on road capacity or distance: ~ 30 km/h average for utility/traffic
        time_min = (dist / 40.0) * 60.0
        
        if metric == "distance":
            weight = dist
        elif metric == "travel_time":
            weight = time_min
        else:
            weight = c_cost

        if u in adj and v in adj:
            adj[u].append((v, weight, dist, c_cost, time_min, conn["id"]))
            adj[v].append((u, weight, dist, c_cost, time_min, conn["id"]))

    # Priority Queue & Tracking Data Structures
    pq: List[Tuple[float, str]] = []
    distances: Dict[str, float] = {loc_id: float('inf') for loc_id in node_map}
    parent_node: Dict[str, Optional[str]] = {loc_id: None for loc_id in node_map}
    parent_edge: Dict[str, Optional[str]] = {loc_id: None for loc_id in node_map}
    
    distances[source_id] = 0.0
    heapq.heappush(pq, (0.0, source_id))
    
    visited: List[str] = []
    steps: List[ShortestPathStep] = []
    step_counter = 1

    steps.append(ShortestPathStep(
        step_index=step_counter,
        current_node=source_id,
        tentative_distances={k: (v if v != float('inf') else 999999.0) for k, v in list(distances.items())[:10]},
        visited_nodes=list(visited),
        action_description=f"Initialized Dijkstra search from '{node_map[source_id]['name']}'. Distance set to 0."
    ))
    step_counter += 1

    while pq:
        curr_dist, u = heapq.heappop(pq)

        if u in visited:
            continue

        visited.append(u)

        if u == target_id:
            steps.append(ShortestPathStep(
                step_index=step_counter,
                current_node=u,
                tentative_distances={k: (v if v != float('inf') else 999999.0) for k, v in list(distances.items())[:10]},
                visited_nodes=list(visited),
                action_description=f"Destination '{node_map[target_id]['name']}' reached with minimum accumulated {metric} of {curr_dist:.2f}."
            ))
            break

        # Relax neighbors
        for v, weight, dist, c_cost, time_min, edge_id in adj[u]:
            if v not in visited:
                new_dist = curr_dist + weight
                if new_dist < distances[v]:
                    distances[v] = new_dist
                    parent_node[v] = u
                    parent_edge[v] = edge_id
                    heapq.heappush(pq, (new_dist, v))

                    if step_counter <= 30:  # Trace up to 30 key relaxation steps
                        steps.append(ShortestPathStep(
                            step_index=step_counter,
                            current_node=u,
                            tentative_distances={k: (v_d if v_d != float('inf') else 999999.0) for k, v_d in list(distances.items())[:10]},
                            visited_nodes=list(visited),
                            action_description=f"Relaxed edge ({node_map[u]['name']} → {node_map[v]['name']}): Updated tentative {metric} of '{node_map[v]['name']}' to {new_dist:.2f}."
                        ))
                        step_counter += 1

    # Reconstruct Path
    if distances[target_id] == float('inf'):
        return ShortestPathResult(
            found=False,
            source_id=source_id,
            target_id=target_id,
            route_node_ids=[],
            route_node_names=[],
            edge_ids=[],
            total_cost=0.0,
            total_distance=0.0,
            estimated_travel_time=0.0,
            number_of_hops=0,
            execution_steps=steps
        )

    path_nodes = []
    path_edges = []
    curr = target_id
    
    while curr is not None:
        path_nodes.append(curr)
        edge_id = parent_edge[curr]
        if edge_id:
            path_edges.append(edge_id)
        curr = parent_node[curr]

    path_nodes.reverse()
    path_edges.reverse()

    # Calculate actual totals along path
    conn_map = {c["id"]: c for c in connections}
    total_c = sum(conn_map[eid]["cost"] for eid in path_edges if eid in conn_map)
    total_d = sum(conn_map[eid]["distance"] for eid in path_edges if eid in conn_map)
    total_t = (total_d / 40.0) * 60.0

    return ShortestPathResult(
        found=True,
        source_id=source_id,
        target_id=target_id,
        route_node_ids=path_nodes,
        route_node_names=[node_map[nid]["name"] for nid in path_nodes],
        edge_ids=path_edges,
        total_cost=round(total_c, 2),
        total_distance=round(total_d, 2),
        estimated_travel_time=round(total_t, 1),
        number_of_hops=len(path_nodes) - 1,
        execution_steps=steps
    )
