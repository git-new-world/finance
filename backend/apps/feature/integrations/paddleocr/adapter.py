"""Adapter for AppDirector-selected module: paddleocr."""
from __future__ import annotations

import importlib
from typing import Any

pass


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
        return {
            "name": "paddleocr",
            "version": PaddleOCR.__version__,
        }
        return {"name": self.package_name}
