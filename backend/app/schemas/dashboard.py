from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_applications: int
    pending: int
    approved: int
    rejected: int
    total_citizens: int
    total_documents: int