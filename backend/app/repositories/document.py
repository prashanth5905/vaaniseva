from sqlalchemy.orm import Session

from app.models.document import Document


def create_document(
    db: Session,
    document: Document,
):
    db.add(document)
    db.commit()
    db.refresh(document)

    return document


def get_documents_by_citizen(
    db: Session,
    citizen_id: int,
):
    return (
        db.query(Document)
        .filter(
            Document.citizen_id == citizen_id
        )
        .order_by(
            Document.uploaded_at.desc()
        )
        .all()
    )


def get_document_by_id(
    db: Session,
    document_id: int,
):
    return (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

def get_documents_by_citizen_id(
    db,
    citizen_id: int,
):
    return (
        db.query(Document)
        .filter(Document.citizen_id == citizen_id)
        .all()
    )

def get_document_by_id(
    db: Session,
    document_id:int
):

    return db.get(
        Document,
        document_id
    )