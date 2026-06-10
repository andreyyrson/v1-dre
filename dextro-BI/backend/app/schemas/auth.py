import re
from pydantic import BaseModel, Field, field_validator

_EMAIL_RE = re.compile(r"^[^@\s]+@dextro$")


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)

    @field_validator("username")
    @classmethod
    def _check_dextro_domain(cls, v: str) -> str:
        if not _EMAIL_RE.match(v):
            raise ValueError("O email deve ter o domínio @dextro")
        return v.lower()


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    username: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class TokenUser(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=8)
    role: str = Field(default="user", pattern="^(admin|user)$")

    @field_validator("username")
    @classmethod
    def _check_dextro_domain(cls, v: str) -> str:
        if not _EMAIL_RE.match(v):
            raise ValueError("O email deve ter o domínio @dextro")
        return v.lower()


class ResetPassword(BaseModel):
    new_password: str = Field(..., min_length=8)
