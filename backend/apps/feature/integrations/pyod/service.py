from .adapter import PyodAdapter


def get_pyod_status() -> dict:
    return PyodAdapter().probe()
