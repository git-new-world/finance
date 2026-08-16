from apps.feature.integrations.celery.adapter import CeleryAdapter


def test_celery_adapter_probe():
    result = CeleryAdapter().probe()
    assert "package_name" in result
