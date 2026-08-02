from apps.feature.integrations.transformers.adapter import TransformersAdapter


def test_transformers_adapter_probe():
    result = TransformersAdapter().probe()
    assert "package_name" in result
