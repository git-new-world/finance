from apps.feature.integrations.paddleocr.adapter import PaddleocrAdapter


def test_paddleocr_adapter_probe():
    result = PaddleocrAdapter().probe()
    assert "package_name" in result
