import sys
import types
import unittest

# Import-only Groq stub: tests must never make live provider calls.
groq_stub = types.ModuleType("groq")

class AsyncGroq:
    def __init__(self, *args, **kwargs):
        pass

class APIError(Exception):
    pass

groq_stub.AsyncGroq = AsyncGroq
groq_stub.APIError = APIError
sys.modules.setdefault("groq", groq_stub)

from backend import backend


class TestExistingApologyGuard(unittest.TestCase):
    def test_new_apology_is_detected(self):
        self.assertTrue(backend.has_unsupported_apology(
            "Please respond.",
            "I'm sorry for the delay."
        ))

    def test_existing_apology_can_be_rephrased(self):
        self.assertFalse(backend.has_unsupported_apology(
            "I'm sorry for the delay.",
            "I apologize for the delay."
        ))

    def test_no_new_apology_is_allowed(self):
        self.assertFalse(backend.has_unsupported_apology(
            "Please respond.",
            "Please respond to my complaint."
        ))

    def test_additional_apology_is_detected(self):
        self.assertTrue(backend.has_unsupported_apology(
            "I'm sorry.",
            "I'm sorry. I regret the delay."
        ))

    def test_kiswahili_apology_coverage_gap_is_documented(self):
        # Known limitation: the current helper does not recognize this phrase.
        self.assertFalse(backend.has_unsupported_apology(
            "Nijibu tafadhali.",
            "Samahani kwa kuchelewa."
        ))


if __name__ == "__main__":
    unittest.main(verbosity=2)
