import numpy as np
import torch
from torchtext.vocab import Vectors
import pickle as pkl
from AI_back.src.settings import *
from AI_back.src.algorithm.model.birnn import BiRNN

def load_pretrained_embedding(words, pretrained_vocab):
    """从预训练好的vocab中提取出words对应的词向量"""
    embed = torch.zeros(len(words), pretrained_vocab.vectors[0].shape[0]) # 初始化为0
    oov_count = 0 # out of vocabulary
    for i, word in enumerate(words):
        try:
            idx = pretrained_vocab.stoi[word]
            embed[i, :] = pretrained_vocab.vectors[idx]
        except KeyError:
            oov_count += 0
    if oov_count > 0:
        print("There are %d oov words.")
    return embed

class RnnPredictor:
    vocab = pkl.load(open('AI_back/src/algorithm/model/vocab.pkl', 'rb'))
    embed_size, num_hiddens, num_layers, output_dim = 300, 100, 2, 8
    Embedding_path = 'AI_back/src/algorithm/model/sgns.weibo.word'
    net = BiRNN(vocab, embed_size, num_hiddens, num_layers)
    vectors = Vectors(name=Embedding_path)

    net.embedding.weight.data.copy_(
        load_pretrained_embedding(vocab.itos, vectors))
    net.embedding.weight.requires_grad = False
    net.load_state_dict(torch.load('AI_back/src/algorithm/model/model.pt'))
    # net = torch.load('AI_back/src/algorithm/model/model.pt', map_location=lambda storage, loc: storage)

    @staticmethod
    def preprocess_imdb(data, vocab):
        max_l = 500  # 将每条评论通过截断或者补0，使得长度变成500
        def pad(x):
            return x[:max_l] if len(x) > max_l else x + [0] * (max_l - len(x))
        # print(data)
        tokenized_data = data.split(' ')
        features = torch.tensor([pad([vocab.stoi[word] for word in tokenized_data])])
        return features

    @staticmethod
    def predict(input):
        net = RnnPredictor.net.to(torch.device('cpu'))
        input = RnnPredictor.preprocess_imdb(input, RnnPredictor.vocab)
        output = net(input)
        tmp = output.detach().numpy().tolist()
        sentiment_mapping = {}

        for k in sentiment2num.keys():
            sentiment_mapping[k] = tmp[0][sentiment2num[k]]
        return sentiment_mapping

    @staticmethod
    def format_predict(input):
        # print('format predict')
        re = ['0','0','0','0','0','0','0','0']
        sentiment_mapping = RnnPredictor.predict(input)
        print('sentiment_mapping: ', sentiment_mapping)

        for k,v in sentiment_mapping.items():
            if v > 0.125:
                re[sentiment2num[k]] = '1'
        print('format predict: ', re)
        return ''.join(re)

# predict(input, net)
# RnnPredictor.predict("我 今天 失业 了 非常 伤心 想 打人")