from AI_back.src.algorithm.model.bert import Bert
import torch
from bert_serving.client import BertClient



class BertPredictor:
    def __init__(self):
        self.net = Bert(768,8)
        self.net = self.net.to(torch.device('cpu'))
        self.net.load_state_dict(torch.load('AI_back/src/algorithm/model_bert.pt'))
        self.bc = BertClient()
    def predict(self,input):
        input_array = torch.tensor(self.bc.encode([input]))
        output = self.net(input_array)
        return output.detach().numpy().tolist()[0]
    def format_predict(self,input):
        print('format predict', input)
        re = ['0','0','0','0','0','0','0','0']
        sentiment_mapping = self.predict(input)
        print('sentiment_mapping: ', sentiment_mapping)
        sentiment_mapping = [(idx,v) for idx,v in enumerate(sentiment_mapping)]
        sentiment_mapping = sorted(sentiment_mapping, key=lambda d:d[1], reverse=True)
        re[sentiment_mapping[0][0]] = '1'
        if sentiment_mapping[0][1] - sentiment_mapping[1][1] < 0.1:
            re[sentiment_mapping[1][0]] = '1'

        # print('format predict: ', re)
        return ''.join(re)
