"""Adapter for AppDirector-selected module: celery."""
from __future__ import annotations

import importlib
from typing import Any
from celery import shared_task

# {{ AI_FILL:EXECUTE }}


class CeleryAdapter:
    package_name = "celery"
    import_name = "celery"

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
