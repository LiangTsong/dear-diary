from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

class Digest:
    @staticmethod
    def get_digest_sumy(input_str, sentence_count):

        LANGUAGE = "chinese"
        parser = PlaintextParser.from_string(input_str, Tokenizer(LANGUAGE))
        stemmer = Stemmer(LANGUAGE)

        summarizer = Summarizer(stemmer)
        summarizer.stop_words = get_stop_words(LANGUAGE)
        # print(parser.document)
        re = ''
        for sentence in summarizer(parser.document, sentence_count):
            re+=str(sentence)
        return re

# print(Digest.get_digest_sumy('我是你爸，真可爱哈哈哈。我是叶子逸。',2))