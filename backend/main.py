"""Finance backend FastAPI application (Tasker-generated complete implementation).

Registers health/root endpoints + feature companion API routers
(backend/api/contrib_routers.py — from frontend feature tasks).
"""
from fastapi import FastAPI

app = FastAPI()


@app.get('/health')
def health():
    return {'status': 'ok'}


@app.get('/')
def home():
    return {'status': 'Application ready'}


# Feature companion API endpoints (9 x /api/v6task-finance-task-*)
try:
    from backend.api.contrib_routers import contrib_router
    app.include_router(contrib_router)
except ImportError:
    pass
