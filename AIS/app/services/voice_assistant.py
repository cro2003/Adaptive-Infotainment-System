import openai
from config import Config

class VoiceAssistantService:
    @staticmethod
    def respond(user_input):
        openai.api_key = Config.OPENAI_API_KEY
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=user_input,
            max_tokens=50
        )
        return response.choices[0].text.strip()
