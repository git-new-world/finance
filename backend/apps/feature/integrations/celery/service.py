from .adapter import CeleryAdapter


def get_celery_status() -> dict:
    return CeleryAdapter().probe()
