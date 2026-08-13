import unittest
from unittest.mock import patch

from app.services import gemini_service
from app.services.chat import detect_language, get_chatbot_reply


class GeminiServiceTests(unittest.TestCase):
    def test_detect_language_english(self):
        self.assertEqual(detect_language("Hello"), "en")
        self.assertEqual(detect_language("What is a birth certificate?"), "en")
        self.assertEqual(detect_language("Show my documents"), "en")
    
    def test_detect_language_telugu(self):
        self.assertEqual(detect_language("నమస్కారం"), "te")
        self.assertEqual(detect_language("నా పత్రాలను చూపించు"), "te")
        self.assertEqual(detect_language("కుల ధృవీకరణ పత్రం ఎలా పొందాలి?"), "te")
    
    def test_detect_language_hindi(self):
        self.assertEqual(detect_language("नमस्ते"), "hi")
        self.assertEqual(detect_language("मेरे दस्तावेज़ दिखाओ"), "hi")
        self.assertEqual(detect_language("डिजिटल सरकारी दस्तावेज़ रखना क्यों उपयोगी है?"), "hi")
    
    def test_detect_language_kannada(self):
        self.assertEqual(detect_language("ನಮಸ್ಕಾರ"), "kn")
        self.assertEqual(detect_language("ನನ್ನ ದಾಖಲೆಗಳನ್ನು ತೋರಿಸಿ"), "kn")
        self.assertEqual(detect_language("ಡಿಜಿಟಲ್ ಸರ್ಕಾರಿ ದಾಖಲೆಗಳನ್ನು ಇಟ್ಟುಕೊಳ್ಳುವುದು ಏಕೆ ಉಪಯುಕ್ತ?"), "kn")

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
        self.assertIn("Respond in the same language as the user", kwargs["config"].system_instruction)
        self.assertIn("Hindi", kwargs["config"].system_instruction)
        self.assertIn("Kannada", kwargs["config"].system_instruction)

    @patch.object(gemini_service.settings, "GEMINI_API_KEY", "test-key")
    @patch("app.services.gemini_service.genai.Client")
    def test_returns_none_when_gemini_raises(self, mock_client):
        mock_client.return_value.models.generate_content.side_effect = Exception("boom")

        self.assertIsNone(gemini_service.generate_gemini_response("Hello"))

    def test_document_action_requests_english(self):
        for message in (
            "Show my documents",
            "Open my documents",
            "View my documents",
            "Show my uploaded documents",
            "Where can I find my documents?",
        ):
            response = get_chatbot_reply(message)
            self.assertEqual(response.action, "documents")
    
    def test_document_action_requests_telugu(self):
        response = get_chatbot_reply("నా పత్రాలను చూపించు")
        self.assertEqual(response.action, "documents")
    
    def test_document_action_requests_hindi(self):
        response = get_chatbot_reply("मेरे दस्तावेज़ दिखाओ")
        self.assertEqual(response.action, "documents")
    
    def test_document_action_requests_kannada(self):
        response = get_chatbot_reply("ನನ್ನ ದಾಖಲೆಗಳನ್ನು ತೋರಿಸಿ")
        self.assertEqual(response.action, "documents")

    @patch("app.services.chat.generate_gemini_response", return_value="Digital copies help citizens access records quickly.")
    def test_informational_document_questions_english_fall_through_to_gemini(self, _mock_gemini):
        for message in (
            "Explain why keeping digital government documents is useful.",
            "Why should citizens keep digital copies of government documents?",
            "What are the benefits of digital government documents?",
        ):
            response = get_chatbot_reply(message)
            self.assertEqual(response.action, "help")
    
    @patch("app.services.chat.generate_gemini_response", return_value="डिजिटल सरकारी दस्तावेज़ नागरिकों को तेजी से रिकॉर्ड तक पहुंचने में मदद करते हैं।")
    def test_informational_document_questions_hindi_fall_through_to_gemini(self, _mock_gemini):
        response = get_chatbot_reply("डिजिटल सरकारी दस्तावेज़ रखना क्यों उपयोगी है?")
        self.assertEqual(response.action, "help")
    
    @patch("app.services.chat.generate_gemini_response", return_value="డిజిటల్ సర్కారీ పత్రాలు ఉపయోగకరంగా ఉంటాయి.")
    def test_informational_document_questions_telugu_fall_through_to_gemini(self, _mock_gemini):
        response = get_chatbot_reply("డిజిటల్ ప్రభుత్వ పత్రాలను ఉంచుకోవడం ఎందుకు ఉపయోగకరం?")
        self.assertEqual(response.action, "help")
    
    @patch("app.services.chat.generate_gemini_response", return_value="ಡಿಜಿಟಲ್ ಸರ್ಕಾರಿ ದಾಖಲೆಗಳು ನಾಗರಿಕರಿಗೆ ತ್ವರಿತವಾಗಿ ರೆಕಾರ್ಡ್‌ಗಳನ್ನು ಪ್ರವೇಶಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.")
    def test_informational_document_questions_kannada_fall_through_to_gemini(self, _mock_gemini):
        response = get_chatbot_reply("ಡಿಜಿಟಲ್ ಸರ್ಕಾರಿ ದಾಖಲೆಗಳನ್ನು ಇಟ್ಟುಕೊಳ್ಳುವುದು ಏಕೆ ಉಪಯುಕ್ತ?")
        self.assertEqual(response.action, "help")
    
    def test_hindi_greeting_returns_hindi_response(self):
        response = get_chatbot_reply("नमस्ते")
        self.assertEqual(response.action, "help")
        # Check that response contains Hindi characters
        self.assertTrue(any("\u0900" <= char <= "\u097F" for char in response.reply))
    
    def test_kannada_greeting_returns_kannada_response(self):
        response = get_chatbot_reply("ನಮಸ್ಕಾರ")
        self.assertEqual(response.action, "help")
        # Check that response contains Kannada characters
        self.assertTrue(any("\u0C80" <= char <= "\u0CFF" for char in response.reply))

    def test_existing_english_chatbot_behavior_is_unchanged(self):
        response = get_chatbot_reply("Hello")
        self.assertEqual(response.action, "help")
    
    def test_hindi_diacritic_document_words(self):
        """Test Hindi diacritic variations for document requests."""
        response1 = get_chatbot_reply("मेरे दस्तावेज़ दिखाओ")  # with diacritic
        response2 = get_chatbot_reply("मेरे दस्तावेज दिखाओ")   # without diacritic
        self.assertEqual(response1.action, "documents")
        self.assertEqual(response2.action, "documents")
    
    def test_kannada_document_action_variations(self):
        """Test Kannada variations for document requests."""
        for message in (
            "ನನ್ನ ದಾಖಲೆಗಳನ್ನು ತೋರಿಸಿ",
            "ನನ್ನ ದಾಖಲೆಗಳನ್ನು ತೋರಿಸು",
            "ನನ್ನ ದಾಖಲೆಗಳು ಎಲ್ಲಿವೆ",
        ):
            response = get_chatbot_reply(message)
            self.assertEqual(response.action, "documents")


if __name__ == "__main__":
    unittest.main()
