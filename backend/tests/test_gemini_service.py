import unittest
from unittest.mock import patch

from app.services import gemini_service
from app.services.chat import get_chatbot_reply


class GeminiServiceTests(unittest.TestCase):
    @patch.object(gemini_service.settings, "GEMINI_API_KEY", None)
    def test_returns_none_without_api_key(self):
        self.assertIsNone(gemini_service.generate_gemini_response("Hello"))

    @patch.object(gemini_service.settings, "GEMINI_API_KEY", "test-key")
    @patch("app.services.gemini_service.genai.Client")
    def test_returns_text_for_successful_gemini_response(self, mock_client):
        mock_response = type("Response", (), {"text": "Hello from Gemini"})()
        mock_client.return_value.models.generate_content.return_value = mock_response

        result = gemini_service.generate_gemini_response("Hello")

        self.assertEqual(result, "Hello from Gemini")
        mock_client.return_value.models.generate_content.assert_called_once()
        _, kwargs = mock_client.return_value.models.generate_content.call_args
        self.assertEqual(kwargs["model"], "models/gemini-flash-latest")
        self.assertEqual(kwargs["contents"], "Hello")
        self.assertIsInstance(kwargs["config"], gemini_service.types.GenerateContentConfig)
        self.assertEqual(kwargs["config"].system_instruction, gemini_service.SYSTEM_PROMPT)

    @patch.object(gemini_service.settings, "GEMINI_API_KEY", "test-key")
    @patch("app.services.gemini_service.genai.Client")
    def test_returns_none_when_gemini_raises(self, mock_client):
        mock_client.return_value.models.generate_content.side_effect = Exception("boom")

        self.assertIsNone(gemini_service.generate_gemini_response("Hello"))

    def test_document_action_requests_still_trigger_documents_action(self):
        for message in (
            "Show my documents",
            "Open my documents",
            "View my documents",
            "Show my uploaded documents",
            "Where can I find my documents?",
        ):
            response = get_chatbot_reply(message)
            self.assertEqual(response.action, "documents")

    @patch("app.services.chat.generate_gemini_response", return_value="Digital copies help citizens access records quickly.")
    def test_informational_document_questions_fall_through_to_gemini(self, _mock_gemini):
        for message in (
            "Explain why keeping digital government documents is useful.",
            "Why should citizens keep digital copies of government documents?",
            "What are the benefits of digital government documents?",
            "Why is it useful to keep government documents digitally?",
            "Explain the importance of keeping digital documents.",
        ):
            response = get_chatbot_reply(message)
            self.assertEqual(response.action, "help")
            self.assertEqual(response.reply, "Digital copies help citizens access records quickly.")


if __name__ == "__main__":
    unittest.main()
