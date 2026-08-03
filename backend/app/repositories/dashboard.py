from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.citizen import Citizen
from app.models.document import Document


def get_dashboard_stats(db: Session):
    total_applications = db.query(Application).count()

    pending = (
        db.query(Application)
        .filter(Application.status == "pending")
        .count()
    )

    approved = (
        db.query(Application)
        .filter(Application.status == "approved")
        .count()
    )

    rejected = (
        db.query(Application)
        .filter(Application.status == "rejected")
        .count()
    )

    total_citizens = db.query(Citizen).count()

    total_documents = db.query(Document).count()

    return {
        "total_applications": total_applications,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "total_citizens": total_citizens,
        "total_documents": total_documents,
    }