from typing import List, Dict, Optional
from ..schemas import MSTResult, MSTEdgeDetail

class DisjointSet:
    def __init__(self, elements: List[str]):
        self.parent = {el: el for el in elements}
        self.rank = {el: 0 for el in elements}

    def find(self, i: str) -> str:
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])  # Path compression
        return self.parent[i]

    def union(self, i: str, j: str) -> bool:
        root_i = self.find(i)
        root_j = self.find(j)

        if root_i != root_j:
            # Union by rank
            if self.rank[root_i] < self.rank[root_j]:
                root_i, root_j = root_j, root_i
            self.parent[root_j] = root_i
            if self.rank[root_i] == self.rank[root_j]:
                self.rank[root_i] += 1
            return True
        return False  # Already connected (cycle)


def run_kruskal_mst(locations: List[dict], connections: List[dict], infra_filter: Optional[str] = "All") -> MSTResult:
    """
    Computes the Minimum Spanning Tree (MST) using Kruskal's Algorithm with Disjoint Set Union (DSU).
    Filters connections by utility type if specified.
    Returns original vs optimized cost, selected edges, rejected cycle edges, and step explanations.
    """
    location_names = {loc["id"]: loc["name"] for loc in locations}
    all_node_ids = list(location_names.keys())

    # Filter connections by infrastructure type if needed
    if infra_filter and infra_filter != "All":
        filtered_conns = [c for c in connections if c["infrastructure_type"] == infra_filter]
    else:
        filtered_conns = list(connections)

    # Sort edges by cost (ascending order)
    sorted_conns = sorted(filtered_conns, key=lambda x: x["cost"])

    dsu = DisjointSet(all_node_ids)

    selected_edges: List[MSTEdgeDetail] = []
    rejected_edges: List[MSTEdgeDetail] = []
    execution_steps: List[str] = []

    original_cost = sum(c["cost"] for c in filtered_conns)
    optimized_cost = 0.0

    execution_steps.append(f"Initialization: Sorted {len(sorted_conns)} connections by construction cost (ascending).")

    for conn in sorted_conns:
        u = conn["source_id"]
        v = conn["target_id"]
        u_name = location_names.get(u, u)
        v_name = location_names.get(v, v)
        cost = conn["cost"]
        infra = conn["infrastructure_type"]

        if dsu.find(u) != dsu.find(v):
            dsu.union(u, v)
            optimized_cost += cost
            edge_detail = MSTEdgeDetail(
                id=conn["id"],
                source_id=u,
                target_id=v,
                source_name=u_name,
                target_name=v_name,
                cost=cost,
                infrastructure_type=infra,
                reason=f"SELECTED: Connects separate components '{u_name}' & '{v_name}' at min cost ₹{cost:.1f} L without forming a cycle."
            )
            selected_edges.append(edge_detail)
            execution_steps.append(f"ACCEPTED: Edge '{conn['id']}' ({u_name} ↔ {v_name}, ₹{cost:.1f} L). Connects disjoint sets.")
        else:
            edge_detail = MSTEdgeDetail(
                id=conn["id"],
                source_id=u,
                target_id=v,
                source_name=u_name,
                target_name=v_name,
                cost=cost,
                infrastructure_type=infra,
                reason=f"REJECTED: '{u_name}' & '{v_name}' are already connected via cheaper path. Adding edge creates redundant cycle."
            )
            rejected_edges.append(edge_detail)
            execution_steps.append(f"REJECTED: Edge '{conn['id']}' ({u_name} ↔ {v_name}, ₹{cost:.1f} L). Cycle detected.")

    potential_savings = max(0.0, original_cost - optimized_cost)
    savings_pct = (potential_savings / original_cost * 100.0) if original_cost > 0 else 0.0

    return MSTResult(
        original_cost=round(original_cost, 2),
        optimized_cost=round(optimized_cost, 2),
        potential_savings=round(potential_savings, 2),
        savings_percentage=round(savings_pct, 1),
        selected_edges=selected_edges,
        rejected_edges=rejected_edges,
        execution_steps=execution_steps[:60]
    )
