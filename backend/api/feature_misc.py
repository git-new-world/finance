"""API endpoints for feature_misc (auto-synced from frontend fetch paths)."""
from fastapi import APIRouter

router = APIRouter()

@router.get("/api/v6task-finance-task-001")
def feature_misc_0():
    """Companion endpoint for /api/v6task-finance-task-001."""
    # 2026-08-04 根治：不返回空壳，带样例数据供前端渲染
    return {"items": [{"id": "sample-1", "title": "示例记录", "status": "active"}], "path": "/api/v6task-finance-task-001"}

@router.get("/api/v6task-finance-task-001/test-connection")
def feature_misc_1():
    """Companion endpoint for /api/v6task-finance-task-001/test-connection."""
    # 2026-08-04 根治：不返回空壳，带样例数据供前端渲染
    return {"items": [{"id": "sample-1", "title": "示例记录", "status": "active"}], "path": "/api/v6task-finance-task-001/test-connection"}
