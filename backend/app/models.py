from pydantic import BaseModel


class UserCreate(BaseModel):
    display_name: str


class FutureSelfCreate(BaseModel):
    user_id: str
    statement: str


class PillarCreate(BaseModel):
    future_self_id: str
    name: str


class JournalCreate(BaseModel):
    user_id: str
    text: str