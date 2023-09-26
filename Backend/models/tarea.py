from dataclasses import dataclass
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, DateTime, ForeignKey
from db import db

@dataclass
class Tarea(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    descripcion: Mapped[str] = mapped_column(String(255))  
    realizada: Mapped[bool] = mapped_column(Boolean())
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuario.id"))
    fecha: Mapped[DateTime] = mapped_column(DateTime())
    usuario: Mapped["Usuario"] = relationship(back_populates="tareas")