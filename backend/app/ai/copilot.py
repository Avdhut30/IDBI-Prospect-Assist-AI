from .data_copilot import answer_data_question


def run_copilot(question: str):
    result = answer_data_question(question)

    return {
        "intent": result["intent"],
        "answer": result["answer"],
    }
