"""Adapter for AppDirector-selected module: transformers."""
from __future__ import annotations

import importlib
from typing import Any

# EXECUTE
# TODO: Implement execute


class TransformersAdapter:
    package_name = "transformers"
    import_name = "transformers"

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
        # INFO region start
        # TODO: implement info
        # INFO region end
        return {"name": self.package_name}
