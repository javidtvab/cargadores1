# app/routers/__init__.py

# Importa y expone todos los routers del proyecto para facilitar su uso.
from .chargers import router as chargers_router
from .sessions import router as sessions_router
from .rates import router as rates_router
from .invoices import router as invoices_router
from .users import router as users_router
from .statistics import router as statistics_router
from .payments import router as payments_router
