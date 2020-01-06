
from torch import nn
import torch
import torch.nn.functional as F

class Bert(nn.Module):
    def __init__(self,input_dim,output_dim):
        super(Bert, self).__init__()
        self.decoder = nn.Linear(input_dim, output_dim)
        hidden_dim = 100
        self.out1 = nn.Linear(input_dim, hidden_dim)
        self.mlp = nn.Sequential(nn.Linear(hidden_dim, output_dim))
        # self.decoder = nn.Linear(input_dim, output_dim)
    def forward(self, input):
        out1 = self.out1(input)
        outs = self.mlp(F.relu(out1))
        # outs = self.decoder(input)
        return outs
