from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from app.config import Settings

settings = Settings()

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from app.models.user import User
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        from app.auth.security import hash_password
        # Always update or create admin user with current config credentials
        admin = db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
        if not admin:
            # Check if any admin exists
            admin = db.query(User).filter(User.role == "admin").first()
        
        if admin:
            # Update existing admin
            admin.username = settings.ADMIN_USERNAME
            admin.hashed_password = hash_password(settings.ADMIN_PASSWORD)
            admin.is_active = True
        else:
            # Create new admin
            admin = User(
                username=settings.ADMIN_USERNAME,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                role="admin",
                is_active=True,
            )
            db.add(admin)
        db.commit()
    finally:
        db.close()

