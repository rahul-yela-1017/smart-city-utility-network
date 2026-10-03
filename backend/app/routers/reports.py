from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from ..database import get_db
from .analysis import _get_network_dicts
from ..algorithms.report import generate_pdf_report
from ..algorithms.connectivity import run_connectivity_analysis
from ..algorithms.mst import run_kruskal_mst
from ..algorithms.vulnerability import run_vulnerability_analysis
from ..algorithms.capacity import run_capacity_analysis

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/pdf")
def download_pdf_report(db: Session = Depends(get_db)):
    locs, conns = _get_network_dicts(db)
    pdf_bytes = generate_pdf_report(locs, conns)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=CITYGRID_SmartCity_ExecutiveReport.pdf"}
    )

@router.get("/summary")
def get_executive_summary(db: Session = Depends(get_db)):
    locs, conns = _get_network_dicts(db)
    conn_res = run_connectivity_analysis(locs, conns)
    mst_res = run_kruskal_mst(locs, conns, "All")
    vuln_res = run_vulnerability_analysis(locs, conns)
    cap_res = run_capacity_analysis(conns, locs)

    tot_pop = sum(l["population"] for l in locs)
    tot_cost = sum(c["cost"] for c in conns)

    return {
        "location_count": len(locs),
        "connection_count": len(conns),
        "total_population": tot_pop,
        "total_infrastructure_cost_lakhs": tot_cost,
        "connected_components": conn_res.total_components,
        "mst_optimized_cost_lakhs": mst_res.optimized_cost,
        "mst_savings_lakhs": mst_res.potential_savings,
        "mst_savings_percentage": mst_res.savings_percentage,
        "resilience_score": vuln_res.overall_resilience_score,
        "single_points_of_failure_count": len(vuln_res.single_points_of_failure),
        "high_risk_locations_count": vuln_res.high_risk_count,
        "overloaded_connections_count": cap_res.warning_count + cap_res.critical_count
    }
