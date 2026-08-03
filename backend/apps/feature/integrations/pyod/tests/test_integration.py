from apps.feature.integrations.pyod.adapter import PyodAdapter


def test_pyod_adapter_probe():
    result = PyodAdapter().probe()
    assert "package_name" in result
