"""Aggregate companion API routers from frontend feature tasks.

Integrator: include this router into the main FastAPI app:
    from backend.api.contrib_routers import contrib_router
    app.include_router(contrib_router)
"""
from fastapi import APIRouter
from .v6task_finance_task_001 import router as r0
from .v6task_finance_task_003 import router as r1
from .v6task_finance_task_005 import router as r2
from .v6task_finance_task_006 import router as r3
from .v6task_finance_task_008 import router as r4
from .v6task_finance_task_010 import router as r5
from .v6task_finance_task_012 import router as r6
from .v6task_finance_task_014 import router as r7
from .v6task_finance_task_016 import router as r8

contrib_router = APIRouter()
contrib_router.include_router(r0)
contrib_router.include_router(r1)
contrib_router.include_router(r2)
contrib_router.include_router(r3)
contrib_router.include_router(r4)
contrib_router.include_router(r5)
contrib_router.include_router(r6)
contrib_router.include_router(r7)
contrib_router.include_router(r8)
