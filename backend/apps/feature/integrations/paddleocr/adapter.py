"""Adapter for AppDirector-selected module: paddleocr."""
from __future__ import annotations

import importlib
from typing import Any
from celery import shared_task

from paddleocr import PaddleOCR
import re
import json
from typing import Dict, Any

class PaddleOCRAdapter:
    def __init__(self, lang='ch', use_angle_cls=True, show_log=False):
        self.ocr = PaddleOCR(lang=lang, use_angle_cls=use_angle_cls, show_log=show_log)

    def ocr_image(self, image_path):
        result = self.ocr.ocr(image_path, cls=True)
        texts = [line[1][0] for line in result[0] if line]
        return texts

    # region INFO
    ...
    # endregion


class PaddleocrAdapter:
    package_name = "paddleocr"
    import_name = "paddleocr"

    def load(self) -> Any:
        return importlib.import_module(self.import_name)

    def probe(self) -> dict[str, Any]:
        module = self.load()
        return {
            "package_name": self.package_name,
            "import_name": self.import_name,
            "module_file": getattr(module, "__file__", ""),
            "loaded": True,
        }

    def execute(self, **kwargs: Any) -> str:
        module = self.load()
        return f"{self.package_name} executed"

    def get_info(self) -> dict[str, str]:
        # {{ AI_FILL:INFO }}
        return {"name": self.package_name}
