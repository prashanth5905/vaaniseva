from datetime import date

from app.db.session import SessionLocal
from app.models.citizen import Citizen


def seed_citizens() -> None:
    db = SessionLocal()

    try:
        existing_citizen = (
            db.query(Citizen)
            .filter(Citizen.aadhaar_number == "111122223333")
            .first()
        )

        if existing_citizen:
            print("Synthetic citizen already exists.")
            return
            
        citizen = Citizen(
            aadhaar_number="111122223333",
            name="Ravi Kumar",
            registered_phone="9876500001",
            date_of_birth=date(1990, 4, 12),
            district="Guntur",
        )

        db.add(citizen)
        db.commit()

        print("Synthetic citizen added successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_citizens()