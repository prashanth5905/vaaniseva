import os
from datetime import datetime

from reportlab.lib.colors import HexColor
from reportlab.lib.units import inch
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas

def generate_certificate(
    application_id: int,
    citizen_name: str,
    service_name: str,
):
    os.makedirs("certificates", exist_ok=True)

    filename = f"certificate_{application_id}.pdf"
    filepath = os.path.join("certificates", filename)

    pdf = canvas.Canvas(filepath)
    width, height = pdf._pagesize

    # ===== Border =====
    pdf.setStrokeColor(HexColor("#0B5394"))
    pdf.setLineWidth(4)
    pdf.rect(30, 30, width - 60, height - 60)

    pdf.setLineWidth(1)
    pdf.rect(40, 40, width - 80, height - 80)

    # ===== Header =====
    pdf.setFont("Helvetica-Bold", 24)
    pdf.setFillColor(HexColor("#0B5394"))

    title = "VAANISEVA"
    pdf.drawString(
        (width - stringWidth(title, "Helvetica-Bold", 24)) / 2,
        760,
        title,
    )

    pdf.setFont("Helvetica", 14)

    subtitle = "Government Service Portal"
    pdf.drawString(
        (width - stringWidth(subtitle, "Helvetica", 14)) / 2,
        735,
        subtitle,
    )

    govt = "Government of Andhra Pradesh"
    pdf.drawString(
        (width - stringWidth(govt, "Helvetica", 14)) / 2,
        715,
        govt,
    )

    pdf.line(70, 700, width - 70, 700)

    # ===== Certificate Title =====
    pdf.setFont("Helvetica-Bold", 20)

    cert = "CERTIFICATE"
    pdf.drawString(
        (width - stringWidth(cert, "Helvetica-Bold", 20)) / 2,
        665,
        cert,
    )

    # ===== Certificate Number =====
    # ===== Certificate Info Box =====

    pdf.setLineWidth(1)

    pdf.rect(
        65,
        575,
        230,
        60,
    )

    pdf.setFont("Helvetica", 12)

    pdf.drawString(
        80,
        615,
        f"Certificate No : VS-2026-{application_id:06d}",
    )

    pdf.drawString(
        80,
        595,
        "Issue Date : " +
        datetime.now().strftime("%d %B %Y"),
    )

    # ===== Body =====
    pdf.setFont("Helvetica", 14)

    body = "This certificate is hereby issued to"
    pdf.drawString(
        (width - stringWidth(body, "Helvetica", 14)) / 2,
        540,
        body,
    )

    pdf.setFont("Helvetica-Bold", 22)

    name = citizen_name.upper()
    pdf.drawString(
        (width - stringWidth(name, "Helvetica-Bold", 22)) / 2,
        500,
        name,
    )

    pdf.setFont("Helvetica", 14)

    text = (
        "whose application has been verified "
        "and approved for"
    )
    pdf.drawString(
        (width - stringWidth(text, "Helvetica", 14)) / 2,
        460,
        text,
    )

    pdf.setFont("Helvetica-Bold", 18)

    service = service_name.upper()
    pdf.drawString(
        (width - stringWidth(service, "Helvetica-Bold", 18)) / 2,
        420,
        service,
    )

    pdf.setFont("Helvetica-Bold", 16)

    status = "STATUS : APPROVED"
    pdf.drawString(
        (width - stringWidth(status, "Helvetica-Bold", 16)) / 2,
        370,
        status,
    )

    # ===== Footer =====
    pdf.line(70, 170, width - 70, 170)

    pdf.setFont("Helvetica", 11)

    footer = "Issued electronically by VaaniSeva"
    pdf.drawString(
        (width - stringWidth(footer, "Helvetica", 11)) / 2,
        145,
        footer,
    )

    footer2 = "No physical signature is required."
    pdf.drawString(
        (width - stringWidth(footer2, "Helvetica", 11)) / 2,
        125,
        footer2,
    )

    pdf.setFont("Helvetica-Bold", 12)

    pdf.drawString(
        width - 180,
        85,
        "Authorized Officer",
    )

    pdf.save()

    return filepath