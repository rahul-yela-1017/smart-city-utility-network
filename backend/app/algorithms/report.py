import os
import io
from typing import List, Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from .connectivity import run_connectivity_analysis
from .mst import run_kruskal_mst
from .vulnerability import run_vulnerability_analysis
from .capacity import run_capacity_analysis

def generate_pdf_report(locations: List[dict], connections: List[dict]) -> bytes:
    """
    Generates a professional Smart City Utility Network Intelligence Executive PDF Report.
    Includes Executive Summary, Connectivity Analysis, MST Optimization, Vulnerability & SPOF audit, and prioritized action plan.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        spaceAfter=15
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )

    story = []

    # Title & Header
    story.append(Paragraph("CITYGRID AI - Smart City Utility Intelligence Report", title_style))
    story.append(Paragraph("Comprehensive Urban Infrastructure Network Optimization & Resilience Audit", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#3b82f6'), spaceAfter=12))

    # Run actual analyses for real numbers
    conn_res = run_connectivity_analysis(locations, connections)
    mst_res = run_kruskal_mst(locations, connections, "All")
    vuln_res = run_vulnerability_analysis(locations, connections)
    cap_res = run_capacity_analysis(connections, locations)

    tot_pop = sum(l.get("population", 0) for l in locations)
    tot_cost = sum(c.get("cost", 0) for c in connections)

    # Executive Summary Card Table
    summary_data = [
        ["Metric", "Value", "Metric", "Value"],
        ["Total Network Locations", f"{len(locations):,}", "Network Connections", f"{len(connections):,}"],
        ["Connected Components", f"{conn_res.total_components}", "Network Resilience", f"{vuln_res.overall_resilience_score}%"],
        ["Total Infrastructure Cost", f"₹{tot_cost / 100:.2f} Cr", "MST Optimized Cost", f"₹{mst_res.optimized_cost / 100:.2f} Cr"],
        ["MST Savings Potential", f"₹{mst_res.potential_savings:.1f} L ({mst_res.savings_percentage}%)", "Single Points of Failure", f"{len(vuln_res.single_points_of_failure)}"]
    ]

    t_summary = Table(summary_data, colWidths=[150, 100, 150, 100])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))

    story.append(Paragraph("1. Executive Summary", h2_style))
    story.append(t_summary)
    story.append(Spacer(1, 10))

    # Section 2: Connectivity & Network Topology
    story.append(Paragraph("2. Network Topology & Connectivity Audit", h2_style))
    topo_text = (
        f"The network comprises <b>{len(locations)} locations</b> serving a total population of <b>{tot_pop:,}</b>. "
        f"The connectivity analysis decomposed the grid into <b>{conn_res.total_components} component(s)</b>. "
        f"The largest connected cluster contains {conn_res.largest_component_size} nodes. "
    )
    if conn_res.isolated_nodes:
        topo_text += f"<font color='#dc2626'><b>Isolated Locations Detected:</b> {', '.join(conn_res.isolated_nodes)}.</font>"
    story.append(Paragraph(topo_text, body_style))
    story.append(Spacer(1, 8))

    # Section 3: Optimization & Minimum Spanning Tree (MST)
    story.append(Paragraph("3. Kruskal Minimum Spanning Tree Optimization", h2_style))
    mst_text = (
        f"Applying Kruskal's MST algorithm with Disjoint Set Union (DSU) reduced redundant edge costs from "
        f"<b>₹{mst_res.original_cost:.1f} Lakhs</b> down to <b>₹{mst_res.optimized_cost:.1f} Lakhs</b>, achieving an estimated "
        f"capital expenditure savings of <b>₹{mst_res.potential_savings:.1f} Lakhs ({mst_res.savings_percentage}%)</b>. "
        f"Selected <b>{len(mst_res.selected_edges)} essential edges</b> while avoiding cycle redundancies."
    )
    story.append(Paragraph(mst_text, body_style))
    story.append(Spacer(1, 8))

    # Section 4: Single Points of Failure & Vulnerabilities
    story.append(Paragraph("4. Single Points of Failure (SPOF) & Vulnerability Analysis", h2_style))
    spof_text = (
        f"Tarjan's bridge-finding algorithm identified <b>{len(vuln_res.single_points_of_failure)} critical single-point dependencies</b>. "
        f"High-risk critical facilities count: <b>{vuln_res.high_risk_count}</b>. Overall network resilience index is rated at <b>{vuln_res.overall_resilience_score}/100</b>."
    )
    story.append(Paragraph(spof_text, body_style))

    if vuln_res.single_points_of_failure:
        spof_table_data = [["Connection ID", "Source", "Target", "Type", "Population Impact"]]
        for sp in vuln_res.single_points_of_failure[:5]:
            spof_table_data.append([sp.connection_id, sp.source_name[:18], sp.target_name[:18], sp.infrastructure_type, f"{sp.impact_population:,}"])
        t_spof = Table(spof_table_data, colWidths=[80, 120, 120, 80, 100])
        t_spof.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#fee2e2')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#991b1b')),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#fca5a5')),
            ('PADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(t_spof)

    story.append(Spacer(1, 10))

    # Section 5: Prioritized Action Plan
    story.append(Paragraph("5. Recommended Action Plan", h2_style))
    rec_data = [
        ["Priority", "Action Item", "Target Location / Infrastructure"],
        ["Immediate (0-3 mo)", "Construct redundant backup feeder lines for SPOF connections", f"{len(vuln_res.single_points_of_failure)} bridge connections"],
        ["Short-Term (3-12 mo)", "Upgrade overloaded transmission & pipeline lines", f"{cap_res.warning_count + cap_res.critical_count} warning/critical lines"],
        ["Long-Term (1-3 yrs)", "Implement MST minimum-cost network extension for new zones", "Regional expansion projects"]
    ]
    t_rec = Table(rec_data, colWidths=[110, 240, 150])
    t_rec.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e2e8f0')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_rec)

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
