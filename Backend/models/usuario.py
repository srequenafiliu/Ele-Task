from dataclasses import dataclass
from typing import List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from db import db

@dataclass
class Usuario(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    usuario: Mapped[str] = mapped_column(String(255), unique=True)
    password: Mapped[str] = mapped_column(String(255))
    imagen: Mapped[str] = mapped_column(String(255), nullable=True)
    tareas: Mapped[List["Tarea"]] = relationship(back_populates="usuario", cascade="all, delete-orphan")