from .adapter import ReportlabAdapter


def get_reportlab_status() -> dict:
    return ReportlabAdapter().probe()
