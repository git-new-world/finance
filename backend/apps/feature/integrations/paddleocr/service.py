from .adapter import PaddleocrAdapter


def get_paddleocr_status() -> dict:
    return PaddleocrAdapter().probe()
