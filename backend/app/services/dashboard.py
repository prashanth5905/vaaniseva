from sqlalchemy.orm import Session

from app.repositories.dashboard import get_dashboard_stats
from app.schemas.dashboard import DashboardResponse


def get_dashboard(db: Session) -> DashboardResponse:
    stats = get_dashboard_stats(db)

    return DashboardResponse(
        total_applications=stats["total_applications"],
        pending=stats["pending"],
        approved=stats["approved"],
        rejected=stats["rejected"],
        total_citizens=stats["total_citizens"],
        total_documents=stats["total_documents"],
    )