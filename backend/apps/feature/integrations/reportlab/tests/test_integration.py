from apps.feature.integrations.reportlab.adapter import ReportlabAdapter


def test_reportlab_adapter_probe():
    result = ReportlabAdapter().probe()
    assert "package_name" in result
