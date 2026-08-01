from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import all models so SQLAlchemy registers them
import app.models  # noqa: E402,F401