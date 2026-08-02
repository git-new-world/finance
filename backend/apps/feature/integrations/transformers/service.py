from .adapter import TransformersAdapter


def get_transformers_status() -> dict:
    return TransformersAdapter().probe()
